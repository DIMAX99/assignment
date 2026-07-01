import { GoogleGenAI } from "@google/genai";
import * as wrappers from 'langsmith/wrappers';
import dotenv from "dotenv";
dotenv.config();


const ai = new GoogleGenAI({});


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