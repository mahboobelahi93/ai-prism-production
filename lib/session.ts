import "server-only";

import { cache } from "react";
import { auth } from "@clerk/nextjs/server"; // NEW: Import Clerk's server-side auth

import { prisma } from "@/lib/db"; // Your Prisma client instance

/**
 * Fetches the current authenticated user's data from the database using Clerk's ID.
 * This function is cached for efficiency.
 * @returns The user object from your database, or undefined if not authenticated or user not found.
 */
export const getCurrentUser = cache(async () => {
  // Get the authenticated user's ID from Clerk
  const { userId: clerkUserId } = await auth();

  // If no Clerk user ID is found, the user is not authenticated
  if (!clerkUserId) {
    return undefined;
  }

  // Find the user in your database using their Clerk ID
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId }, // Query by the Clerk ID stored in your database
  });

  // Return the user object from your database, or undefined if not found
  return user || undefined;
});
