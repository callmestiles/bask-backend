import { Like, Post } from "../models";

export const toggleLike = async (
  userId: string,
  postId: string
): Promise<{ liked: boolean }> => {
  const existingLike = await Like.findOne({
    where: { userId, postId },
  });

  const post = await Post.findByPk(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  if (existingLike) {
    await existingLike.destroy();
    await post.decrement("likesCount");
    return { liked: false };
  } else {
    await Like.create({ userId, postId });
    await post.increment("likesCount");
    return { liked: true };
  }
};

export const hasUserLikedPost = async (
  userId: string,
  postId: string
): Promise<boolean> => {
  const like = await Like.findOne({ where: { userId, postId } });
  return !!like;
};
