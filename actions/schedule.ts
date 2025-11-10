"use server";

import { revalidatePath } from "next/cache";
import ScheduleNotificationEmail from "@/emails/schedule-notification-email";
import ScheduleAcceptedEmail from "@/emails/scheduleAcceptedEmail";
import ScheduleLaterEmail from "@/emails/scheduleLaterEmail";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Resend } from "resend";

import { getCurrentUser, getCurrentUserId } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";

/**
 * Fetches pilot names and their owners where the current user:
 * 1. Has approved enrollment
 * 2. Has passed at least one quiz
 *
 * @returns Formatted dropdown options with pilot name and owner
 */
export async function getPilotsForDropdown() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get pilots where user has approved enrollment AND passed at least one quiz
    const approvedAndPassedPilots = await prisma.pilot.findMany({
      where: {
        // User must have approved enrollment
        enrollments: {
          some: {
            userId: userId,
            enrollStatus: "APPROVED",
          },
        },
        // User must have passed at least one quiz for this pilot
        QuizInfo: {
          some: {
            attempts: {
              some: {
                userId: userId,
                result: {
                  passed: true,
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        title: true, // Pilot name
        ownerId: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    // Get owner information for all pilots in a single query
    const ownerIds = approvedAndPassedPilots.map((pilot) => pilot.ownerId);
    const owners = await prisma.user.findMany({
      where: {
        id: { in: ownerIds },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Create lookup map for owners
    const ownerMap = {};
    owners.forEach((owner) => {
      ownerMap[owner.id] = {
        name: owner.name || "Unknown",
        email: owner.email || "No email",
      };
    });

    // Format for dropdown options
    const dropdownOptions = approvedAndPassedPilots.map((pilot) => ({
      value: pilot.id,
      label: pilot.title,
      email: ownerMap[pilot.ownerId].email,
    }));

    return {
      success: true,
      data: dropdownOptions,
    };
  } catch (error) {
    console.error("Error fetching pilots for dropdown:", error);
    return {
      success: false,
      message: "Failed to fetch pilots",
      data: [],
    };
  }
}

/**
 * Creates a new schedule request for a pilot
 * - Checks for existing Pending schedules
 * - Verifies user eligibility (approved enrollment, passed quiz)
 * - Sends email to instructor
 *
 * @param pilotId - The ID of the pilot course
 * @param scheduledDateTime - ISO string for proposed meeting time
 * @param message - Optional pilotuser message
 * @returns Success status and schedule data or error message
 */

export async function createSchedule({
  pilotId,
  scheduledDateTime,
  message,
}: {
  pilotId: string;
  scheduledDateTime: string;
  message?: string;
}) {
  try {
    if (!prisma) {
      throw new Error("Database connection error: Prisma client is undefined");
    }

    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const date = new Date(scheduledDateTime);
    if (isNaN(date.getTime())) {
      return {
        success: false,
        message: "Invalid date format",
        data: null,
      };
    }

    if (date < new Date()) {
      return {
        success: false,
        message: "Scheduled date must be in the future",
        data: null,
      };
    }

    const existingSchedule = await prisma.schedule.findFirst({
      where: {
        pilotId,
        userId: userId,
        status: "PENDING",
      },
      select: {
        id: true,
        status: true,
        scheduledDateTime: true,
      },
    });

    if (existingSchedule) {
      return {
        success: false,
        message: `You already have a pending schedule request for ${new Date(existingSchedule.scheduledDateTime).toLocaleString()}`,
        data: existingSchedule,
      };
    }

    const pilot = await prisma.pilot.findUnique({
      where: { id: pilotId },
      select: {
        id: true,
        ownerId: true,
        title: true,
        enrollments: {
          where: {
            userId: userId,
            enrollStatus: "APPROVED",
          },
          select: {
            id: true,
            enrollStatus: true,
          },
        },
        QuizInfo: {
          where: {
            attempts: {
              some: {
                userId: userId,
                result: {
                  passed: true,
                },
              },
            },
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!pilot) {
      return {
        success: false,
        message: "Pilot not found",
        data: null,
      };
    }

    const owner = await prisma.user.findUnique({
      where: { id: pilot.ownerId },
      select: {
        email: true,
        name: true,
      },
    });

    if (!owner?.email) {
      return {
        success: false,
        message: "Pilot owner information not found",
        data: null,
      };
    }

    // Check eligibility
    const isEnrolled = pilot?.enrollments.length > 0;
    const hasPassedQuiz = pilot?.QuizInfo.length > 0;

    if (!isEnrolled) {
      return {
        success: false,
        message: "You must be enrolled and approved for this pilot",
        data: null,
      };
    }

    if (!hasPassedQuiz) {
      return {
        success: false,
        message: "You must pass the pilot quiz before scheduling",
        data: null,
      };
    }

    const schedule = await prisma.schedule.create({
      data: {
        pilotId,
        userId: userId,
        ownerId: pilot.ownerId,
        scheduledDateTime: date,
        message: message || null,
        status: "PENDING",
        finalMessage: null,
      },
    });

    // Send notification email (non-blocking)
    let emailSent = false;
    try {
      if (!process.env.RESEND_API_KEY) {
      } else {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "AI-PRISM <subscription@ai-prism.dev>",
          to: owner?.email,
          subject: `New Schedule Request for ${pilot.title}`,
          react: ScheduleNotificationEmail({
            pilot: pilot.title,
            requestedTime: date,
            currentUserEmail: user.email || "Unknown",
            currentUserName: user.name || "Unknown User",
            message: message || "No additional message",
          }),
        });
        emailSent = true;
      }
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
      // Don't fail the request if email fails
    }

    // Revalidate relevant paths
    revalidatePath("/schedule/pilot-user");
    revalidatePath(`/portal/pilots/${pilotId}`);

    return {
      success: true,
      message: emailSent
        ? "Schedule request submitted and notification sent"
        : "Schedule request submitted (notification failed)",
      data: schedule,
    };
  } catch (error) {
    console.error("Error creating schedule:", error);

    // Check for specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("Foreign key constraint")) {
        return {
          success: false,
          message: "Invalid pilot or user reference",
          data: null,
        };
      }
    }

    return {
      success: false,
      message: "Failed to create schedule request. Please try again.",
      data: null,
    };
  }
}

/**
 * Get schedules for the current user (pilotuser view)
 */
/**
 * Fetches schedules for the current user (student)
 * - Includes pilot title and owner name
 * - Supports pilotuser view of their schedules
 *
 * @returns Array of schedules with pilot and owner details
 */
type ScheduleResponse = {
  id: string;
  pilot: string;
  requestedTime: Date;
  pilotOwnerName: string;
  pilotOwnerEmail: string;
  status: string;
  finalMessage: string | null;
  lastUpdated: Date;
};

type GetSchedulesResult = {
  success: boolean;
  message?: string;
  data: ScheduleResponse[];
};

export async function getUserSchedules(): Promise<GetSchedulesResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    // Get internal user ID from Clerk ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found in database",
        data: [],
      };
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        userId: user.id, // Use internal DB ID
      },
      select: {
        id: true,
        pilot: {
          select: {
            title: true,
          },
        },
        scheduledDateTime: true,
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        status: true,
        finalMessage: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100, // Limit for performance
    });

    // Map to frontend format
    const formattedSchedules: ScheduleResponse[] = schedules.map(
      (schedule) => ({
        id: schedule.id,
        pilot: schedule.pilot?.title || "Unknown Pilot",
        requestedTime: schedule.scheduledDateTime,
        pilotOwnerName: schedule.owner?.name || "Unknown",
        pilotOwnerEmail: schedule.owner?.email || "Unknown",
        status: schedule.status,
        finalMessage: schedule.finalMessage,
        lastUpdated: schedule.updatedAt,
      }),
    );

    return {
      success: true,
      data: formattedSchedules,
    };
  } catch (error) {
    console.error("Error fetching user schedules:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch schedules. Please try again.",
      data: [],
    };
  }
}

export async function getSchedulesForOwner() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownerId = userId;
    const ownerEmail = user?.email;

    const schedules = await prisma.schedule.findMany({
      where: {
        ownerId,
      },
      select: {
        id: true,
        pilot: {
          select: {
            title: true,
          },
        },
        scheduledDateTime: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        status: true,
        finalMessage: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map to match frontend Schedule type
    const formattedSchedules = schedules.map((schedule) => ({
      id: schedule.id,
      pilot: schedule.pilot.title,
      requestedTime: schedule.scheduledDateTime,
      requestedUser: schedule.user.name || "Unknown",
      requestedUserEmail: schedule.user.email || "Unknown",
      status: schedule.status, // PENDING, ACCEPTED, FINALIZEDVIAEMAIL
      finalMessage: schedule.finalMessage,
      lastUpdated: schedule.updatedAt,
    }));

    return {
      success: true,
      data: formattedSchedules,
    };
  } catch (error) {
    console.error("Error fetching instructor schedules:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch schedules",
      data: [],
    };
  }
}

/**
 * Accepts a schedule request, setting status to ACCEPTED
 * - Only the instructor (ownerId) can accept
 * - Updates status and clears finalMessage
 *
 * @param scheduleId - The ID of the schedule to accept
 * @returns Success status and updated schedule data
 */
export async function acceptSchedule(scheduleId: string) {
  try {
    // Check if prisma is defined
    if (!prisma) {
      throw new Error("Database connection error: Prisma client is undefined");
    }

    const userId = await getCurrentUserId();
    if (!userId) {
      return {
        success: false,
        message: "Unauthorized: User not found",
        data: null,
      };
    }

    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }

    const pilotOwnerId = userId;
    const currentUserEmail = user?.email;

    // Verify the schedule exists and belongs to the instructor
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      select: {
        ownerId: true,
        status: true,
        pilot: { select: { title: true } },
        user: { select: { email: true, name: true } },
      },
    });

    if (!schedule) {
      return {
        success: false,
        message: "Schedule not found",
        data: null,
      };
    }

    if (schedule.ownerId !== pilotOwnerId) {
      return {
        success: false,
        message: "Unauthorized: You are not the owner of this schedule",
        data: null,
      };
    }

    if (schedule.status !== "PENDING") {
      return {
        success: false,
        message: `Cannot accept schedule: Current status is ${schedule.status}`,
        data: null,
      };
    }

    const updatedSchedule = await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        status: "ACCEPTED",
        finalMessage: null,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        pilotId: true,
        userId: true,
        ownerId: true,
        scheduledDateTime: true,
        message: true,
        finalMessage: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    revalidatePath("/portal/schedules");

    let emailSent = true;
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY not configured");
        emailSent = false;
      } else if (schedule?.user?.email) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "AI-PRISM <schedule-confirmation@ai-prism.dev>",
          to: schedule.user.email,
          subject: `Schedule Accepted for ${schedule.pilot.title}`,
          react: ScheduleAcceptedEmail({
            userName: schedule.user.name || "User",
            pilotTitle: schedule.pilot.title,
            pilotOwnerEmail: currentUserEmail || "Unknown",
            scheduledDateTime: updatedSchedule.scheduledDateTime,
          }),
        });
      }
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
      emailSent = false;
    }

    return {
      success: true,
      message: emailSent
        ? "Schedule accepted successfully and notification sent"
        : "Schedule accepted successfully (notification failed)",
      data: updatedSchedule,
    };
  } catch (error) {
    console.error("Error accepting schedule:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to accept schedule",
      data: null,
    };
  }
}

