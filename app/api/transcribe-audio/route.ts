import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const audioFile = formData.get("file") as File;

  if (!audioFile) {
    return NextResponse.json(
      { error: "No audio file provided" },
      { status: 400 },
    );
  }

  try {
    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    console.log("Transcription response:", response);

    // Return the transcription text
    return NextResponse.json({ transcription: response.text });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 },
    );
  }
}
