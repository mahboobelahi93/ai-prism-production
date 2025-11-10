import { useCallback, useState } from "react";
import { Attachment } from "ai";
import { toast } from "sonner";

import { ProcessedFile, ProcessingStatus } from "../types";
import {
  preprocessPDF,
  processAudio,
  processImage,
  processTxtFiles,
} from "../utils/fileProcessing";

export function useFileProcessing({
  setProcessedFiles,
  setAttachments,
  summarizationModel,
}: {
  setProcessedFiles: React.Dispatch<React.SetStateAction<ProcessedFile[]>>;
  setAttachments: React.Dispatch<React.SetStateAction<Array<Attachment>>>;
  summarizationModel: string;
}) {
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    currentFile: "",
    currentPage: 0,
    totalPages: 0,
    progress: 0,
  });

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      if (files.length === 0) {
        return; // Exit early if no files are selected
      }

      setProcessingStatus({
        isProcessing: true,
        currentFile: "",
        currentPage: 0,
        totalPages: 0,
        progress: 0,
      });
      try {
        const newProcessedFiles = await Promise.all(
          files.map(async (file) => {
            if (file.type === "application/pdf") {
              return await preprocessPDF(
                file,
                setProcessingStatus,
                summarizationModel,
              );
            } else if (file.type.startsWith("audio/")) {
              return await processAudio(
                file,
                setProcessingStatus,
                summarizationModel,
              );
            } else if (
              file.type === "text/plain" ||
              file.name.endsWith(".txt")
            ) {
              return await processTxtFiles(
                file,
                setProcessingStatus,
                summarizationModel,
              );
            } else if (file.type.startsWith("image/")) {
              return await processImage(file, setProcessingStatus);
            }
            throw new Error(`Unsupported file type: ${file.type}`);
          }),
        );

        setProcessedFiles((prevFiles) => [...prevFiles, ...newProcessedFiles]);
        toast.success(`${files.length} file(s) processed successfully.`);
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error("Error processing files. Please try again.");
      } finally {
        setProcessingStatus({
          isProcessing: false,
          currentFile: "",
          currentPage: 0,
          totalPages: 0,
          progress: 0,
        });

        if (event.target) {
          event.target.value = "";
        }
      }

      setAttachments([]);
    },
    [setProcessedFiles, setAttachments, summarizationModel],
  );

  return { processingStatus, setProcessingStatus, handleFileChange };
}
