"use server";

import { prisma } from "@/lib/db";

export async function getUserQuizData(userId: string) {
  const passedAttempt = await prisma.quizAttempt.findFirst({
    where: {
      userId: userId,
      result: {
        passed: true,
      },
    },
    include: {
      result: true,
    },
  });

  return {
    hasPassed: !!passedAttempt,
    score: passedAttempt?.result?.score ?? null,
  };
}
