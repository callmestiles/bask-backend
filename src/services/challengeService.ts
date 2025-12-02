import { Challenge, Post, User } from "../models";
import { MediaItem } from "../models/challenge";

interface CreateChallengeData {
  title: string;
  description: string;
  hashtag: string;
  startDate: Date | string;
  endDate: Date | string;
  coverImage?: MediaItem | null;
}

export const createChallenge = async (
  data: CreateChallengeData,
  creatorId: string
) => {
  // Ensure hashtag starts with #
  let hashtag = data.hashtag.trim();
  if (!hashtag.startsWith("#")) {
    hashtag = `#${hashtag}`;
  }

  // Check if hashtag already exists
  const existingChallenge = await Challenge.findOne({ where: { hashtag } });
  if (existingChallenge) {
    throw new Error("Challenge with this hashtag already exists");
  }

  const challenge = await Challenge.create({
    ...data,
    hashtag,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    creatorId,
  });
  return challenge;
};

export const getAllChallenges = async (
  limit: number = 20,
  offset: number = 0
) => {
  const { count, rows } = await Challenge.findAndCountAll({
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "firstName", "lastName", "email", "profilePicture"],
      },
    ],
    order: [["startDate", "DESC"]],
    limit,
    offset,
    distinct: true,
  });
  return { challenges: rows, total: count };
};

export const getChallengeById = async (id: string) => {
  const challenge = await Challenge.findByPk(id, {
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "firstName", "lastName", "email", "profilePicture"],
      },
    ],
  });
  if (!challenge) {
    throw new Error("Challenge not found");
  }
  return challenge;
};

export const getChallengePosts = async (
  challengeId: string,
  limit: number = 20,
  offset: number = 0
) => {
  const challenge = await Challenge.findByPk(challengeId);
  if (!challenge) {
    throw new Error("Challenge not found");
  }

  const { count, rows } = await Post.findAndCountAll({
    where: { challengeId },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "firstName", "lastName", "email", "profilePicture"],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
    distinct: true,
  });

  return { posts: rows, total: count, challenge };
};
