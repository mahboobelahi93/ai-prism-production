// src/actions/get-user-role.ts
"use server";

import { UserRole } from "@prisma/client"; // Assuming you have this enum in your Prisma schema

import { prisma as db } from "@/lib/db"; // Your Prisma client instance

/**
 * Fetches a user's role from the database based on their Clerk ID.
 * @param clerkId The Clerk ID of the user.
 * @returns The user's role as a string, or null if not found.
 */
export async function getUserRoleFromDb(
  clerkId: string,
): Promise<UserRole | null> {
  try {
    const user = await db.user.findUnique({
      where: { clerkId: clerkId },
      select: { role: true }, // Only select the role field
    });

    return user?.role || null;
  } catch (error) {
    console.error("Error fetching user role from DB:", error);
    // In a production app, you might want to log this error more robustly
    // and potentially return a default safe role or throw a more specific error.
    return null;
  }
}
