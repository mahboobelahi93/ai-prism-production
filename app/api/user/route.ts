// app/api/user/[userId]/route.ts (or wherever your user deletion route is)
import { auth, clerkClient } from "@clerk/nextjs/server"; // NEW: Import Clerk's server-side auth and clerkClient

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

// Define the DELETE handler for user deletion
export const DELETE = async (
  req: Request,
  { params }: { params: { userId: string } }, // Assuming userId is passed in the URL params
) => {
  // Get the authenticated user's ID from Clerk
  const { userId: currentClerkUserId } = auth();

  // Check if the user is authenticated
  if (!currentClerkUserId) {
    return new Response("Not authenticated", { status: 401 });
  }

  // Get the target user ID from the request parameters
  const targetUserId = params.userId;

  // IMPORTANT: Implement authorization logic here.
  // A user should only be able to delete their own account,
  // or an admin should be able to delete any account.
  // For simplicity, this example only allows a user to delete their own account.
  if (currentClerkUserId !== targetUserId) {
    // You might also check roles here if an admin can delete others
    // e.g., if (!isAdmin(currentClerkUserId)) { return new Response("Forbidden", { status: 403 }); }
    return new Response("Forbidden: You can only delete your own account.", {
      status: 403,
    });
  }

  try {
    // 1. Delete the user from Clerk
    // This will also revoke their sessions.
    await clerkClient.users.deleteUser(targetUserId);
    console.log(`User deleted from Clerk: ${targetUserId}`);

    // 2. Delete the corresponding user record from your database
    // This assumes your `User` model has a `clerkId` field and it's unique.
    // If you're using webhooks for deletion (recommended), this step might be redundant here
    // as the `user.deleted` webhook would handle database cleanup.
    // However, if you want to ensure immediate deletion from your DB upon user-initiated delete,
    // you can keep this.
    await prisma.user.delete({
      where: {
        clerkId: targetUserId, // Use clerkId to find the user in your DB
      },
    });
    console.log(`User deleted from database: ${targetUserId}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    return new Response("Internal server error during user deletion.", {
      status: 500,
    });
  }

  return new Response("User deleted successfully!", { status: 200 });
};

export async function getCurrentUserStorage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: currentUser?.email ?? "" },
  });

  if (!user) {
    throw new Error("User not found");
  }
  return user;
}
