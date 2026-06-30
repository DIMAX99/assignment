import { GoogleGenAI } from "@google/genai";
import * as wrappers from 'langsmith/wrappers';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});


const client = wrappers.wrapSDK(ai);


export class AIService {
  async generateResponse(prompt: string) {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text ?? "";
  }
}