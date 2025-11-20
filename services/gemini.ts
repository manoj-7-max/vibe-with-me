import { GoogleGenAI, Type } from "@google/genai";
import { INITIAL_SYSTEM_INSTRUCTION } from "../constants";
import { GeminiResponse } from "../types";

let client: GoogleGenAI | null = null;

export const getGeminiClient = () => {
  if (!client) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing from environment variables.");
      throw new Error("API Key missing");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const generateAppCode = async (
  prompt: string,
  currentContext?: string
): Promise<GeminiResponse> => {
  const ai = getGeminiClient();
  
  // Construct the prompt. If there's context (previous code), include it.
  let fullPrompt = prompt;
  if (currentContext) {
    fullPrompt = `I have an existing HTML file. I want you to MODIFY it based on this request: "${prompt}".
    
    HERE IS THE CURRENT HTML:
    \`\`\`html
    ${currentContext}
    \`\`\`
    
    Return the FULLY UPDATED HTML. Do not return just the diff.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: INITIAL_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                explanation: { type: Type.STRING },
                html: { type: Type.STRING },
                title: { type: Type.STRING }
            },
            required: ["explanation", "html"]
        },
        temperature: 0.7, // Slight creativity for UI design
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(text) as GeminiResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
