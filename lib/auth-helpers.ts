import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/db";

export async function getCurrentUserId(): Promise<string | null> {
  try {
    const session = await auth();
    if (!session?.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: session.userId },
      select: { id: true },
    });

    if (!user) {
      console.error("User not found for clerkId:", session.userId);
      return null;
    }

    return user.id;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const session = await auth();
    if (!session?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { clerkId: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
