import { OpenAPIV3 } from "openapi-types";

export const userPaths: OpenAPIV3.PathsObject = {
  "/api/users/{userId}": {
    delete: {
      summary: "Delete a user (Admin only)",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "userId",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "User ID",
        },
      ],
      responses: {
        "200": {
          description: "User deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                },
              },
            },
          },
        },
        "403": { description: "Forbidden (Admin only)" },
        "404": { description: "User not found" },
        "500": { description: "Server error" },
      },
    },
  },
  "/api/users/{userId}/follow": {
    post: {
      summary: "Follow a user",
      tags: ["Follows"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "userId",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "User ID to follow",
        },
      ],
      responses: {
        "200": {
          description: "Followed successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                },
              },
            },
          },
        },
        "400": { description: "Already following or invalid user type" },
        "500": { description: "Server error" },
      },
    },
    delete: {
      summary: "Unfollow a user",
      tags: ["Follows"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "userId",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "User ID to unfollow",
        },
      ],
      responses: {
        "200": {
          description: "Unfollowed successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                },
              },
            },
          },
        },
        "400": { description: "Not following" },
        "500": { description: "Server error" },
      },
    },
  },
  "/api/users/{userId}/followers": {
    get: {
      summary: "Get user's followers",
      tags: ["Follows"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "userId",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "User ID",
        },
        {
          in: "query",
          name: "page",
          schema: { type: "integer", default: 1 },
          description: "Page number",
        },
        {
          in: "query",
          name: "limit",
          schema: { type: "integer", default: 20 },
          description: "Items per page",
        },
      ],
      responses: {
        "200": {
          description: "List of followers",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  followers: {
                    type: "array",
                    items: { $ref: "#/components/schemas/User" },
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      page: { type: "integer" },
                      limit: { type: "integer" },
                      total: { type: "integer" },
                      totalPages: { type: "integer" },
                    },
                  },
                },
              },
            },
          },
        },
        "500": { description: "Server error" },
      },
    },
  },
  "/api/users/{userId}/following": {
    get: {
      summary: "Get users followed by user",
      tags: ["Follows"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "userId",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "User ID",
        },
        {
          in: "query",
          name: "page",
          schema: { type: "integer", default: 1 },
          description: "Page number",
        },
        {
          in: "query",
          name: "limit",
          schema: { type: "integer", default: 20 },
          description: "Items per page",
        },
      ],
      responses: {
        "200": {
          description: "List of following",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  following: {
                    type: "array",
                    items: { $ref: "#/components/schemas/User" },
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      page: { type: "integer" },
                      limit: { type: "integer" },
                      total: { type: "integer" },
                      totalPages: { type: "integer" },
                    },
                  },
                },
              },
            },
          },
        },
        "500": { description: "Server error" },
      },
    },
  },
};
