import { Router } from "express";
import { ChatbotController } from "./chatbot.controller.js";

const router = Router();

const controller = new ChatbotController();

router.post("/", controller.chat.bind(controller));

router.get("/sessions", controller.getSessions.bind(controller));

router.get("/:id/messages", controller.getMessages.bind(controller));

router.delete("/:id", controller.deleteSession.bind(controller));

export default router;