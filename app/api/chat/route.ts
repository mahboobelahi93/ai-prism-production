import { deleteChatById, getChatById, saveChat } from "@/actions/chat";
import { customModel } from "@/chat-ai";
import { createOpenAI } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";
import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";

const nim = createOpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NEXT_PUBLIC_NVIDIA_API_KEY,
});

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages);

  // Build the system prompt
  let systemPrompt = `You are a friendly and helpful assistant helping users create a report.
  The report should include sections like Introduction, Objectives, Methodology, Results, and Conclusion.
  Interact with the user in a casual and engaging manner.
  Ask open-ended questions to gather information for each section, and make the conversation enjoyable.

  When there is KEYWORDS it means that user has uploaded one or multiple files and keywords has been extracted from the
  system that is made by us, dont say anything about the internal mechanism for pdf or whether the 
  keywords extracted or not, you should ask whether you should generate Final report based on the uploaded files or just continue.

  For example reponse: Would you like me to generate a final report based on the uploaded files, 
  or should we continue gathering more information for each section?"

  If the user wants to skip a question or doesn't have information for a section, 
  they can type 'skip' or 'I prefer not to answer', and you should move on to the next section.
  After gathering enough information, ask the user if they want to generate the report by showing two options: 'Yes' or 'No'.
  If they choose 'Yes', generate the report and present it to them.
  If they choose 'No', end the conversation.

  Remember to make the conversation flow naturally, and avoid sounding robotic.
  Do not provide any information about the internal mechanisms of the system or the AI model.
  Do not reply any other arbitory questions e.x what is the capital of Bangladesh, if the user asks any arbitory question, just ignore it and ask about report creation.

  Generate a detailed report and make the report as long as you can based on the input data provided. The report should be enclosed between \`<!--REPORT_START-->\` and \`<!--REPORT_END-->\` for clear identification.`;

  const result = await streamText({
    // model: nim("nvidia/llama-3.1-nemotron-70b-instruct"),
    model: customModel,
    system: systemPrompt,
    messages: coreMessages,
    maxSteps: 5,
    onFinish: async ({ responseMessages, finishReason }) => {
      console.log("finishReason : ", finishReason);

      if (session?.user?.id) {
        try {
          await saveChat({
            id,
            messages: [...coreMessages, ...responseMessages],
            userId: session.user.id,
          });
        } catch (error) {
          console.error("Failed to save chat");
        }
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  console.log("Attempting to delete chat with ID:", id);

  if (!id) {
    return Response.json({ error: "Not Found" }, { status: 404 });
  }

  try {
    const chat = await getChatById({ id });
    console.log(
      "Found chat:",
      !!chat,
      "Chat userId:",
      chat?.userId,
      "Session userId:",
      session.user.id,
    );

    if (!chat || chat.userId !== session.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteChatById({ id });

    console.log("Chat deleted");

    return Response.json({ message: "Chat deleted" }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}
