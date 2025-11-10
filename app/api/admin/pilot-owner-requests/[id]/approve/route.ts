import { isSuperAdmin, processPilotOwnerRequest } from "@/actions/check-user";
import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  // Get Clerk session
  const session = await auth();
  if (!session?.userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get full user object to read email
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  // ✅ Check against env-based list
  if (!isSuperAdmin(email)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const request = await prisma.pilotOwnerRequests.findUnique({
    where: { id: params.id },
  });

  if (!request) {
    return Response.json({ error: "Request not found" }, { status: 404 });
  }

  // Use your existing function - it handles email and user creation
  const result = await processPilotOwnerRequest(
    btoa(
      JSON.stringify({
        email: request.email,
        name: request.name,
        organization: request.organization,
        contactNumber: request?.contactNumber,
        purpose: request?.purpose,
        timestamp: Date.now(),
      }),
    ),
    "approve",
  );

  if (result.success) {
    // Update the request status in database
    await prisma.pilotOwnerRequests.update({
      where: { id: params.id },
      data: {
        status: "APPROVED",
        processedAt: new Date(),
        userId: result.user?.id, // Link to the created/updated user
      },
    });
  }

  if (result.user) {
    result.user = {
      ...result.user,
      storageUsed: result.user.storageUsed.toString(),
      storageLimit: result.user.storageLimit.toString(),
    };
  }

  return Response.json(result);
}
