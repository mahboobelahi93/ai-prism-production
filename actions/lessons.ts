"use server";

import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";

import { getCurrentUserId } from "@/lib/auth-helpers";
import { CONSTANTS } from "@/lib/constants";
import { prisma } from "@/lib/db";

import {
  createOrUpdateFile,
  createOrUpdateNote,
  deleteFile,
  deleteNote,
} from "./file";

export const handleLessonCreationOrUpdate = async (formData: any) => {
  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }
  const lessonId = formData.get("id");
  try {
    // Upload the tutorial video if provided
    const tutorialVideo = formData.get("tutorialVideo");
    const tutorialVideoId =
      formData.get("tutorialVideoID") === "null"
        ? null
        : formData.get("tutorialVideoID");

    let uploadedTutorialResponse: {
      success: boolean;
      data:
        | {
            fileId: string;
          }
        | undefined;
      message: string;
    } | null = null;

    if (tutorialVideo && tutorialVideo !== "undefined") {
      uploadedTutorialResponse = await createOrUpdateFile(
        JSON.parse(tutorialVideo),
        CONSTANTS.FILE_CLASS_TYPE.TUTORIAL_VIDEO,
        tutorialVideoId,
      );
    }

    const tutorialVideoFileId =
      uploadedTutorialResponse?.data?.fileId ?? tutorialVideoId;

    // Ensure the tutorialVideoFileId is valid if it's not null
    if (tutorialVideoFileId) {
      const fileExists = await prisma.file.findUnique({
        where: { id: tutorialVideoFileId },
      });
      if (!fileExists) {
        throw new Error("Invalid tutorial video ID: file does not exist");
      }
    }

    // Handle lesson creation or update
    let lesson;
    if (lessonId) {
      // Update existing lesson
      lesson = await prisma.lesson.update({
        where: { id: lessonId },
        data: {
          title: formData.get("title"),
          description: formData.get("description"),
          isPublished: formData.get("isPublished") === "true",
          pilotId: formData.get("pilotId"),
          tutorialVideoID: tutorialVideoFileId,
          duration: Number(formData.get("duration")),
        },
      });
    } else {
      // Create new lesson
      lesson = await prisma.lesson.create({
        data: {
          title: formData.get("title"),
          description: formData.get("description"),
          isPublished: formData.get("isPublished") === "true",
          pilotId: formData.get("pilotId"),
          orderNumber: 1,
          tutorialVideoID: tutorialVideoFileId,
          duration: Number(formData.get("duration")),
        },
      });
    }

    // Handle note uploads
    const noteFiles = formData.getAll("notes");
    console.log("noteFiles : ", noteFiles);
    if (noteFiles?.length > 0) {
      for (const noteFile of noteFiles) {
        await createOrUpdateNote(
          JSON.parse(noteFile),
          CONSTANTS.FILE_CLASS_TYPE.TUTORIAL_NOTE,
          lesson.id,
          noteFile.id,
        );
      }
    }

    // Fetch and return lesson details, including attachments and notes
    const noteDetails = await prisma.note.findMany({
      where: { lessonId: lesson.id },
    });

    const attachmentDetails =
      lesson.tutorialVideoID &&
      (await prisma.file.findFirst({
        where: { id: lesson.tutorialVideoID },
      }));
    const pathToRevalidate = `/portal/pilots/edit/${formData.get("pilotId")}`;
    revalidatePath(pathToRevalidate);
    return {
      success: true,
      message: lessonId
        ? "Lesson updated successfully"
        : "Lesson created successfully",
      data: {
        ...lesson,
        attachments: attachmentDetails,
        notes: noteDetails,
      },
    };
  } catch (error) {
    console.error("Error handling lesson creation or update:", error);
    return {
      success: false,
      message: "Lesson creation or update failed: " + error.message,
      data: null,
    };
  }
};

export async function deleteLesson(lessonId: string, pilotId: string) {
  try {
    // 1. Fetch the lesson and its associated files from the database
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        tutorialVideo: true,
        Note: true,
      },
    });

    if (!lesson) {
      throw new Error("Lesson not found.");
    }

    // Delete tutorial video
    if (lesson.tutorialVideo?.key) {
      await deleteFile(lesson.tutorialVideo.key);
    }

    // Delete notes
    if (lesson.Note?.length) {
      for (const note of lesson.Note) {
        if (note.key) {
          await deleteNote(note.key);
        }
      }
    }

    // 3. Delete lesson and related records from the database
    await prisma.lesson.delete({
      where: { id: lessonId },
    });
    const pathToRevalidate = `/portal/pilots/edit/${pilotId}`;
    revalidatePath(pathToRevalidate);
    return {
      success: true,
      message: "Lesson and associated files deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return {
      success: false,
      message: "Failed to delete lesson. Please try again.",
      error: error.message,
    };
  }
}
