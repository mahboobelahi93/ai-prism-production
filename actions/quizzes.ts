"use server";

import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

import { getCurrentUserId } from "@/lib/auth-helpers";

const prisma = new PrismaClient();

async function createQuizInfo(data: {
  id: string | null;
  title: string;
  summary: string;
  setAsExam: boolean;
  pilotId: string;
}) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }
    const quizInfo = await prisma.quizInfo.create({
      data: {
        ...data,
      },
    });
    const pathToRevalidate = `/portal/pilots/edit/${data.pilotId}`;
    revalidatePath(pathToRevalidate);
    return {
      success: true,
      message: data.id
        ? "Quiz updated successfully"
        : "Quiz created successfully",
      data: quizInfo,
    };
  } catch (error) {
    console.error("Error creating quiz info:", error);
    return {
      success: false,
      message: "Error creating quiz info: " + error.message,
      data: null,
    };
  }
}

async function addQuiz(data: any) {
  const { title, summary, pilotId, setAsExam, settings, questions } = data;
  try {
    const result = await prisma.quizInfo.create({
      data: {
        title,
        summary,
        pilotId,
        setAsExam,
        settings: settings
          ? {
              create: {
                timeLimit: settings.timeLimit,
                hideQuizTime: settings.hideQuizTime,
                feedbackMode: settings.feedbackMode,
                autoStart: settings.autoStart,
                questionOrder: settings.questionOrder,
                hideQuestionNumber: settings.hideQuestionNumber,
                attemptsAllowed: settings.attemptsAllowed,
                passingGrade: settings.passingGrade,
              },
            }
          : undefined,
        questions: {
          create: questions.map((question: any) => ({
            question: question.question,
            type: question.type,
            points: question.points,
            description: question.description || null,
            answerRequired: question.answerRequired,
            randomize: question.randomize,
            explanation: question.explanation || null,
            options: {
              create: question.options.map((option: any) => ({
                text: option.text,
                isCorrect: option.isCorrect,
              })),
            },
          })),
        },
      },
    });
    const pathToRevalidate = `/portal/pilots/edit/${pilotId}`;
    revalidatePath(pathToRevalidate);
    return {
      success: true,
      message: "Quiz created successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error creating quiz:", error);
    return {
      success: false,
      message: "Error creating quiz: " + error.message,
      data: null,
    };
  }
}

async function updateQuiz(quizId: string, data: any) {
  const { title, summary, pilotId, settings, setAsExam } = data;
  try {
    const result = await prisma.quizInfo.update({
      where: { id: quizId },
      data: {
        title,
        summary,
        pilotId,
        setAsExam,
        settings: settings
          ? {
              upsert: {
                create: {
                  timeLimit: settings.timeLimit,
                  hideQuizTime: settings.hideQuizTime,
                  feedbackMode: settings.feedbackMode,
                  autoStart: settings.autoStart,
                  questionOrder: settings.questionOrder,
                  hideQuestionNumber: settings.hideQuestionNumber,
                  attemptsAllowed: settings.attemptsAllowed,
                  passingGrade: settings.passingGrade,
                },
                update: {
                  timeLimit: settings.timeLimit,
                  hideQuizTime: settings.hideQuizTime,
                  feedbackMode: settings.feedbackMode,
                  autoStart: settings.autoStart,
                  questionOrder: settings.questionOrder,
                  hideQuestionNumber: settings.hideQuestionNumber,
                  attemptsAllowed: settings.attemptsAllowed,
                  passingGrade: settings.passingGrade,
                },
              },
            }
          : undefined,
      },
    });
    const pathToRevalidate = `/portal/pilots/edit/${data.pilotId}`;
    revalidatePath(pathToRevalidate);
    return {
      success: true,
      message: "Quiz updated successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error updating quiz:", error);
    return {
      success: false,
      message: "Error updating quiz: " + error.message,
      data: null,
    };
  }
}

