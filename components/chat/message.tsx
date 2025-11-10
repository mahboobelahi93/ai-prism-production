"use client";

import { ReactNode } from "react";
import { Attachment, ToolInvocation } from "ai";
import { motion } from "framer-motion";
import SunEditor, { buttonList } from "suneditor-react";

import { Textarea } from "../ui/textarea";
import { BotIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";
import { PreviewAttachment } from "./preview-attachment";

import "suneditor/dist/css/suneditor.min.css";

export const Message = ({
  role,
  content,
  toolInvocations,
  attachments,
}: {
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
}) => {
  return (
    <motion.div
      className={`flex w-full flex-row gap-4 px-4 first-of-type:pt-20 md:w-[500px] md:px-0`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex size-[24px] shrink-0 flex-col items-center justify-center text-zinc-400">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex w-full flex-col gap-2">
        {content &&
        content.toString().includes("final report") &&
        content.toString().split("\n\n---\n\n").length > 1 ? null : ( // /> //   setContents={content.toString().split("\n\n---\n\n")?.[1] as string} // <SunEditor // /> //   value={content.toString().split("\n\n---\n\n")?.[1] as string} // <Textarea
          <div className="flex flex-col gap-4 text-zinc-800 dark:text-zinc-300">
            <Markdown>
              {
                content
                  ?.toString()
                  ?.replace(/\[KEYWORDS\][\s\S]*?\[KEYWORDS\]/g, "")
                  .replace(
                    /\[PROCESSED_FILES\][\s\S]*?\[\/PROCESSED_FILES\]/g,
                    "",
                  ) as string
              }
            </Markdown>
          </div>
        )}

        {attachments && (
          <div className="flex flex-col gap-2">
            {attachments.map((attachment) => (
              <PreviewAttachment key={attachment.url} attachment={attachment} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
