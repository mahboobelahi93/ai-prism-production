"use server";

import { auth } from "@clerk/nextjs/server";

import { getCurrentUserId } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";

export async function markLessonAsComplete(lessonId: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    const completion = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        completedAt: new Date(),
        isCompleted: true,
      },
    });
    console.log("completeion", completion);
    return completion;
  } catch (error) {
    console.error("Error marking lesson as complete:", error);
    throw error;
  }
}

export async function getLessonCompletionStatus(lessonId: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }
    const completion = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });
    return completion?.isCompleted || false;
  } catch (error) {
    console.error("Error getting lesson completion status:", error);
    throw error;
  }
}

export async function getUserProgressForPilot(pilotId: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    const pilot = await prisma.pilot.findUnique({
      where: { id: pilotId },
      include: {
        lessons: {
          include: {
            progress: {
              where: { userId },
            },
          },
        },
      },
    });

    if (!pilot) {
      throw new Error("Pilot not found");
    }

    const totalLessons = pilot?.lessons?.length;

    const completedLessons = pilot.lessons.filter(
      (lesson) =>
        lesson.progress.length > 0 &&
        lesson.progress.some((p) => p.isCompleted === true),
    ).length;

    return {
      totalLessons,
      completedLessons,
      progress: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
    };
  } catch (error) {
    console.error("Error getting user progress for pilot:", error);
    throw error;
  }
}
