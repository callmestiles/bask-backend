import { Post, User } from "../models";
import { MediaItem } from "../models/post";

interface CreatePostDTO {
  userId: string;
  content: string;
  media?: MediaItem[] | null;
}

export const createPost = async (postData: CreatePostDTO): Promise<Post> => {
  return await Post.create(postData);
};

export const getPostById = async (postId: string): Promise<Post | null> => {
  return await Post.findByPk(postId, {
    include: [
      {
        model: User,
        as: "author",
        attributes: [
          "id",
          "firstName",
          "lastName",
          "profilePicture",
          "accountType",
        ],
      },
    ],
  });
};

export const getPostsByUserId = async (userId: string): Promise<Post[]> => {
  return await Post.findAll({
    where: { userId },
    include: [
      {
        model: User,
        as: "author",
        attributes: [
          "id",
          "firstName",
          "lastName",
          "profilePicture",
          "accountType",
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

export const getAllPosts = async (
  limit: number = 20,
  offset: number = 0
): Promise<{ posts: Post[]; total: number }> => {
  const { count, rows } = await Post.findAndCountAll({
    include: [
      {
        model: User,
        as: "author",
        attributes: [
          "id",
          "firstName",
          "lastName",
          "profilePicture",
          "accountType",
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return { posts: rows, total: count };
};

export const updatePost = async (
  postId: string,
  userId: string,
  updateData: { content?: string; media?: MediaItem[] }
): Promise<Post | null> => {
  const post = await Post.findOne({
    where: { id: postId, userId },
  });

  if (!post) return null;

  await post.update(updateData);
  return post;
};

export const deletePost = async (
  postId: string,
  userId: string
): Promise<boolean> => {
  const post = await Post.findOne({
    where: { id: postId, userId },
  });

  if (!post) return false;

  await post.destroy();
  return true;
};
