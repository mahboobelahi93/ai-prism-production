import { File as FileSchema, Note as NoteSchema } from "@prisma/client";

import { deleteS3Object, getPresignedURL } from "@/lib/aws.utils";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function getFileS3Url(id: string) {
  try {
    const file = await prisma.file.findUnique({
      where: { id },
    });
    if (file && file.key) {
      return getPresignedURL(file.key);
    }
    return null;
  } catch (error) {
    console.error("Error fetching file data from database:", error);
    throw error;
  }
}

// helpers/storage.ts
async function updateUserStorageUsage(sizeChange: number) {
  const currentUser = await getCurrentUser();
  await prisma.user.update({
    where: { id: currentUser?.id },
    data: {
      storageUsed: {
        increment: sizeChange,
      },
    },
  });
}

export async function createOrUpdateFile(
  file: File,
  file_class_type: {
    container: string;
    label: string;
  },
  prevFileId?: string | null,
) {
  console.log({ file, file_class_type, prevFileId });

  if (!file) {
    return {
      success: false,
      message: "No file found! Nothing to update or create",
      data: undefined,
    };
  }

  try {
    let resultData: { fileId: string } | undefined = undefined;

    if (!prevFileId) {
      const fileDetails = {
        file_class_type: file_class_type.label,
        name: file.name,
        size: file.size,
        type: file.type,
        key: file.key,
        updated_at: new Date(),
      } as Omit<FileSchema, "id">;

      const result = await prisma.file.create({
        data: {
          ...fileDetails,
          created_at: new Date(),
        },
      });

      await updateUserStorageUsage(file.size);

      resultData = { fileId: result.id };
      return {
        success: true,
        data: resultData,
        message: "File created successfully",
      };
    } else {
      const prvsFile = await prisma.file.findUnique({
        where: { id: prevFileId },
      });

      if (!prvsFile) {
        return {
          success: false,
          message: "File not found",
          data: undefined,
        };
      }

      if (prvsFile.key) {
        const deleteFromS3Res = await deleteS3Object(prvsFile.key);

        if (deleteFromS3Res && !deleteFromS3Res.success) {
          return {
            success: false,
            data: undefined,
            message: "Error deleting file from S3 bucket.",
          };
        }
      }

      const fileDetails = {
        name: file.name,
        size: file.size,
        type: file.type,
        key: file.key,
        updated_at: new Date(),
      } as Omit<FileSchema, "id">;

      await prisma.file.update({
        where: { id: prevFileId },
        data: fileDetails,
      });

      await updateUserStorageUsage(file.size - prvsFile.size);

      resultData = { fileId: prevFileId };
      return {
        success: true,
        data: resultData,
        message: `File with id ${prevFileId} updated successfully`,
      };
    }
  } catch (error) {
    console.error("Error upserting file:", error);
    return {
      success: false,
      message: "Error upserting file: " + error,
      data: undefined,
    };
  }
}

export async function deleteFile(id: string) {
  try {
    const currFile = await prisma.file.findUnique({
      where: { id },
    });
    if (!currFile) {
      return { success: false, message: "File not found" };
    }

    const deleteFromS3Res = currFile.key
      ? await deleteS3Object(currFile.key)
      : { success: false };
    if (deleteFromS3Res && !deleteFromS3Res.success) {
      return {
        success: false,
        message: "Error deleting file from S3 bucket.",
      };
    }

    await prisma.file.delete({ where: { id } });

    await updateUserStorageUsage(-currFile.size);

    return { success: true, message: `File with id ${id} deleted` };
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

export async function createOrUpdateNote(
  file: File,
  file_class_type: {
    container: string;
    label: string;
  },
  lessonId: string,
  prevNoteId?: string | null,
) {
  console.log({ file, file_class_type, prevNoteId, lessonId });

  try {
    let resultData: { fileId: string } | undefined = undefined;

    if (!prevNoteId) {
      const fileDetails = {
        file_class_type: file_class_type.label,
        name: file.name,
        size: file.size,
        type: file.type,
        key: file.key,
        updatedAt: new Date(),
      } as Omit<NoteSchema, "id">;

      const result = await prisma.note.create({
        data: {
          ...fileDetails,
          createdAt: new Date(),
          lessonId,
        },
      });

      await updateUserStorageUsage(file.size);

      resultData = { fileId: result.id };
      return {
        success: true,
        data: resultData,
        message: "File created successfully",
      };
    } else {
      const prvsNote = await prisma.note.findUnique({
        where: { id: prevNoteId },
      });

      if (!prvsNote) {
        return {
          success: false,
          message: "File not found",
          data: undefined,
        };
      }

      if (prvsNote.key) {
        const deleteFromS3Res = await deleteS3Object(prvsNote.key);

        if (deleteFromS3Res && !deleteFromS3Res.success) {
          return {
            success: false,
            data: undefined,
            message: "Error deleting file from S3 bucket.",
          };
        }
      }

      const fileDetails = {
        name: file.name,
        size: file.size,
        type: file.type,
        updated_at: new Date(),
        key: file.key,
      } as Omit<FileSchema, "id">;
      await prisma.file.update({
        where: { id: prevNoteId },
        data: fileDetails,
      });

      await updateUserStorageUsage(file.size - prvsNote.size);

      resultData = { fileId: prevNoteId };
      return {
        success: true,
        data: resultData,
        message: `File with id ${prevNoteId} updated successfully`,
      };
    }
  } catch (error) {
    console.error("Error upserting file:", error);
    return {
      success: false,
      message: "Error upserting file: " + error,
      data: undefined,
    };
  }
}

export async function deleteNote(id: string) {
  try {
    const currFile = await prisma.note.findUnique({
      where: { id },
    });
    if (!currFile) {
      return { success: false, message: "File not found" };
    }

    const deleteFromS3Res = currFile.key
      ? await deleteS3Object(currFile.key)
      : { success: false };
    if (deleteFromS3Res && !deleteFromS3Res.success) {
      return {
        success: false,
        message: "Error deleting file from S3 bucket.",
      };
    }

    await prisma.note.delete({ where: { id } });

    await updateUserStorageUsage(-currFile.size);

    return { success: true, message: `File with id ${id} deleted` };
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}
