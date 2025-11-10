"use client";

import React, { useCallback, useRef, useState } from "react";
import { Attachment, ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Textarea } from "../ui/textarea";
import { useFileProcessing } from "./hooks/useFileProcessing";
import { useSuggestedActions } from "./hooks/useSuggestedActions";
import { ArrowUpIcon, PaperclipIcon, StopIcon } from "./icons";
import { PreviewAttachment } from "./preview-attachment";
import type { ProcessedFile, ProcessingStatus } from "./types";

function ProcessingStatus({ status }: { status: ProcessingStatus }) {
  if (!status.isProcessing || !status.currentFile) return null;

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <h3 className="mb-2 text-lg font-semibold">Processing Files</h3>
        <p className="mb-2 text-sm text-gray-500">
          {status.currentFile
            ? `Processing ${status.currentFile}`
            : "Preparing files..."}
        </p>
        {status.totalPages > 0 && (
          <p className="mb-2 text-sm text-gray-500">
            Page {status.currentPage} of {status.totalPages}
          </p>
        )}
        <Progress value={status.progress} className="w-full" />
      </CardContent>
    </Card>
  );
}

export function MultimodalInput({
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  append,
  handleSubmit,
  summarizationModel = "groq",
}: {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: React.Dispatch<React.SetStateAction<Array<Attachment>>>;
  messages: Array<Message>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: { preventDefault?: () => void },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  summarizationModel: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);

  const { processingStatus, setProcessingStatus, handleFileChange } =
    useFileProcessing({
      setProcessedFiles,
      setAttachments,
      summarizationModel,
    });

  const { suggestedActions } = useSuggestedActions();

  const submitForm = useCallback(async () => {
    const userMessage = input.trim();

    let messageContent = userMessage;

    if (processedFiles.length > 0) {
      const fileInfo = processedFiles
        .map(
          (file) => `
              File: ${file.name} (${file.type})
              Summary:
              ${file.summary}
              Keywords: ${file.keywords.join(", ")}
              ${file.type === "pdf" || file.type === "image" ? `Images: ${file.images?.length || 0}` : ""}
              `,
        )
        .join("\n\n");

      messageContent += `\n\n[PROCESSED_FILES]\n${fileInfo}\n[/PROCESSED_FILES]`;
    }

    const messageToSend = { role: "user", content: messageContent };

    await append(messageToSend);

    setInput("");
    setAttachments([]);
    setProcessedFiles([]);
    // Reset processing status after submitting the form
    setProcessingStatus({
      isProcessing: false,
      currentFile: "",
      currentPage: 0,
      totalPages: 0,
      progress: 0,
    });
  }, [
    input,
    processedFiles,
    append,
    setInput,
    setAttachments,
    setProcessingStatus,
  ]);

  return (
    <div className="relative flex w-full flex-col gap-4">
      <ProcessingStatus status={processingStatus} />
      {processedFiles.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {processedFiles.map((file) => (
            <div key={file.id} className="relative">
              <PreviewAttachment
                attachment={{
                  name: file.name,
                  contentType:
                    file.type === "pdf"
                      ? "application/pdf"
                      : file.type === "audio"
                        ? "audio/mpeg"
                        : file.type === "txt"
                          ? "text/plain"
                          : "image/jpeg",
                }}
              />
              <button
                onClick={() => {
                  setProcessedFiles((prev) =>
                    prev.filter((p) => p.id !== file.id),
                  );
                }}
                className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-gray-500 text-xs text-white hover:bg-gray-600"
                aria-label={`Remove ${file.name}`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {messages.length === 0 && processedFiles.length === 0 && (
        <div className="mx-auto grid w-full gap-2 sm:grid-cols-2 md:max-w-[500px] md:px-0">
          {suggestedActions.map((suggestion, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.05 * index }}
              key={index}
              className={index > 1 ? "hidden sm:block" : "block"}
            >
              <button
                onClick={async () => {
                  append({
                    role: "user",
                    content: suggestion.action,
                  });
                }}
                className="flex w-full flex-col rounded-lg border border-zinc-200 p-2 text-left text-sm text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <span className="font-medium">{suggestion.title}</span>
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <input
        type="file"
        className="pointer-events-none fixed -left-4 -top-4 size-0.5 opacity-0"
        ref={fileInputRef}
        onChange={handleFileChange}
        tabIndex={-1}
        accept=".pdf, .mp3, .wav, .ogg, .jpg, .jpeg, .png, .gif, .txt"
        multiple
      />

      <Textarea
        ref={textareaRef}
        placeholder="Send a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[24px] resize-none overflow-hidden rounded-lg bg-muted text-base"
        rows={3}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (isLoading || processingStatus.isProcessing) {
              toast.error("Please wait for the current operation to finish!");
            } else {
              submitForm();
            }
          }
        }}
      />

      {isLoading || processingStatus.isProcessing ? (
        <Button
          className="absolute bottom-2 right-2 m-0.5 h-fit rounded-full p-1.5"
          onClick={(event) => {
            event.preventDefault();
            stop();
          }}
        >
          <StopIcon size={14} />
        </Button>
      ) : (
        <Button
          className="absolute bottom-2 right-2 m-0.5 h-fit rounded-full p-1.5"
          onClick={(event) => {
            event.preventDefault();
            submitForm();
          }}
          disabled={input.length === 0 && processedFiles.length === 0}
        >
          <ArrowUpIcon size={14} />
        </Button>
      )}

      <Button
        className="absolute bottom-2 right-10 m-0.5 h-fit rounded-full p-1.5 dark:border-zinc-700"
        onClick={(event) => {
          event.preventDefault();
          fileInputRef.current?.click();
        }}
        variant="outline"
        disabled={isLoading || processingStatus.isProcessing}
      >
        <PaperclipIcon size={14} />
      </Button>
    </div>
  );
}
