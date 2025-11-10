import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import { getCurrentUser, getCurrentUserId } from "@/lib/auth-helpers";
import { getPresignedURL, uploadFileToS3 } from "@/lib/aws.utils";
import { CONSTANTS } from "@/lib/constants";

const FileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size should be less than 5MB",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "application/pdf", "audio/mpeg"].includes(
          file.type,
        ),
      {
        message: "File type should be JPEG, PNG, or PDF",
      },
    ),
});

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (request.body === null) {
    return new Response("Request body is empty", { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(", ");

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const filename = file.name;

    try {
      const response = await uploadFileToS3(
        file,
        CONSTANTS.FILE_CLASS_TYPE.AI_CHAT_ATTACHMENTS.container,
        file.type,
      );
      const result = {
        url: response?.data?.Location,
        pathname: filename,
        contentType: file.type,
      };
      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
