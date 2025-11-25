import { Follow, User } from "../models";

export const followUser = async (
  followerId: string,
  followingId: string
): Promise<boolean> => {
  if (followerId === followingId) {
    throw new Error("You cannot follow yourself");
  }

  const targetUser = await User.findByPk(followingId);
  if (!targetUser) {
    throw new Error("User not found");
  }

  // Check if target user is allowed to be followed (Player or Team)
  if (!["Player", "Team"].includes(targetUser.accountType)) {
    throw new Error("You can only follow Players or Teams");
  }

  const existingFollow = await Follow.findOne({
    where: { followerId, followingId },
  });

  if (existingFollow) {
    return false; // Already following
  }

  await Follow.create({ followerId, followingId });
  return true;
};

export const unfollowUser = async (
  followerId: string,
  followingId: string
): Promise<boolean> => {
  const follow = await Follow.findOne({
    where: { followerId, followingId },
  });

  if (!follow) {
    return false;
  }

  await follow.destroy();
  return true;
};

export const getFollowers = async (
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ followers: User[]; total: number }> => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const followers = await user.getFollowers({
    limit,
    offset,
    attributes: [
      "id",
      "firstName",
      "lastName",
      "profilePicture",
      "accountType",
    ],
    joinTableAttributes: [], // Exclude join table data
  });

  const total = await user.countFollowers();

  return { followers: followers as unknown as User[], total };
};

export const getFollowing = async (
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ following: User[]; total: number }> => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const following = await user.getFollowing({
    limit,
    offset,
    attributes: [
      "id",
      "firstName",
      "lastName",
      "profilePicture",
      "accountType",
    ],
    joinTableAttributes: [],
  });

  const total = await user.countFollowing();

  return { following: following as unknown as User[], total };
};
