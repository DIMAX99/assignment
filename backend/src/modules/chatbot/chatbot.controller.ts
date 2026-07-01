import type { Request, Response } from "express";
import { ChatbotService } from "./chatbot.service.js";
import { Logger } from "../../utils/logger.js";

const service = new ChatbotService();

export class ChatbotController {
  async chat(req: Request, res: Response) {
    try {
      const { sessionId, message } = req.body;
      Logger.info(`Received message: ${message} for session: ${sessionId}`);
      const result = await service.chat(sessionId, message);
      Logger.info(`Response generated: ${result}`);
      res.status(200).json(result);
    } catch (err) {
      Logger.error(`Error in chat: ${err}`);
      res.status(500).json({
        message: "Failed"
      });
    }
  }

  async getMessages(req: Request, res: Response) {
    const sessionId = Number(req.params.id);

    const messages = await service.getMessages(sessionId);

    res.json(messages);
  }

  async getSessions(req: Request, res: Response) {
    const sessions = await service.getSessions();

    res.json(sessions);
  }

  async deleteSession(req: Request, res: Response) {
    const sessionId = Number(req.params.id);

    await service.deleteSession(sessionId);

    res.sendStatus(204);
  }
}