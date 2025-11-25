import { Router } from "express";
import { deleteUserAccount } from "../controllers/authController";
import {
  follow,
  unfollow,
  getUserFollowers,
  getUserFollowing,
} from "../controllers/followController";
import { authenticateToken, isAdmin } from "../middleware/auth";

const router = Router();

// Admin only: Delete a user
router.delete("/:userId", authenticateToken, isAdmin, deleteUserAccount);

// Follows
router.post("/:userId/follow", authenticateToken, follow);
router.delete("/:userId/follow", authenticateToken, unfollow);
router.get("/:userId/followers", authenticateToken, getUserFollowers);
router.get("/:userId/following", authenticateToken, getUserFollowing);

export default router;
