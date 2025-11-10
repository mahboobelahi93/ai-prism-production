"use server";

import path from "path";

import { prisma } from "@/lib/db";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: any;
  userId: string;
}) {
  try {
    // Check if the chat exists
    const existingChat = await prisma.chat.findUnique({
      where: { id },
    });

    if (existingChat) {
      // If chat exists, update it
      return await prisma.chat.update({
        where: { id },
        data: {
          messages,
        },
      });
    }

    // Otherwise, create a new chat entry
    return await prisma.chat.create({
      data: {
        id,
        createdAt: new Date(),
        messages,
        userId,
      },
    });
  } catch (error) {
    console.error("Failed to save chat in database", error);
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    return await prisma.chat.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to delete chat by id from database", error);
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await prisma.chat.findMany({
      where: { userId: id },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to get chats by user from database", error);
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    return await prisma.chat.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to get chat by id from database", error);
    throw error;
  }
}

export async function convertPDFtoImage(formData: FormData) {
  // const pdf2img = await import("pdf-img-convert");
  // const pdfFiles: Blob[] = [];
  // const convertedImages: { name: string; imageData: string | Uint8Array }[] =
  //   [];
  // // Loop over the FormData content
  // for (const [key, value] of Array.from(formData.entries())) {
  //   if (value instanceof Blob) {
  //     if (key === "pdfFiles") {
  //       pdfFiles.push(value);
  //     }
  //   }
  // }
  // // Check for file uploads
  // if (pdfFiles.length === 0) {
  //   return {
  //     success: false,
  //     message: "No files uploaded",
  //   };
  // }
  // console.log("pdfFiles : ", pdfFiles);
  // // Convert PDF files to images
  // for (const file of pdfFiles) {
  //   const pdfBuffer = Buffer.from(await file.arrayBuffer());
  //   const imagePages = await pdf2img.convert(pdfBuffer, { base64: true });
  //   for (let i = 0; i < imagePages.length; i++) {
  //     const imageData = imagePages[i];
  //     const base64Data = imageData.replace(/^data:image\/\w+;base64,/, ""); // Remove Base64 header
  //     const imageBuffer = Buffer.from(base64Data, "base64");
  //     const fileName = `${path.basename(file.name, path.extname(file.name))}_page_${i + 1}.png`;
  //     convertedImages.push({
  //       name: fileName,
  //       imageData: imageData,
  //     });
  //   }
  // }
  // return {
  //   success: true,
  //   message: "Files uploaded and converted successfully",
  //   images: convertedImages,
  // };
}
