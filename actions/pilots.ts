"use server";

import { revalidatePath } from "next/cache";
import { deleteFile, deleteNote } from "@/actions/file";
import { auth } from "@clerk/nextjs/server";
import { Pilot } from "@prisma/client";

import { getCurrentUserId } from "@/lib/auth-helpers";
import { getPresignedURL } from "@/lib/aws.utils";
import { CONSTANTS } from "@/lib/constants";
import { prisma } from "@/lib/db";

import { createOrUpdateFile } from "./file";

export async function createOrUpdatePilot(
  formData,
  pilotId,
  thumbnailFormData,
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }
    formData = JSON.parse(formData);
    const thumbnail = thumbnailFormData.get("thumbnail");
    const thumbnailFileId = formData.thumbnailFileId ?? null;

    // Handle thumbnail file upload if it exists
    let uploadedImageResponse: {
      success: boolean;
      data:
        | {
            fileId: string;
          }
        | undefined;
      message: string;
    } | null = null;
    if (thumbnail !== "undefined") {
      uploadedImageResponse = await createOrUpdateFile(
        JSON.parse(thumbnail),
        CONSTANTS.FILE_CLASS_TYPE.PILOT_THUMBNAIL,
        thumbnailFileId,
      );
    }

    // Prepare the pilot details for insertion or update
    const pilotDetails: Omit<Pilot, "id" | "createdAt"> = {
      ownerId: userId ?? "",
      category: formData?.category,
      title: formData?.title,
      description: formData?.description,
      isPublished: formData?.isPublished ?? false,
      thumbnailFileId: uploadedImageResponse?.data?.fileId ?? thumbnailFileId,
      updatedAt: new Date(),
    };

    // If pilotId is provided, update the existing pilot
    if (pilotId) {
      const result = await prisma.pilot.update({
        where: { id: pilotId },
        data: { ...pilotDetails },
      });
      const pathToRevalidate = `/portal/pilots/edit/${pilotId}`;
      revalidatePath(pathToRevalidate);
      return {
        success: true,
        message: "Pilot updated successfully",
        data: result,
      };
    } else {
      // If no pilotId, create a new pilot
      const result = await prisma.pilot.create({
        data: { ...pilotDetails, createdAt: new Date() },
      });

      return {
        success: true,
        message: "Pilot created successfully",
        data: result,
      };
    }
  } catch (error) {
    console.error(error);
    return { error: "Failed to create or update pilot", data: null };
  }
}

export async function getPilotDetailsById(id: string) {
  try {
    const response = await prisma.pilot.findFirst({
      where: {
        id: id,
      },
      include: {
        thumbnailFile: true,
        lessons: true,
      },
    });

    if (response) {
      const ownerDetails = await prisma.user.findUnique({
        where: {
          id: response.ownerId, // Use the ownerId from response
        },
        select: {
          email: true,
        },
      });
      // Add the total duration calculation
      let totalDuration = 0;

      if (response.thumbnailFile?.key) {
        response.thumbnailFile = {
          ...response.thumbnailFile,
          preview: await getPresignedURL(response.thumbnailFile?.key),
        };
      }

      // Generate preview URLs for lessons' tutorial videos
      if (response.lessons?.length > 0) {
        for (const lesson of response.lessons) {
          // Add lesson duration to totalDuration
          totalDuration += lesson.duration || 0;

          if (lesson.tutorialVideoID) {
            // Fetch tutorial video details from the database (if not already included in the lesson)
            const tutorialVideoFile = await prisma.file.findFirst({
              where: { id: lesson.tutorialVideoID },
            });

            if (tutorialVideoFile?.key) {
              // Add the preview URL to the lesson object
              lesson.tutorialVideo = [
                {
                  ...tutorialVideoFile,
                  preview: await getPresignedURL(tutorialVideoFile.key),
                },
              ];
            }
          }

          const notes = await prisma.note.findMany({
            where: {
              lessonId: lesson.id,
            },
          });
          lesson["notes"] = [];
          for (const note of notes) {
            if (note?.key) {
              const noteFile = await getPresignedURL(note.key);
              lesson.notes.push({
                ...note,
                preview: noteFile,
              });
            }
          }
        }
      }

      // Attach totalDuration to the response
      return {
        success: true,
        data: {
          ...response,
          totalDuration, // Include the total duration in the response
          ownerEmail: ownerDetails?.email,
        },
      };
    }

    return {
      success: false,
      message: "No data found!!!",
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: error,
      data: null,
    };
  }
}

