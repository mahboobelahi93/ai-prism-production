import { createGroq } from "@ai-sdk/groq";

import { useLlamaVision } from "../visionModel";

const { callLlamaVision } = useLlamaVision(
  process.env.NEXT_PUBLIC_GROQ_API_KEY || "",
);

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const base64String = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          "",
        ),
      );
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}

export async function analyzeImageWithLLaVA(
  base64Image: string,
): Promise<string> {
  try {
    console.log("Analyzing image with LlamaVision...");
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;
    const description = await callLlamaVision(
      "What's in this image?",
      imageUrl,
    );
    console.log("LlamaVision response:", description);
    return description;
  } catch (error) {
    console.error("Error analyzing image with LlamaVision:", error);
    return "Error analyzing image";
  }
}

export function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const wordFrequency: { [key: string]: number } = {};
  words.forEach((word) => {
    if (word.length > 3) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });
  return Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word]) => word);
}
