import { OpenAPIV3 } from "openapi-types";

export const components: OpenAPIV3.ComponentsObject = {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
  schemas: {
    User: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        email: { type: "string", format: "email" },
        accountType: {
          type: "string",
          enum: ["Player", "Fan", "Team", "Scout", "Admin"],
        },
        firstName: { type: "string" },
        lastName: { type: "string" },
        profilePicture: { type: "string", nullable: true },
        googleId: { type: "string", nullable: true },
        isEmailVerified: { type: "boolean" },
      },
    },
    AuthResponse: {
      type: "object",
      properties: {
        message: { type: "string" },
        token: { type: "string" },
        user: { $ref: "#/components/schemas/User" },
      },
    },
    ErrorResponse: {
      type: "object",
      properties: {
        message: { type: "string" },
        errors: { type: "array", items: { type: "object" } },
      },
    },
    MediaItem: {
      type: "object",
      properties: {
        url: { type: "string" },
        type: { type: "string", enum: ["image", "video"] },
        publicId: { type: "string" },
      },
    },
    Post: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        userId: { type: "string", format: "uuid" },
        content: { type: "string" },
        media: {
          type: "array",
          items: { $ref: "#/components/schemas/MediaItem" },
          nullable: true,
        },
        likesCount: { type: "integer" },
        commentsCount: { type: "integer" },
        sharesCount: { type: "integer" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        author: { $ref: "#/components/schemas/User" },
      },
    },
    Comment: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        userId: { type: "string", format: "uuid" },
        postId: { type: "string", format: "uuid" },
        content: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        author: { $ref: "#/components/schemas/User" },
      },
    },
    Conversation: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        name: { type: "string", nullable: true },
        isGroup: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        participants: {
          type: "array",
          items: { $ref: "#/components/schemas/User" },
        },
        messages: {
          type: "array",
          items: { $ref: "#/components/schemas/Message" },
        },
      },
    },
    Message: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        conversationId: { type: "string", format: "uuid" },
        senderId: { type: "string", format: "uuid" },
        content: { type: "string" },
        isRead: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        sender: { $ref: "#/components/schemas/User" },
      },
    },
    Event: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        title: { type: "string" },
        description: { type: "string" },
        date: { type: "string", format: "date-time" },
        location: { type: "string" },
        media: {
          type: "array",
          items: { $ref: "#/components/schemas/MediaItem" },
          nullable: true,
        },
        organizerId: { type: "string", format: "uuid" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        organizer: { $ref: "#/components/schemas/User" },
        attendees: {
          type: "array",
          items: { $ref: "#/components/schemas/User" },
        },
        attendeesCount: { type: "integer" },
      },
    },
  },
};
