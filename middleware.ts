// export { auth as middleware } from "auth"

// // Or like this if you need to do something here.
// // export default auth((req) => {
// //   console.log(req.auth) //  { session: { user: { ... } } }
// // })

// // Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// }

// ###########################################

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { auth } from "@clerk/nextjs/server";

// import { prisma as db } from "@/lib/db";

// // List routes that should require a valid user record in your DB
// const protectedRoutes = ["/dashboard", "/account", "/profile"];

// export default async function middleware(req: NextRequest) {
//   const session = await auth();
//   if (!session?.userId) {
//     throw new Error("Unauthorized");
//   }

//   const userId = session.userId;

//   // Allow public routes
//   if (!protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path))) {
//     return NextResponse.next();
//   }

//   // If not authenticated in Clerk
//   if (!userId) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // Check if user exists in your database
//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//     select: { id: true },
//   });

//   if (!user) {
//     // User exists in Clerk but not in your DB
//     console.warn(`Blocked Clerk user ${userId} — not found in DB`);
//     return NextResponse.redirect(new URL("/unauthorized", req.url));
//   }

//   // Allow access
//   return NextResponse.next();
// }

// // Apply middleware only to protected routes
// export const config = {
//   matcher: ["/dashboard/:path*", "/account/:path*", "/profile/:path*"],
// };

//############################################

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/login(.*)",
//   "/register(.*)",
//   "/api/webhooks/clerk",
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   if (!isPublicRoute(req)) {
//     await auth.protect();
//   }
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/register(.*)",
  "/inactive(.*)", // ✅ exclude inactive page
  "/api/webhooks/clerk",
  "/api/check-user", // ✅ must stay public
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  const { userId } = await auth();

  // ✅ If not logged in, redirect to login
  if (!userId) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect_url", req.url);
    return Response.redirect(loginUrl, 302);
  }

  try {
    // ✅ Check active status
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/check-user?clerkId=${userId}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to check user");
    const data = await res.json();

    // ✅ If inactive → redirect once (not infinite)
    if (!data?.isActive) {
      // if user is inactive, don't let them hit private routes again
      const inactiveUrl = new URL("/inactive", req.url);
      inactiveUrl.searchParams.set(
        "message",
        "Your account is inactive. Please contact support.",
      );
      return Response.redirect(inactiveUrl, 302);
    }
  } catch (err) {
    console.error("Error checking user in middleware:", err);
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("message", "Error verifying your session.");
    return Response.redirect(loginUrl, 302);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
