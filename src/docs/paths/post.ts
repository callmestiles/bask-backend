import { OpenAPIV3 } from "openapi-types";

export const postPaths: OpenAPIV3.PathsObject = {
  "/api/posts": {
    post: {
      summary: "Create a new post",
      tags: ["Posts"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["content"],
              properties: {
                content: { type: "string" },
                media: {
                  type: "array",
                  items: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Post created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  post: { $ref: "#/components/schemas/Post" },
                },
              },
            },
          },
        },
        "400": { description: "Validation error" },
        "403": { description: "Forbidden (Fans cannot post)" },
        "500": { description: "Server error" },
      },
    },
  },
  "/api/posts/feed": {
    get: {
      summary: "Get news feed",
      tags: ["Posts"],
      security: [{ bearerAuth: [] }],
      parameters: [
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
          description: "List of posts",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  posts: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Post" },
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
  "/api/posts/{postId}": {
    get: {
      summary: "Get a single post",
      tags: ["Posts"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "postId",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Post ID",
        },
      ],
      responses: {
        "200": {
          description: "Post details",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  post: { $ref: "#/components/schemas/Post" },
                },
              },
            },
          },
        },
        "404": { description: "Post not found" },
        "500": { description: "Server error" },
      },
    },
    put: {
      summary: "Update a post",
      tags: ["Posts"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "postId",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Post ID",
        },
      ],
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                content: { type: "string" },
                media: {
                  type: "array",
                  items: { type: "string", format: "binary" },
                },
                keptMedia: {
                  type: "string",
                  description:
                    "JSON string or array of publicIds/objects to keep",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Post updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  post: { $ref: "#/components/schemas/Post" },
                },
              },
            },
          },
        },
        "403": { description: "Forbidden (Not owner)" },
        "404": { description: "Post not found" },
        "500": { description: "Server error" },
      },
    },
    delete: {
      summary: "Delete a post",
      description:
        "Delete a post. Users can delete their own posts. Admins can delete any post.",
      tags: ["Posts"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "postId",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Post ID",
        },
      ],
      responses: {
        "200": {
          description: "Post deleted successfully",
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
        "403": { description: "Forbidden (Not owner or Admin)" },
        "404": { description: "Post not found" },
        "500": { description: "Server error" },
      },
    },
  },
  "/api/posts/user/{userId}": {
    get: {
      summary: "Get user's posts",
      tags: ["Posts"],
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
          description: "List of user posts",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  posts: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Post" },
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
  "/api/posts/{postId}/like": {
    post: {
      summary: "Toggle like on a post",
      tags: ["Likes"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "postId",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Post ID",
        },
      ],
      responses: {
        "200": {
          description: "Like toggled successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  liked: { type: "boolean" },
                },
              },
            },
          },
        },
        "404": { description: "Post not found" },
        "500": { description: "Server error" },
      },
    },
    get: {
      summary: "Check if user liked a post",
      tags: ["Likes"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "postId",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Post ID",
        },
      ],
      responses: {
        "200": {
          description: "Like status",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  liked: { type: "boolean" },
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
