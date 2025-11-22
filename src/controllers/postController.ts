import { Request, Response } from "express";
import {
  createPost,
  getPostById,
  getPostsByUserId,
  getAllPosts,
  updatePost,
  deletePost,
} from "../services/postService";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/cloudinary-service";
import { User } from "../models";
import { MediaItem } from "../models/post";

// Create a new post
export const createNewPost = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { content } = req.body;
    const files = req.files as Express.Multer.File[];

    // Only Players, Teams, and Scouts can post
    if (user.accountType === "Fan") {
      return res.status(403).json({
        message: "Fans are not allowed to create posts",
      });
    }

    if (!content) {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    let media: MediaItem[] = [];

    // If files are uploaded, upload all to Cloudinary
    if (files && files.length > 0) {
      try {
        // Upload all files in parallel
        const uploadPromises = files.map((file) =>
          uploadToCloudinary(file.buffer)
        );
        const uploadResults = await Promise.all(uploadPromises);

        // Map results to MediaItem format
        media = uploadResults.map((result) => ({
          url: result.url,
          type: result.mediaType,
          publicId: result.publicId,
        }));
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          message: "Failed to upload media files",
          error: uploadError,
        });
      }
    }

    const post = await createPost({
      userId: user.id,
      content,
      media: media.length > 0 ? media : null,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a single post by ID
export const getPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await getPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ post });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all posts by a specific user
export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const posts = await getPostsByUserId(userId);

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Get user posts error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all posts (feed)
export const getFeed = async (req: Request, res: Response) => {
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
    console.error("Get feed error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a post
export const updateUserPost = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { postId } = req.params;
    const { content, keptMedia } = req.body; // keptMedia should be a JSON string or array of publicIds/objects
    const files = req.files as Express.Multer.File[];

    const existingPost = await getPostById(postId);

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost.userId !== user.id) {
      return res.status(403).json({
        message: "You don't have permission to update this post",
      });
    }

    // Parse keptMedia (it might come as a JSON string if sent via FormData)
    let keptMediaIds: string[] = [];
    if (keptMedia) {
      let parsed = keptMedia;
      // Try to parse if it's a string, but fallback to using the string itself if parsing fails
      if (typeof keptMedia === "string") {
        try {
          parsed = JSON.parse(keptMedia);
        } catch (e) {
          parsed = keptMedia;
        }
      }

      if (Array.isArray(parsed)) {
        keptMediaIds = parsed.map((item: any) =>
          typeof item === "string" ? item : item.publicId
        );
      } else if (typeof parsed === "string") {
        keptMediaIds = [parsed];
      } else if (
        typeof parsed === "object" &&
        parsed !== null &&
        parsed.publicId
      ) {
        keptMediaIds = [parsed.publicId];
      }
    }

    const currentMedia = existingPost.media || [];
    const mediaToKeep: MediaItem[] = [];

    // Identify which old media to delete
    const deletePromises = currentMedia.map(async (item) => {
      if (keptMediaIds.includes(item.publicId)) {
        mediaToKeep.push(item); // User wants to keep this
      } else {
        // User removed this from the UI, delete from Cloudinary
        await deleteFromCloudinary(item.publicId);
      }
    });

    await Promise.all(deletePromises);

    //Handle New Media Uploads
    let newMedia: MediaItem[] = [];
    if (files && files.length > 0) {
      try {
        const uploadPromises = files.map((file) =>
          uploadToCloudinary(file.buffer)
        );
        const uploadResults = await Promise.all(uploadPromises);

        newMedia = uploadResults.map((result) => ({
          url: result.url,
          type: result.mediaType,
          publicId: result.publicId,
        }));
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          message: "Failed to upload new media files",
          error: uploadError,
        });
      }
    }

    // Handle New Media Uploads
    const finalMedia = [...mediaToKeep, ...newMedia];

    const updateData: any = {};
    if (content) updateData.content = content;

    // Always update media if we processed deletions or additions
    // If finalMedia is empty but we had media before, it means user deleted everything.
    updateData.media = finalMedia.length > 0 ? finalMedia : null;

    // We already verified ownership, so we can use the service to update
    const updatedPost = await updatePost(postId, user.id, updateData);

    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a post
export const deleteUserPost = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { postId } = req.params;

    const post = await getPostById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== user.id) {
      return res.status(403).json({
        message: "You don't have permission to delete this post",
      });
    }

    if (post.media && post.media.length > 0) {
      const deletePromises = post.media.map((item) =>
        deleteFromCloudinary(item.publicId)
      );
      await Promise.all(deletePromises);
    }

    const success = await deletePost(postId, user.id);

    if (!success) {
      return res.status(500).json({
        message: "Failed to delete post",
      });
    }

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
