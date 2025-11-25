import { Request, Response } from "express";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../services/followService";
import { User } from "../models";

export const follow = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { userId } = req.params; // The user to follow

    const success = await followUser(user.id, userId);

    if (!success) {
      return res.status(400).json({ message: "Already following this user" });
    }

    res.status(200).json({ message: "Followed successfully" });
  } catch (error: any) {
    console.error("Follow error:", error);
    res.status(400).json({ message: error.message || "Server error" });
  }
};

export const unfollow = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { userId } = req.params; // The user to unfollow

    const success = await unfollowUser(user.id, userId);

    if (!success) {
      return res.status(400).json({ message: "Not following this user" });
    }

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error("Unfollow error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const { followers, total } = await getFollowers(userId, limit, offset);

    res.status(200).json({
      followers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get followers error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserFollowing = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const { following, total } = await getFollowing(userId, limit, offset);

    res.status(200).json({
      following,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get following error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
