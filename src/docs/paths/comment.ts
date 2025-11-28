import { OpenAPIV3 } from "openapi-types";

export const commentPaths: OpenAPIV3.PathsObject = {
  "/api/posts/{postId}/comments": {
    post: {
      summary: "Add a comment to a post",
      tags: ["Comments"],
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
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["content"],
              properties: {
                content: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Comment added successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  comment: { $ref: "#/components/schemas/Comment" },
                },
              },
            },
          },
        },
        "400": { description: "Validation error" },
        "500": { description: "Server error" },
      },
    },
    get: {
      summary: "Get comments for a post",
      tags: ["Comments"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "postId",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Post ID",
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
          description: "List of comments",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  comments: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Comment" },
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
  "/api/comments/{commentId}": {
    delete: {
      summary: "Delete a comment",
      tags: ["Comments"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "commentId",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Comment ID",
        },
      ],
      responses: {
        "200": {
          description: "Comment deleted successfully",
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
        "500": { description: "Server error" },
      },
    },
  },
};
