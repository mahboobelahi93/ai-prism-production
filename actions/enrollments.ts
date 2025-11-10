"use server";

import EnrollmentStatusEmail from "@/emails/enrollment-notification-email";
import SubscriptionNotificationEmail from "@/emails/subscription-notification-email";
import { auth } from "@clerk/nextjs/server";
import { EnrollStatus } from "@prisma/client";
import { Resend } from "resend";

import { getCurrentUser, getCurrentUserId } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";

export async function getUserEnrollmentStatus(
  pilotId: string,
): Promise<EnrollStatus | null> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }
    const enrollment = await prisma.enrollActivity.findFirst({
      where: {
        userId: userId,
        pilotId: pilotId,
      },
    });

    if (!enrollment) {
      console.log("No enrollment found for this user and pilot.");
      return null;
    }

    // Return the enrollment status if enrollment exists
    return enrollment.enrollStatus;
  } catch (error) {
    console.error("Error checking enrollment status:", error);
    return null;
  }
}

export async function enrollInPilot(
  pilotId: string,
): Promise<{ success: boolean; message: string; user: any | undefined }> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }

  console.log("Enrolling user ID:", userId, "in pilot ID:", pilotId);

  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      message: "User not found.",
      user: undefined,
    };
  }

  console.log("Current User:", user);

  try {
    const existingEnrollment = await prisma.enrollActivity.findFirst({
      where: {
        userId: userId,
        pilotId: pilotId,
      },
    });

    if (existingEnrollment) {
      return {
        success: false,
        message: "You have already requested enrollment for this course.",
        user: user ?? undefined,
      };
    }

    // Get the pilot to find the ownerId
    const pilot = await prisma.pilot.findUnique({
      where: { id: pilotId },
      select: { ownerId: true, title: true },
    });

    if (!pilot) {
      return { success: false, message: "Pilot not found.", user: undefined };
    }

    // Get the owner's email address
    const owner = await prisma.user.findUnique({
      where: { id: pilot.ownerId },
      select: { email: true },
    });

    const ownerDetails = await prisma.user.findUnique({
      where: { id: pilot.ownerId },
    });

    // Create a new enrollment with status PENDING
    await prisma.enrollActivity.create({
      data: {
        userId: userId,
        ownerId: ownerDetails?.id,
        pilotId: pilotId,
        enrollStatus: "PENDING",
        createdAt: new Date(),
      },
    });

    console.log("pilot title", pilot?.title);
    // Send email notification to the pilot owner
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "AI-PRISM <welcome@ai-prism.dev>",
      to: owner?.email ?? "",
      subject: "New Subscription Request",
      react: SubscriptionNotificationEmail({
        pilotTitle: pilot?.title,
        userName: user?.name ?? "",
        userEmail: user?.email ?? "",
      }),
    });

    return {
      success: true,
      message: "Enrollment request submitted successfully.",
      user: user ?? undefined,
    };
  } catch (error) {
    console.error("Error enrolling in pilot:", error);
    return {
      success: false,
      message: "Failed to enroll in the course.",
      user: undefined,
    };
  }
}

export async function getSubscriptionCounts() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }
  try {
    // Count of APPROVED enrollments where the current user is the owner
    const approvedCount = await prisma.enrollActivity.count({
      where: {
        ownerId: userId,
        enrollStatus: EnrollStatus.APPROVED,
      },
    });

    // Count of PENDING enrollments where the current user is the owner
    const pendingCount = await prisma.enrollActivity.count({
      where: {
        ownerId: userId,
        enrollStatus: EnrollStatus.PENDING,
      },
    });

    return {
      approvedCount,
      pendingCount,
    };
  } catch (error) {
    console.error("Error fetching subscription counts:", error);
    return {
      approvedCount: 0,
      pendingCount: 0,
    };
  }
}

export async function getAllEnrollments(
  page = 1,
  limit = 10,
  pilotId = null,
  offset = 0,
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const enrollments = await prisma.enrollActivity.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        pilot: {
          select: {
            title: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: "desc", // Sort by most recent
      },
    });

    return enrollments.map((enrollment) => ({
      id: enrollment.id,
      email: enrollment.user.email,
      pilot: enrollment.pilot.title,
      status: enrollment.enrollStatus,
      pilot_id: enrollment.pilotId,
      user_id: enrollment.user.id,
    }));
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return [];
  }
}

export async function updateEnrollmentStatus(
  enrollmentId: string,
  newStatus: EnrollStatus,
): Promise<{ success: boolean; message: string }> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }

  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      message: "User not found.",
      user: undefined,
    };
  }

  try {
    const updatedEnrollment = await prisma.enrollActivity.update({
      where: {
        id: enrollmentId,
        ownerId: userId,
      },
      data: {
        enrollStatus: newStatus,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        pilot: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!updatedEnrollment) {
      return {
        success: false,
        message: "Enrollment not found or you're not authorized to update it.",
      };
    }

    // Send email notification to the user
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "AI-PRISM <notifications@ai-prism.dev>",
      to: updatedEnrollment.user?.email,
      subject: `Enrollment ${newStatus.toLowerCase()} for ${updatedEnrollment.pilot?.title}`,
      react: EnrollmentStatusEmail({
        userName: updatedEnrollment.user.name || "User",
        pilotTitle: updatedEnrollment.pilot.title,
        ownerEmail: user?.email || "",
        status: newStatus === EnrollStatus.APPROVED ? "approved" : "rejected",
      }),
    });

    return {
      success: true,
      message: `Enrollment status updated to ${newStatus} and notification email sent.`,
    };
  } catch (error) {
    console.error("Error updating enrollment status:", error);
    return { success: false, message: "Failed to update enrollment status." };
  }
}
