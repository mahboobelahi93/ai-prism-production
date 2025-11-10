import { convertPDFtoImage } from "@/actions/chat";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import * as pdfjs from "pdfjs-dist";
import { TextItem } from "pdfjs-dist/types/src/display/api";
import { v4 as uuidv4 } from "uuid";

import { ProcessedFile, ProcessingStatus } from "../types";
import {
  analyzeImageWithLLaVA,
  extractKeywords,
  fileToBase64,
} from "./helpers";

const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export async function preprocessPDF(
  file: File,
  setProcessingStatus: React.Dispatch<React.SetStateAction<ProcessingStatus>>,
  summarizationModel: string,
): Promise<ProcessedFile> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  const images: string[] = [];
  const pageSummaries: string[] = [];
  setProcessingStatus((prev) => ({
    ...prev,
    currentFile: file.name,
    totalPages: pdf.numPages,
    currentPage: 0,
    progress: 0,
  }));

  for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
    setProcessingStatus((prev) => ({
      ...prev,
      currentPage: i,
      progress: (i / Math.min(pdf.numPages, 10)) * 100,
    }));
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .filter((item): item is TextItem => "str" in item)
      .map((item) => item.str)
      .join(" ");
    fullText += pageText + "\n\n";
  }

  const formData = new FormData();
  formData.append("pdfFiles", file);
  const result = await convertPDFtoImage(formData);
  console.log("result : ", result);

  if (result) {
    let idx = 0;
    for (const image of result?.images) {
      idx = idx + 1;
      const description = await analyzeImageWithLLaVA(image.imageData);
      console.log("Image description:", description);
      const pageSummary = await summarizeText(description, summarizationModel);
      pageSummaries.push(`Page ${idx}: ${pageSummary}`);
    }
  }
  const overallSummary = await summarizeText(
    pageSummaries.join("\n\n"),
    summarizationModel,
  );
  const keywords = extractKeywords(fullText);

  return {
    id: uuidv4(),
    name: file.name,
    type: "pdf",
    content: fullText,
    summary: `Overall summary: ${overallSummary}\n\nPage summaries:\n${pageSummaries.join("\n")}`,
    keywords,
    images,
  };
}

export async function processAudio(
  file: File,
  setProcessingStatus: React.Dispatch<React.SetStateAction<ProcessingStatus>>,
  summarizationModel: string,
): Promise<ProcessedFile> {
  setProcessingStatus((prev) => ({
    ...prev,
    currentFile: file.name,
    totalPages: 0,
    currentPage: 0,
    progress: 0,
  }));

  const formData = new FormData();
  formData.append("file", file);

  try {
    setProcessingStatus((prev) => ({ ...prev, progress: 33 }));
    const response = await fetch(
      "https://api-inference.huggingface.co/models/openai/whisper-tiny",
      {
        headers: {
          Authorization: "",
        },
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    setProcessingStatus((prev) => ({ ...prev, progress: 66 }));
    const transcriptionData = await response.json();
    const transcription = transcriptionData.text;
    const summary = await summarizeText(transcription, summarizationModel);
    const keywords = extractKeywords(transcription);

    setProcessingStatus((prev) => ({ ...prev, progress: 100 }));
    return {
      id: uuidv4(),
      name: file.name,
      type: "audio",
      content: transcription,
      summary,
      keywords,
    };
  } catch (error) {
    console.error("Error processing audio:", error);
    throw error;
  }
}

export async function processImage(
  file: File,
  setProcessingStatus: React.Dispatch<React.SetStateAction<ProcessingStatus>>,
): Promise<ProcessedFile> {
  setProcessingStatus((prev) => ({
    ...prev,
    currentFile: file.name,
    totalPages: 0,
    currentPage: 0,
    progress: 0,
  }));

  try {
    setProcessingStatus((prev) => ({ ...prev, progress: 50 }));
    const base64Image = await fileToBase64(file);
    console.log("Base64 image length:", base64Image.length);
    const description = await analyzeImageWithLLaVA(base64Image);

    setProcessingStatus((prev) => ({ ...prev, progress: 100 }));
    return {
      id: uuidv4(),
      name: file.name,
      type: "image",
      content: description,
      summary: `Image description: ${description}`,
      keywords: description.split(" "),
      images: [URL.createObjectURL(file)],
    };
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
}

async function summarizeText(
  text: string,
  summarizationModel: string,
): Promise<string> {
  if (summarizationModel === "huggingface") {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
        {
          headers: {
            Authorization: "",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: text }),
        },
      );
      const result = await response.json();
      return result[0].summary_text;
    } catch (error) {
      console.error("Error summarizing text with Hugging Face:", error);
      return "Error generating summary";
    }
  } else if (summarizationModel === "groq") {
    console.log("Summarizing text with Groq...");
    try {
      const { text: summary } = await generateText({
        model: groq("mixtral-8x7b-32768"),
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that summarizes text concisely.",
          },
          {
            role: "user",
            content: `Summarize the following text:\n\n${text}`,
          },
        ],
        maxTokens: 150,
        temperature: 0.5,
      });

      console.log("Groq summary:", summary);

      return summary || "Error generating summary";
    } catch (error) {
      console.error("Error summarizing text with Groq:", error);
      return "Error generating summary";
    }
  }
  return "Invalid summarization model selected";
}

export async function processTxtFiles(
  file: File,
  setProcessingStatus: React.Dispatch<React.SetStateAction<ProcessingStatus>>,
  summarizationModel: string,
): Promise<ProcessedFile> {
  setProcessingStatus((prev) => ({
    ...prev,
    currentFile: file.name,
    totalPages: 0,
    currentPage: 0,
    progress: 0,
  }));

  try {
    const text = await file.text();

    console.log("Text content:", text);
    setProcessingStatus((prev) => ({ ...prev, progress: 50 }));
    // Extract keywords
    const keywords = extractKeywords(text);

    setProcessingStatus((prev) => ({ ...prev, progress: 66 }));

    // Summarize the text
    const summary = await summarizeText(text, summarizationModel);

    setProcessingStatus((prev) => ({ ...prev, progress: 100 }));

    return {
      id: uuidv4(),
      name: file.name,
      type: "txt",
      content: text,
      summary,
      keywords,
    };
  } catch (error) {
    console.error("Error processing text file:", error);
    throw error;
  }
}