async function fetchQuizzesByPilotId(pilotId: string) {
  try {
    const quizzes = await prisma.quizInfo.findMany({
      where: { pilotId },
      include: {
        settings: true,
        questions: {
          include: {
            options: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // const formattedQuizzes = quizzes.map((quiz) => ({
    //   id: quiz.id,
    //   title: quiz.title,
    //   summary: quiz.summary,
    //   setAsExam: quiz.setAsExam || false, // Add default value if `isExam` is nullable
    //   questions: quiz.questions.map((question) => ({
    //     question: question.question,
    //     type: question.type,
    //     points: question.points,
    //     description: question.description || "",
    //     answerRequired: question.answerRequired,
    //     randomize: question.randomize,
    //     options: question.options.map((option) => ({
    //       text: option.text,
    //       isCorrect: option.isCorrect,
    //     })),
    //     explanation: question.explanation || "",
    //   })),
    //   settings: {
    //     timeLimit: quiz.settings?.timeLimit || 0,
    //     allowReview: quiz.settings?. || false, // Add default value if `allowReview` is nullable
    //   },
    // }));

    return {
      success: true,
      data: quizzes,
    };
  } catch (error) {
    console.error("Error fetching quiz details by pilotId:", error);
    return {
      success: false,
      message: "Error fetching quiz details: " + error.message,
      data: null,
    };
  }
}

async function deleteQuestion(questionId: string) {
  try {
    const result = await prisma.question.delete({
      where: { id: questionId },
    });
    revalidatePath("/portal/pilots/edit");
    return {
      success: true,
      message: "Question deleted successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error deleting question:", error);
    let message = "Error deleting question: " + error.message;
    if (error.code === "P2003") {
      // Prisma foreign key constraint error
      message =
        "Cannot delete this question because it is linked to user answers. Remove associated answers first.";
    }
    return {
      success: false,
      message: message,
      data: null,
    };
  }
}

async function deleteQuiz(quizId: string) {
  try {
    const result = await prisma.quizInfo.delete({
      where: { id: quizId },
    });
    revalidatePath("/portal/pilots/edit");
    return {
      success: true,
      message: "Quiz deleted successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error deleting quiz:", error);
    let message = "Error deleting quiz: " + error.message;
    if (error.code === "P2003") {
      // Prisma foreign key constraint error
      message =
        "Cannot delete this quiz because it is linked to quiz attempts. Remove associated attempts first.";
    }
    return {
      success: false,
      message: message,
      data: null,
    };
  }
}

async function updateQuestion(questionId: string, questionData: any) {
  try {
    const result = await prisma.question.update({
      where: { id: questionId },
      data: {
        question: questionData.question,
        type: questionData.type,
        points: questionData.points,
        description: questionData.description || null,
        answerRequired: questionData.answerRequired,
        randomize: questionData.randomize,
        explanation: questionData.explanation || null,
        options: {
          deleteMany: {}, // Clear existing options
          create: questionData.options.map((option: any) => ({
            text: option.text,
            isCorrect: option.isCorrect,
          })),
        },
      },
    });
    revalidatePath("/portal/pilots/edit");
    return {
      success: true,
      message: "Question updated successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error updating question:", error);
    return {
      success: false,
      message: "Error updating question: " + error.message,
      data: null,
    };
  }
}

async function addQuestionToQuiz(quizId: string, questionData: any) {
  try {
    const result = await prisma.question.create({
      data: {
        quizInfoId: quizId,
        question: questionData.question,
        type: questionData.type,
        points: questionData.points,
        description: questionData.description || null,
        answerRequired: questionData.answerRequired,
        randomize: questionData.randomize,
        explanation: questionData.explanation || null,
        options: {
          create: questionData.options.map((option: any) => ({
            text: option.text,
            isCorrect: option.isCorrect,
          })),
        },
      },
    });
    revalidatePath("/portal/pilots/edit");
    return {
      success: true,
      message: "Question added successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error adding question:", error);
    return {
      success: false,
      message: "Error adding question: " + error.message,
      data: null,
    };
  }
}

export {
  createQuizInfo,
  addQuiz,
  updateQuiz,
  fetchQuizzesByPilotId,
  addQuestionToQuiz,
  deleteQuestion,
  updateQuestion,
  deleteQuiz,
};
