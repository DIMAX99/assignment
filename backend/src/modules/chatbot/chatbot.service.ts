import { ChatbotRepository } from "./chatbot.repository.js";

const repository = new ChatbotRepository();

export class ChatbotService {
  async chat(sessionId: number | undefined, message: string) {
    let session;

    if (!sessionId) {
      session = await repository.createSession(message.substring(0, 40));
    } else {
      session = await repository.getSession(sessionId);

      if (!session) {
        throw new Error("Session not found");
      }
    }

    await repository.saveMessage(session.id, "USER", message);

    return {
      sessionId: session.id,
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