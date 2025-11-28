import { Router } from "express";
import * as messageController from "../controllers/messageController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get("/", authenticateToken, messageController.getConversations);

router.get(
  "/:conversationId/messages",
  authenticateToken,
  messageController.getMessages
);

export default router;
