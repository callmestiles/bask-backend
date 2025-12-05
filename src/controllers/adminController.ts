import { Request, Response } from "express";
import { getAllPosts } from "../services/postService";
import { getAdminEvents } from "../services/eventService";

export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const { posts, total } = await getAllPosts(limit, offset);

    res.status(200).json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all posts error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const { events, total } = await getAdminEvents(limit, offset);

    res.status(200).json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all events error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
