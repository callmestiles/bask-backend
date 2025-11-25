import { Router } from "express";
import { deleteUserAccount } from "../controllers/authController";
import { authenticateToken, isAdmin } from "../middleware/auth";

const router = Router();

// Admin only: Delete a user
router.delete("/:userId", authenticateToken, isAdmin, deleteUserAccount);

export default router;
