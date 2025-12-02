import { OpenAPIV3 } from "openapi-types";

export const challengePaths: OpenAPIV3.PathsObject = {
  "/api/challenges": {
    get: {
      summary: "Get all challenges",
      tags: ["Challenges"],
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
          description: "List of challenges",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  challenges: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Challenge" },
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
    post: {
      summary: "Create a new challenge (Admin only)",
      tags: ["Challenges"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: [
                "title",
                "description",
                "hashtag",
                "startDate",
                "endDate",
              ],
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                hashtag: { type: "string" },
                startDate: { type: "string", format: "date-time" },
                endDate: { type: "string", format: "date-time" },
                coverImage: { type: "string", format: "binary" },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Challenge created successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Challenge" },
            },
          },
        },
        "400": { description: "Bad request (e.g. hashtag exists)" },
        "403": { description: "Forbidden (Admin only)" },
        "500": { description: "Server error" },
      },
    },
  },
  "/api/challenges/{id}": {
    get: {
      summary: "Get challenge by ID",
      tags: ["Challenges"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Challenge ID",
        },
      ],
      responses: {
        "200": {
          description: "Challenge details",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Challenge" },
            },
          },
        },
        "404": { description: "Challenge not found" },
        "500": { description: "Server error" },
      },
    },
  },
  "/api/challenges/{id}/posts": {
    get: {
      summary: "Get posts for a challenge",
      tags: ["Challenges"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Challenge ID",
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
          description: "List of posts for the challenge",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  challenge: { $ref: "#/components/schemas/Challenge" },
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
        "404": { description: "Challenge not found" },
        "500": { description: "Server error" },
      },
    },
  },
};
