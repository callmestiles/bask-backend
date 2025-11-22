import User from "./user";
import Post from "./post";

// Define associations here
Post.belongsTo(User, {
  foreignKey: "userId",
  as: "author",
});

User.hasMany(Post, {
  foreignKey: "userId",
  as: "posts",
});

export { User, Post };

export default { User, Post };
