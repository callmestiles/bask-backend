import User from "./user";
import Post from "./post";
import Comment from "./comment";
import Like from "./like";
import Follow from "./follow";
import Conversation from "./conversation";
import Message from "./message";
import Event from "./event";

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

// Conversation Associations
Conversation.hasMany(Message, {
  foreignKey: "conversationId",
  as: "messages",
});

Message.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
});

Message.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
});

User.belongsToMany(Conversation, {
  through: "ConversationParticipants",
  as: "conversations",
  foreignKey: "userId",
  otherKey: "conversationId",
});

Conversation.belongsToMany(User, {
  through: "ConversationParticipants",
  as: "participants",
  foreignKey: "conversationId",
  otherKey: "userId",
});

// Event Associations
Event.belongsTo(User, {
  foreignKey: "organizerId",
  as: "organizer",
});

User.hasMany(Event, {
  foreignKey: "organizerId",
  as: "organizedEvents",
});

Event.belongsToMany(User, {
  through: "EventAttendees",
  as: "attendees",
  foreignKey: "eventId",
  otherKey: "userId",
});

User.belongsToMany(Event, {
  through: "EventAttendees",
  as: "attendingEvents",
  foreignKey: "userId",
  otherKey: "eventId",
});

export { User, Post, Comment, Like, Follow, Conversation, Message, Event };

export default { User, Post, Comment, Like, Follow, Conversation, Message, Event };
