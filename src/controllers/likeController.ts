import { Request, Response } from "express";
import { toggleLike, hasUserLikedPost } from "../services/likeService";
import { User } from "../models";

export const likePost = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { postId } = req.params;

    const result = await toggleLike(user.id, postId);

    res.status(200).json({
      message: result.liked ? "Post liked" : "Post unliked",
      liked: result.liked,
    });
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const checkLikeStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { postId } = req.params;

    const liked = await hasUserLikedPost(user.id, postId);

    res.status(200).json({ liked });
  } catch (error) {
    console.error("Check like status error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
