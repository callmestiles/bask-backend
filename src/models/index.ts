import User from "./user";
import Post from "./post";
import Comment from "./comment";
import Like from "./like";
import Follow from "./follow";

// Define associations here
Post.belongsTo(User, {
  foreignKey: "userId",
  as: "author",
});

User.hasMany(Post, {
  foreignKey: "userId",
  as: "posts",
});

// Comment Associations
Comment.belongsTo(User, {
  foreignKey: "userId",
  as: "author",
});

User.hasMany(Comment, {
  foreignKey: "userId",
  as: "comments",
});

Comment.belongsTo(Post, {
  foreignKey: "postId",
  as: "post",
});

Post.hasMany(Comment, {
  foreignKey: "postId",
  as: "comments",
});

// Like Associations
Like.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Like, {
  foreignKey: "userId",
  as: "likes",
});

Like.belongsTo(Post, {
  foreignKey: "postId",
  as: "post",
});

Post.hasMany(Like, {
  foreignKey: "postId",
  as: "likes",
});

// Follow Associations
User.belongsToMany(User, {
  through: Follow,
  as: "followers",
  foreignKey: "followingId",
  otherKey: "followerId",
});

User.belongsToMany(User, {
  through: Follow,
  as: "following",
  foreignKey: "followerId",
  otherKey: "followingId",
});

export { User, Post, Comment, Like, Follow };

export default { User, Post, Comment, Like, Follow };
