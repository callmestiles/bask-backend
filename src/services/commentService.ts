import { Comment, User, Post } from "../models";

export const createComment = async (
  userId: string,
  postId: string,
  content: string
): Promise<Comment> => {
  const comment = await Comment.create({ userId, postId, content });

  // Increment comments count on post
  const post = await Post.findByPk(postId);
  if (post) {
    await post.increment("commentsCount");
  }

  return comment;
};

export const getCommentsByPostId = async (
  postId: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ comments: Comment[]; total: number }> => {
  const { count, rows } = await Comment.findAndCountAll({
    where: { postId },
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

  return { comments: rows, total: count };
};

export const deleteComment = async (
  commentId: string,
  userId: string,
  isAdmin: boolean = false
): Promise<boolean> => {
  const comment = await Comment.findByPk(commentId);

  if (!comment) return false;

  if (comment.userId !== userId && !isAdmin) {
    return false;
  }

  await comment.destroy();

  // Decrement comments count on post
  const post = await Post.findByPk(comment.postId);
  if (post) {
    await post.decrement("commentsCount");
  }

  return true;
};
