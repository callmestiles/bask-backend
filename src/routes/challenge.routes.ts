import { Router } from "express";
import * as challengeController from "../controllers/challengeController";
import { authenticateToken, isAdmin } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// Public routes
router.get("/", challengeController.getAllChallenges);
router.get("/:id", challengeController.getChallengeById);
router.get("/:id/posts", challengeController.getChallengePosts);

// Protected routes (Admin only for creation)
router.post(
  "/",
  authenticateToken,
  isAdmin,
  upload.single("coverImage"),
  challengeController.createChallenge
);

export default router;
