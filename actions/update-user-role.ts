"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { UserRole } from "@prisma/client";

import { getCurrentUserId } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { userRoleSchema } from "@/lib/validations/user";

export type FormData = {
  role: UserRole;
};

export async function updateUserRole(userId: string, data: FormData) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    if (userId !== userId) {
      throw new Error("Unauthorized");
    }

    const { role } = userRoleSchema.parse(data);

    // Update the user role.
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: role,
      },
    });

    revalidatePath("/dashboard/settings");
    return { status: "success" };
  } catch (error) {
    // console.log(error)
    return { status: "error" };
  }
}
