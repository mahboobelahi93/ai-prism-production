"use server";

// Adjust based on your Prisma client path
import { z } from "zod";

import { getCurrentUser, getCurrentUserId } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";

// Define validation schema for the input
const createQuizAttemptSchema = z.object({
  quizInfoId: z.string(),
  userId: z.string(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedOptionIds: z.array(z.string()),
    }),
  ),
});

// Server action for creating a quiz attempt
export async function createQuizAttempt(input: unknown) {
  const data = createQuizAttemptSchema.parse(input);
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error("Unauthorized: User not found");
  }

  // Start a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create a new quiz attempt
    const attempt = await tx.quizAttempt.create({
      data: {
        quizInfoId: data.quizInfoId,
        userId: userId,
      },
    });

    // Store user answers
    const userAnswers = data.answers.map((answer) => ({
      questionId: answer.questionId,
      selectedOptionIds: answer.selectedOptionIds,
      attemptId: attempt.id,
    }));
    await tx.userAnswer.createMany({ data: userAnswers });

    // Fetch quiz questions and correct answers
    const questions = await tx.question.findMany({
      where: { quizInfoId: data.quizInfoId },
      include: { options: true }, // Include options for correct answer comparison
    });

    // Calculate the total score
    let totalScore = 0;
    let achievedScore = 0;

    questions.forEach((question) => {
      totalScore += question.points; // Add question points to total score

      // Find the user's answer for this question
      const userAnswer = userAnswers.find(
        (ua) => ua.questionId === question.id,
      );

      if (userAnswer) {
        // Get the IDs of the correct options for this question
        const correctOptionIds = question.options
          .filter((option) => option.isCorrect) // Assuming `isCorrect` exists in the `Option` model
          .map((option) => option.id);

        // Check if the user's selected options match the correct options
        const isCorrect =
          JSON.stringify(userAnswer.selectedOptionIds.sort()) ===
          JSON.stringify(correctOptionIds.sort());

        if (isCorrect) {
          achievedScore += question.points; // Add question points to the achieved score
        }
      }
    });

    // Determine if the user passed (adjust passing grade as needed)
    const passingGrade = 0.5;
    const passed = achievedScore / totalScore >= passingGrade;

    // Create quiz result
    const result = await tx.quizResult.create({
      data: {
        attemptId: attempt.id,
        score: achievedScore,
        passed,
        feedback: passed
          ? "Congratulations, you passed!"
          : "Keep trying, you'll get it next time!",
      },
    });

    return {
      attempt,
      result,
    };
  });

  return result;
}

const checkQuizAttemptSchema = z.object({
  userId: z.string(),
  quizInfoId: z.string(),
});

export async function checkQuizAttempt(input: unknown) {
  console.log("input : ", input.quizInfoId);
  if (!input?.quizInfoId) {
    return {
      attempted: false,
      totalAttempts: 0,
      message: "You have not attempted this quiz yet.",
    };
  }
  // Validate input
  const data = checkQuizAttemptSchema.parse(input);

  // Query to check the most recent attempt and its result
  const latestAttempt = await prisma.quizAttempt.findFirst({
    where: {
      userId: data.userId,
      quizInfoId: data.quizInfoId,
    },
    include: {
      result: true, // Include the result for pass status and score
    },
    orderBy: {
      createdAt: "desc", // Sort by latest attempt
    },
  });

  // Query to get the total number of attempts for the user and quiz
  const totalAttempts = await prisma.quizAttempt.count({
    where: {
      userId: data.userId,
      quizInfoId: data.quizInfoId,
    },
  });

  // If no attempts exist, return a message indicating no attempt
  if (!latestAttempt) {
    return {
      attempted: false,
      totalAttempts: 0,
      message: "You have not attempted this quiz yet.",
    };
  }

  // If attempts exist, return the pass status, score, and total attempts
  return {
    attempted: true,
    totalAttempts,
    passed: latestAttempt.result?.passed ?? false,
    score: latestAttempt.result?.score ?? 0,
    lastAttemptedAt: latestAttempt.createdAt,
  };
}
