import { Request, Response } from "express";
import * as challengeService from "../services/challengeService";
import { uploadToCloudinary } from "../services/cloudinary-service";
import { MediaItem } from "../models/challenge";

export const createChallenge = async (req: Request, res: Response) => {
  try {
    const creatorId = (req.user as any).id;
    const challengeData = req.body;
    const file = req.file;

    let coverImage: MediaItem | null = null;

    if (file) {
      try {
        const result = await uploadToCloudinary(file.buffer);
        coverImage = {
          url: result.url,
          type: result.mediaType,
          publicId: result.publicId,
        };
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          message: "Failed to upload cover image",
          error: uploadError,
        });
      }
    }

    const challenge = await challengeService.createChallenge(
      {
        ...challengeData,
        coverImage,
      },
      creatorId
    );

    res.status(201).json(challenge);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllChallenges = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const { challenges, total } = await challengeService.getAllChallenges(
      limit,
      offset
    );
    res.status(200).json({
      challenges,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getChallengeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const challenge = await challengeService.getChallengeById(id);
    res.status(200).json(challenge);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const getChallengePosts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const { posts, total, challenge } =
      await challengeService.getChallengePosts(id, limit, offset);

    res.status(200).json({
      challenge,
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
