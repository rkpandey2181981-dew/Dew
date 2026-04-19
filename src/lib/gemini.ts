/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { Template } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateContent(template: Template, inputs: Record<string, string>, style?: string) {
  let prompt = template.prompt;
  
  // Replace placeholders in the prompt with user inputs
  for (const [key, value] of Object.entries(inputs)) {
    prompt = prompt.replace(`{${key}}`, value);
  }

  const styleInstruction = style ? ` The content should be written in a ${style} style.` : "";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt + styleInstruction,
      config: {
        systemInstruction: "You are an expert content creator and copywriter. Generate high-quality, engaging content based on the provided parameters. Output in Markdown format for better structure.",
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content. Please check your AI Studio secrets.");
  }
}
