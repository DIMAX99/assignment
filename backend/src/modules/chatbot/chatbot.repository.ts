import { prisma } from "../../config/prisma.js";

export class ChatbotRepository {
  async createSession(title: string) {
    return prisma.chatSession.create({
      data: {
        title,
      },
    });
  }

  async getSession(sessionId: number) {
    return prisma.chatSession.findUnique({
      where: { id: sessionId },
    });
  }

  async getAllSessions() {
    return prisma.chatSession.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async getMessages(sessionId: number) {
    return prisma.chatMessage.findMany({
      where: {
        sessionId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async saveMessage(
    sessionId: number,
    role: "USER" | "ASSISTANT",
    content: string
  ) {
    return prisma.chatMessage.create({
      data: {
        sessionId,
        role,
        content,
      },
    });
  }

  async deleteSession(sessionId: number) {
    return prisma.chatSession.delete({
      where: {
        id: sessionId,
      },
    });
  }
}