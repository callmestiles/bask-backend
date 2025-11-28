import { OpenAPIV3 } from "openapi-types";

export const messagePaths: OpenAPIV3.PathsObject = {
  "/api/messages/conversations": {
    get: {
      summary: "Get user's conversations",
      tags: ["Messages"],
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "List of conversations",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Conversation" },
              },
            },
          },
        },
        "500": { description: "Server error" },
      },
    },
  },
  "/api/messages/conversations/{conversationId}/messages": {
    get: {
      summary: "Get messages in a conversation",
      tags: ["Messages"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "conversationId",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Conversation ID",
        },
      ],
      responses: {
        "200": {
          description: "List of messages",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Message" },
              },
            },
          },
        },
        "404": { description: "Conversation not found" },
        "500": { description: "Server error" },
      },
    },
  },
};
