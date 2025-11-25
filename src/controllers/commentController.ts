import { Request, Response } from "express";
import {
  createComment,
  getCommentsByPostId,
  deleteComment,
} from "../services/commentService";
import { User } from "../models";

export const addComment = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const comment = await createComment(user.id, postId, content);

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getPostComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const { comments, total } = await getCommentsByPostId(
      postId,
      limit,
      offset
    );

    res.status(200).json({
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const removeComment = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { commentId } = req.params;
    const isAdmin = user.accountType === "Admin";

    const success = await deleteComment(commentId, user.id, isAdmin);

    if (!success) {
      return res.status(403).json({
        message: "Failed to delete comment. You may not be authorized.",
      });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
