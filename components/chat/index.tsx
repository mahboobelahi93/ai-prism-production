"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Attachment, Message } from "ai";
import { useChat } from "ai/react";
import { marked } from "marked";
import { toast } from "sonner";
import SunEditor, { buttonList } from "suneditor-react";

import { parseMarkdown } from "@/lib/parse-markdown";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Message as PreviewMessage } from "./message";
import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";

import "suneditor/dist/css/suneditor.min.css";

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [summarizationModel, setSummarizationModel] = useState<string>("groq");
  const {
    messages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    body: { id },
    initialMessages,
    onFinish: () => {
      window.history.replaceState({}, "", `/portal/chat/${id}`);
    },
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const [contents, setContents] = useState("");

  useEffect(() => {
    messages.forEach((message) => {
      if (
        message.content &&
        message.content.includes("<!--REPORT_START-->") &&
        message.content.includes("<!--REPORT_END-->")
      ) {
        const startIndex =
          message.content.indexOf("<!--REPORT_START-->") +
          "<!--REPORT_START-->".length;
        const endIndex = message.content.indexOf("<!--REPORT_END-->");

        if (startIndex < endIndex) {
          let reportContent = message.content
            .substring(startIndex, endIndex)
            .trim();

          if (reportContent.startsWith("**") && reportContent.endsWith("**")) {
            reportContent = reportContent.slice(2, -2).trim();
          }

          setContents(reportContent);
        }
      }
    });
  }, [messages]);

  const handleDelete = async () => {
    console.log(id);
    try {
      const response = await fetch(`/api/chat?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Chat deleted successfully");
        setContents("");
        setInput("");
        router.replace("/portal/chat");
        router.refresh();
      } else {
        const errorData = await response.json();
        toast.error(`Failed to delete chat: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("An error occurred while deleting the chat");
    }
  };

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <Select
          value={summarizationModel}
          onValueChange={(value: string) => setSummarizationModel(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="huggingface">Hugging Face</SelectItem>
            <SelectItem value="groq">Groq</SelectItem>
          </SelectContent>
        </Select>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="ml-2">
              Delete Chat
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                chat and remove all associated data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Yes, delete chat"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full rounded-lg border"
      >
        <ResizablePanel>
          <div className="flex h-[82vh] flex-row justify-center bg-background pb-4 md:pb-8">
            <div className="flex flex-col items-center justify-between gap-4">
              <div
                ref={messagesContainerRef}
                className="chat-container flex h-auto flex-col items-center gap-4 overflow-y-auto"
              >
                {messages.length === 0 && <Overview />}

                {messages.map((message, index) => (
                  <PreviewMessage
                    key={`${id}-${index}`}
                    role={message.role}
                    content={message.content}
                    attachments={message.experimental_attachments}
                    toolInvocations={message.toolInvocations}
                  />
                ))}
                <div
                  ref={messagesEndRef}
                  className="min-h-[24px] min-w-[24px] shrink-0"
                />
              </div>

              <form className="relative flex w-full max-w-[calc(100dvw-32px)] flex-row items-end gap-2 px-4 md:max-w-[500px] md:px-0">
                <MultimodalInput
                  input={input}
                  setInput={setInput}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                  stop={stop}
                  attachments={attachments}
                  setAttachments={setAttachments}
                  messages={messages}
                  append={append}
                  summarizationModel={summarizationModel}
                />
              </form>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />

        {contents && (
          <ResizablePanel>
            <div className="p-4">
              <SunEditor
                setAllPlugins={true}
                setOptions={{
                  buttonList: [
                    ["undo", "redo"],
                    ...buttonList.basic,
                    ["formatBlock", "hiliteColor", "codeView"],
                    [
                      "bold",
                      "underline",
                      "italic",
                      "strike",
                      "subscript",
                      "superscript",
                      "removeFormat",
                    ],
                    ["fullScreen", "preview", "print"],
                  ],
                  font: [
                    "Arial",
                    "Comic Sans MS",
                    "Courier New",
                    "Impact",
                    "Georgia",
                    "Tahoma",
                    "Trebuchet MS",
                    "Verdana",
                    "Logical",
                    "Salesforce Sans",
                    "Garamond",
                    "Sans-Serif",
                    "Serif",
                    "Times New Roman",
                    "Helvetica",
                  ],
                }}
                setContents={marked(contents)}
                height="600px"
              />
            </div>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </>
  );
}
