import Groq from "groq-sdk";

export function useLlamaVision(apiKey: string) {
  const groq = new Groq({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  async function callLlamaVision(prompt: string, image_url: string) {
    console.log("Calling LlamaVision...");
    try {
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: image_url },
              } as any, // Using 'any' due to SDK type limitations
            ],
          },
        ],
        temperature: 0,
        model: "llama-3.2-11b-vision-preview",
        max_tokens: 300,
      });

      return response.choices[0]?.message?.content || "No response generated";
    } catch (error) {
      console.error("Error calling LlamaVision:", error);
      throw error;
    }
  }

  return {
    callLlamaVision,
  };
}
