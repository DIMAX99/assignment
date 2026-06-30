import { AIService } from "../../config/gemini.js";
import { ChatbotRepository } from "./chatbot.repository.js";
import { SYSTEM_PROMPT } from "./prompt.js";

const repository = new ChatbotRepository();
const aiService = new AIService();

type ChatRole = "USER" | "ASSISTANT";

type ChatPromptMessage = {
  role: ChatRole;
  content: string;
};

function buildChatPrompt(messages: ChatPromptMessage[]) {
  const conversation = messages
    .map((chatMessage) => `${chatMessage.role}: ${chatMessage.content}`)
    .join("\n\n");

  return `${SYSTEM_PROMPT}

Conversation:
${conversation}
`;
}

export class ChatbotService {
  async chat(sessionId: number | undefined, message: string) {
    const userMessage = message?.trim();

    if (!userMessage) {
      throw new Error("Message is required");
    }

    let session;

    if (!sessionId) {
      session = await repository.createSession(userMessage.substring(0, 40));
    } else {
      session = await repository.getSession(sessionId);

      if (!session) {
        throw new Error("Session not found");
      }
    }

    await repository.saveMessage(session.id, "USER", userMessage);

    const messages = await repository.getMessages(session.id);
    const prompt = buildChatPrompt(messages);
    const aiResponse = await aiService.generateResponse(prompt);
    const assistantMessage = await repository.saveMessage(
      session.id,
      "ASSISTANT",
      aiResponse
    );

    return {
      sessionId: session.id,
      response: aiResponse,
      message: assistantMessage,
    };
  }

  async getMessages(sessionId: number) {
    return repository.getMessages(sessionId);
  }

  async getSessions() {
    return repository.getAllSessions();
  }

  async deleteSession(sessionId: number) {
    return repository.deleteSession(sessionId);
  }
}
