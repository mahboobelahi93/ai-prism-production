import { notFound } from "next/navigation";
import { getChatById } from "@/actions/chat";
import { TChat } from "@/types";
import { auth, currentUser } from "@clerk/nextjs/server";
import { CoreMessage, CoreToolMessage, Message, ToolInvocation } from "ai";

import { getCurrentUser, getCurrentUserId } from "@/lib/auth-helpers";
import { generateUUID } from "@/lib/utils";
import { Chat as PreviewChat } from "@/components/chat";

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Array<Message>;
}): Array<Message> {
  return messages.map((message) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map((toolInvocation) => {
          const toolResult = toolMessage.content.find(
            (tool) => tool.toolCallId === toolInvocation.toolCallId,
          );

          if (toolResult) {
            return {
              ...toolInvocation,
              state: "result",
              result: toolResult.result,
            };
          }

          return toolInvocation;
        }),
      };
    }

    return message;
  });
}

function convertToUIMessages(messages: Array<CoreMessage>): Array<Message> {
  return messages.reduce((chatMessages: Array<Message>, message) => {
    if (message.role === "tool") {
      return addToolMessageToChat({
        toolMessage: message as CoreToolMessage,
        messages: chatMessages,
      });
    }

    let textContent = "";
    let toolInvocations: Array<ToolInvocation> = [];

    if (typeof message.content === "string") {
      textContent = message.content;
    } else if (Array.isArray(message.content)) {
      for (const content of message.content) {
        if (content.type === "text") {
          textContent += content.text;
        } else if (content.type === "tool-call") {
          toolInvocations.push({
            state: "call",
            toolCallId: content.toolCallId,
            toolName: content.toolName,
            args: content.args,
          });
        }
      }
    }

    if (message.role === "user") {
      const keywordDelimiter = "[KEYWORDS_START]";
      const delimiterIndex = textContent.indexOf(keywordDelimiter);
      if (delimiterIndex !== -1) {
        textContent = textContent.substring(0, delimiterIndex).trim();
      }
    }

    console.log("textContent : ", textContent);

    chatMessages.push({
      id: generateUUID(),
      role: message.role,
      content: textContent,
      toolInvocations,
    });

    return chatMessages;
  }, []);
}

export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const chatFromDb = await getChatById({ id });

  if (!chatFromDb) {
    notFound();
  }

  // type casting
  const chat: TChat = {
    ...chatFromDb,
    messages: convertToUIMessages(chatFromDb.messages as Array<CoreMessage>),
  };

  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }

  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  if (!user) {
    return notFound();
  }

  if (userId !== chat.userId) {
    return notFound();
  }

  return <PreviewChat id={chat.id} initialMessages={chat.messages} />;
}
