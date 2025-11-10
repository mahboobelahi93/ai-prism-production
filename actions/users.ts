"use server";

import clerkClient from "@clerk/clerk-sdk-node";
import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function getUsers({
  page,
  pageSize,
  search,
  role,
  status,
}: {
  page: number;
  pageSize: number;
  search?: string;
  role?: string | null;
  status?: string | null;
}) {
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role) where.role = role;
  if (status === "active") where.isActive = true;
  if (status === "suspended") where.isActive = false;

  const [data, filteredCount, activeCount, suspendedCount, total] =
    await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }), // count of filtered users
      prisma.user.count({ where: { isActive: true } }), // active
      prisma.user.count({ where: { isActive: false } }), // suspended
      prisma.user.count(), // count of ALL users
    ]);

  return { data, filteredCount, total, activeCount, suspendedCount };
}

// Delete user
export async function deleteUser(userId: string, password: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.id) {
    return { success: false, message: "Not authenticated" };
  }
  // Verify admin password
  const isPasswordValid = await verifyPassword(currentUser.clerkId, password);
  if (!isPasswordValid) {
    return { success: false, message: "Password verification failed" };
  }
  try {
    // Fetch the user to delete (to get Clerk ID)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Delete from Clerk if linked
    if (user.clerkId) {
      await clerkClient.users.deleteUser(user.clerkId);
    }

    // Delete from Prisma
    await prisma.user.delete({ where: { id: userId } });
    return { success: true, message: "User deleted successfully." };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Failed to delete user." };
  }
}

// Suspend or Reactivate user
export async function suspendUser({
  userId,
  suspend,
  reason,
}: {
  userId: string;
  suspend: boolean;
  reason?: string;
}) {
  try {
    const currentUser = await getCurrentUser();
    if (suspend) {
      // suspend user
      await prisma.user.update({
        where: { id: userId },
        data: {
          isActive: false,
          suspendedAt: new Date(),
          suspendedById: currentUser?.id ?? null,
          suspensionReason: reason ?? null,
        },
      });
      return { success: true, message: "User suspended." };
    } else {
      // reactivate user
      await prisma.user.update({
        where: { id: userId },
        data: {
          isActive: true,
          suspendedAt: null,
          suspendedById: null,
          suspensionReason: null,
        },
      });
      return { success: true, message: "User re-activated." };
    }
  } catch (error) {
    console.error("Error updating user suspension:", error);
    return { success: false, message: "Failed to update user suspension." };
  }
}

// Change role
export async function changeUserRole(userId: string, role: any) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return { success: true, message: `User role changed to ${role}.` };
  } catch (error) {
    console.error("Error changing user role:", error);
    return { success: false, message: "Failed to change user role." };
  }
}

export async function verifyPassword(userId: string, password: string) {
  try {
    // This is the recommended way using Clerk's API to reauthenticate
    const session = await clerkClient.users.verifyPassword({
      userId, // admin user ID
      password, // entered password
    });

    if (session) return true;
    return false;
  } catch (err) {
    console.error("Password verification failed:", err);
    return false;
  }
}

export async function getUserById(userId: string) {
  console.log("Fetching user by ID:", userId);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    console.log("getUserById result:", user);
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Update user
export async function updateUser(
  userId: string,
  {
    name,
    email,
    image,
    role,
    isActive,
    isSuspended,
    storageLimit,
    suspensionReason,
  }: {
    name: string;
    email: string;
    image: string;
    role: UserRole;
    isActive: boolean;
    isSuspended: boolean;
    storageLimit: string;
    suspensionReason: string;
  },
) {
  try {
    // Fetch the user to update (to get Clerk ID)
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Update Clerk user if linked
    if (user.clerkId) {
      await clerkClient.users.updateUser(user.clerkId, {
        firstName: name,
      });
    }

    // Update Prisma user
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        image,
        role,
        isActive: isSuspended ? false : isActive,
        storageLimit: BigInt(storageLimit),
        suspensionReason,
      },
    });

    return { success: true, message: "User updated successfully." };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Failed to update user." };
  }
}