/**
 * Finalizes a schedule request via email, setting status to FINALIZEDVIAEMAIL
 * - Only the instructor (ownerId) can finalize
 * - Sets finalMessage to "Will contact you later"
 *
 * @param scheduleId - The ID of the schedule to finalize
 * @returns Success status and updated schedule data
 */
export async function finalizeScheduleViaEmail(
  scheduleId: string,
  message: string,
) {
  try {
    // Check if prisma is defined
    if (!prisma) {
      throw new Error("Database connection error: Prisma client is undefined");
    }

    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pilotOwnerId = userId;
    const currentUserEmail = user?.email;

    // Verify the schedule exists and belongs to the instructor
    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      select: {
        ownerId: true,
        status: true,
        pilot: { select: { title: true } },
        user: { select: { email: true, name: true } },
      },
    });

    if (!schedule) {
      throw new Error("Schedule not found");
    }
    if (schedule.ownerId !== pilotOwnerId) {
      throw new Error("Unauthorized: You are not the owner of this schedule");
    }
    if (schedule.status !== "PENDING") {
      throw new Error(
        `Cannot finalize schedule: Current status is ${schedule.status}`,
      );
    }

    // Update the schedule to FINALIZEDVIAEMAIL
    const updatedSchedule = await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        status: "FINALIZEDVIAEMAIL",
        finalMessage: "Will contact you later",
        updatedAt: new Date(),
      },
      select: {
        id: true,
        pilotId: true,
        userId: true,
        ownerId: true,
        scheduledDateTime: true,
        message: true,
        finalMessage: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log("Updated schedule in finalized:", updatedSchedule);

    revalidatePath("/portal/schedules");

    // Email notification to pilot user
    let emailSent = true;
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "AI-PRISM <schedule-confirmation@ai-prism.dev>",
        to: schedule?.user?.email || "Unknown",
        subject: `New Schedule Request for ${schedule?.pilot.title}`,
        react: ScheduleLaterEmail({
          userName: user?.name || "Unknown",
          pilotTitle: schedule.pilot.title,
          pilotOwnerEmail: currentUserEmail || "Unknown",
          message: message || "",
          scheduledDateTime: updatedSchedule.scheduledDateTime.toLocaleString(),
        }),
      });
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
      emailSent = false;
    }

    return {
      success: true,
      message: "Schedule finalized successfully",
      data: updatedSchedule,
    };
  } catch (error) {
    console.error("Error finalizing schedule:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to finalize schedule",
      data: null,
    };
  }
}