export const fetchPilots = async () => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    const response = await prisma.pilot.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        thumbnailFile: true,
      },
    });

    if (response.length > 0) {
      // Add presigned URL preview to each pilot's thumbnailFile if it has a key
      const pilotsWithPreview = await Promise.all(
        response.map(async (pilot) => {
          if (pilot.thumbnailFile?.key) {
            const previewUrl = await getPresignedURL(pilot.thumbnailFile.key);
            return {
              ...pilot,
              thumbnailFile: {
                ...pilot.thumbnailFile,
                preview: previewUrl,
              },
            };
          }
          return pilot;
        }),
      );

      return {
        success: true,
        data: pilotsWithPreview,
      };
    }

    return {
      success: false,
      message: "No data found!!!",
      data: [],
    };
  } catch (error) {
    console.error("Error fetching pilot details:", error);
    throw new Error("Something went wrong while fetching pilots.");
  }
};

export const getAllPilots = async () => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    // Get all published pilots
    const pilots = await prisma.pilot.findMany({
      where: {
        isPublished: true,
      },
      include: {
        thumbnailFile: true,
        lessons: {
          select: {
            id: true,
            title: true,
            duration: true,
            progress: {
              where: {
                userId: userId,
              },
            },
          },
        },
        enrollments: {
          where: {
            userId: userId,
          },
          select: {
            enrollStatus: true,
            updatedAt: true,
          },
        },
      },
    });

    if (pilots.length > 0) {
      // Add presigned URL preview and owner info to each pilot
      const processedPilots = await Promise.all(
        pilots.map(async (pilot) => {
          // Get owner info
          const owner = await prisma.user.findUnique({
            where: { id: pilot.ownerId },
            select: { email: true, name: true },
          });

          let thumbnailPreview = null;
          if (pilot.thumbnailFile?.key) {
            thumbnailPreview = await getPresignedURL(pilot.thumbnailFile.key);
          }

          const enrollment = pilot.enrollments[0];

          // Calculate progress
          const completedLessons = pilot.lessons.filter((lesson) =>
            lesson.progress.some((p) => p.isCompleted),
          ).length;
          const progress =
            pilot.lessons.length > 0
              ? (completedLessons / pilot.lessons.length) * 100
              : 0;

          return {
            id: pilot.id,
            title: pilot.title,
            description: pilot.description,
            category: pilot.category,
            ownerEmail: owner?.email,
            name: owner?.name
              ? owner.name
              : owner?.email?.split("@")[0] || "Unknown User",
            thumbnailFile: pilot.thumbnailFile
              ? {
                  ...pilot.thumbnailFile,
                  preview: thumbnailPreview,
                }
              : null,
            isEnrolled: !!enrollment,
            enrollment: enrollment
              ? {
                  status: enrollment.enrollStatus,
                  progress: Math.round(progress),
                  lastAccessed: enrollment.updatedAt,
                }
              : null,
            metrics: {
              totalLessons: pilot.lessons.length,
              totalDuration: pilot.lessons.reduce(
                (sum, lesson) => sum + (lesson.duration || 0),
                0,
              ),
            },
            createdAt: pilot.createdAt,
            updatedAt: pilot.updatedAt,
          };
        }),
      );

      const stats = {
        totalPilots: processedPilots.length,
        enrolledPilots: processedPilots.filter((p) => p.isEnrolled).length,
        inProgressPilots: processedPilots.filter(
          (p) =>
            p.enrollment?.status === "APPROVED" &&
            p.enrollment.progress > 0 &&
            p.enrollment.progress < 100,
        ).length,
        pendingPilots: processedPilots.filter(
          (p) => p.enrollment?.status === "PENDING",
        ).length,
      };

      return {
        success: true,
        data: {
          pilots: processedPilots,
          stats,
        },
      };
    }

    return {
      success: false,
      message: "No pilots found",
      data: {
        pilots: [],
        stats: {
          totalPilots: 0,
          enrolledPilots: 0,
          inProgressPilots: 0,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching pilots:", error);
    return {
      success: false,
      error: "Failed to fetch pilots",
      data: null,
    };
  }
};

export async function deletePilot(pilotId: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    return await prisma.$transaction(
      async (tx) => {
        const pilot = await tx.pilot.findUnique({
          where: { id: pilotId },
          include: {
            lessons: {
              include: {
                tutorialVideo: true,
                Note: true,
                progress: true,
              },
            },
            thumbnailFile: true,
            QuizInfo: {
              include: {
                questions: {
                  include: {
                    options: true,
                    answers: true,
                  },
                },
                attempts: {
                  include: {
                    answers: true,
                    result: true,
                  },
                },
                settings: true,
              },
            },
            enrollments: true,
          },
        });

        if (!pilot) throw new Error("Pilot not found");

        // Delete quiz-related records in the correct order
        for (const quizInfo of pilot.QuizInfo) {
          // 1. Delete UserAnswers for each QuizAttempt
          for (const attempt of quizInfo.attempts) {
            await tx.userAnswer.deleteMany({
              where: { attemptId: attempt.id },
            });

            // 2. Delete QuizResults for each QuizAttempt
            if (attempt.result) {
              await tx.quizResult.delete({
                where: { attemptId: attempt.id },
              });
            }
          }

          // 3. Delete all QuizAttempts for this QuizInfo
          await tx.quizAttempt.deleteMany({
            where: { quizInfoId: quizInfo.id },
          });

          // 4. Delete all Options for each Question
          for (const question of quizInfo.questions) {
            await tx.option.deleteMany({
              where: { questionId: question.id },
            });
          }

          // 5. Delete all Questions
          await tx.question.deleteMany({
            where: { quizInfoId: quizInfo.id },
          });

          // 6. Delete QuizSettings if it exists
          if (quizInfo.settings) {
            await tx.quizSettings.delete({
              where: { quizInfoId: quizInfo.id },
            });
          }
        }

        // 7. Now it's safe to delete all QuizInfo records
        await tx.quizInfo.deleteMany({
          where: { pilotId },
        });

        // 8. Delete all EnrollActivities
        await tx.enrollActivity.deleteMany({
          where: { pilotId },
        });

        // 9. Delete lessons and associated data
        for (const lesson of pilot.lessons) {
          // Delete lesson progress
          await tx.lessonProgress.deleteMany({
            where: { lessonId: lesson.id },
          });

          // Delete tutorial video if exists
          if (lesson.tutorialVideo?.key) {
            await deleteFile(lesson.tutorialVideo.key);
          }

          // Delete notes if any
          if (lesson.Note?.length) {
            for (const note of lesson.Note) {
              if (note.key) await deleteNote(note.key);
            }
          }

          // Delete the lesson
          await tx.lesson.delete({
            where: { id: lesson.id },
          });
        }

        // 10. Delete thumbnail if exists
        if (pilot.thumbnailFile?.key) {
          await deleteFile(pilot.thumbnailFile.key);
        }

        // 11. Finally delete the pilot
        await tx.pilot.delete({
          where: { id: pilotId },
        });

        revalidatePath("/portal/pilots");
        return { success: true, message: "Pilot deleted successfully" };
      },
      {
        // Increase transaction timeout to 30 seconds
        timeout: 30000,
      },
    );
  } catch (error) {
    console.error("Error deleting pilot:", error);
    return {
      success: false,
      message: "Failed to delete pilot",
      error: error.message,
    };
  }
}
