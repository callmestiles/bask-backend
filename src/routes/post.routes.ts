import express from "express";
import {
  createNewPost,
  getPost,
  getUserPosts,
  getFeed,
  updateUserPost,
  deleteUserPost,
} from "../controllers/postController";
import { addComment, getPostComments } from "../controllers/commentController";
import { likePost, checkLikeStatus } from "../controllers/likeController";
import { authenticateToken } from "../middleware/auth";
import { upload } from "../middleware/upload";
import {
  validateCreatePost,
  validateUpdatePost,
  validatePostId,
  validateUserId,
  handleValidationErrors,
} from "../middleware/postValidation";

const router = express.Router();

// This allows up to 10 files with the field name "media"
router.post(
  "/",
  authenticateToken,
  upload.array("media", 10), // Accept multiple files
  validateCreatePost,
  handleValidationErrors,
  createNewPost
);

router.get("/feed", authenticateToken, getFeed);

router.get(
  "/:postId",
  authenticateToken,
  validatePostId,
  handleValidationErrors,
  getPost
);

router.get(
  "/user/:userId",
  authenticateToken,
  validateUserId,
  handleValidationErrors,
  getUserPosts
);

router.put(
  "/:postId",
  authenticateToken,
  upload.array("media", 10), // Accept multiple files for updates too
  validatePostId,
  validateUpdatePost,
  handleValidationErrors,
  updateUserPost
);

router.delete(
  "/:postId",
  authenticateToken,
  validatePostId,
  handleValidationErrors,
  deleteUserPost
);

// Comments
router.post(
  "/:postId/comments",
  authenticateToken,
  validatePostId,
  handleValidationErrors,
  addComment
);

router.get(
  "/:postId/comments",
  authenticateToken,
  validatePostId,
  handleValidationErrors,
  getPostComments
);

// Likes
router.post(
  "/:postId/like",
  authenticateToken,
  validatePostId,
  handleValidationErrors,
  likePost
);

router.get(
  "/:postId/like",
  authenticateToken,
  validatePostId,
  handleValidationErrors,
  checkLikeStatus
);

export default router;
