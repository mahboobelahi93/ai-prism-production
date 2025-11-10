"use server";

import { prisma } from "@/lib/db";

export async function getUserLessonProgress(userId: string, pilotId: string) {
  try {
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
      return {
        totalLessons: 0,
        completedLessons: 0,
        progress: 0,
      };
    }

    const totalLessons = pilot.lessons.length || 0;

    const completedLessons = pilot.lessons.filter(
      (lesson) =>
        lesson.progress.length > 0 &&
        lesson.progress.some((p) => p.isCompleted === true),
    ).length;

    const progressPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return {
      totalLessons,
      completedLessons,
      progress: progressPercentage,
    };
  } catch (error) {
    console.error("Error getting user progress:", error);
    return {
      totalLessons: 0,
      completedLessons: 0,
      progress: 0,
    };
  }
}
