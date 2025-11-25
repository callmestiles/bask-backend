import { Router } from "express";
import { removeComment } from "../controllers/commentController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.delete("/:commentId", authenticateToken, removeComment);

export default router;
