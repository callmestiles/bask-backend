import { Router } from "express";
import * as messageController from "../controllers/messageController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.get(
  "/conversations",
  authenticateToken,
  messageController.getConversations
);

router.get(
  "/conversations/:conversationId/messages",
  authenticateToken,
  messageController.getMessages
);

export default router;
