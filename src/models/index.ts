import User from "./user";
import Post from "./post";
import Comment from "./comment";
import Like from "./like";
import Follow from "./follow";
import Conversation from "./conversation";
import Message from "./message";
import Event from "./event";
import EventAttendee from "./eventAttendee";
import Challenge from "./challenge";

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
  through: EventAttendee,
  as: "attendees",
  foreignKey: "eventId",
  otherKey: "userId",
});

User.belongsToMany(Event, {
  through: EventAttendee,
  as: "attendingEvents",
  foreignKey: "userId",
  otherKey: "eventId",
});

// Challenge Associations
Challenge.belongsTo(User, {
  foreignKey: "creatorId",
  as: "creator",
});

User.hasMany(Challenge, {
  foreignKey: "creatorId",
  as: "createdChallenges",
});

Post.belongsTo(Challenge, {
  foreignKey: "challengeId",
  as: "challenge",
});

Challenge.hasMany(Post, {
  foreignKey: "challengeId",
  as: "posts",
});

export {
  User,
  Post,
  Comment,
  Like,
  Follow,
  Conversation,
  Message,
  Event,
  EventAttendee,
  Challenge,
};

export default {
  User,
  Post,
  Comment,
  Like,
  Follow,
  Conversation,
  Message,
  Event,
  EventAttendee,
  Challenge,
};
