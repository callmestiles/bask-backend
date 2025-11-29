import { OpenAPIV3 } from "openapi-types";

export const eventPaths: OpenAPIV3.PathsObject = {
  "/api/events": {
    get: {
      summary: "Get all events",
      tags: ["Events"],
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
          description: "List of events",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  events: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Event" },
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
      summary: "Create a new event(Admin only)",
      tags: ["Events"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["title", "description", "date", "location"],
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                date: { type: "string", format: "date-time" },
                location: { type: "string" },
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
          description: "Event created successfully",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Event" },
            },
          },
        },
        "403": { description: "Forbidden (Admin only)" },
        "500": { description: "Server error" },
      },
    },
  },
  "/api/events/{id}": {
    get: {
      summary: "Get event by ID",
      tags: ["Events"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Event ID",
        },
      ],
      responses: {
        "200": {
          description: "Event details",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Event" },
            },
          },
        },
        "404": { description: "Event not found" },
        "500": { description: "Server error" },
      },
    },
  },
  "/api/events/{id}/register": {
    post: {
      summary: "Register for an event",
      tags: ["Events"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Event ID",
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                identifier: {
                  type: "string",
                  description:
                    "User ID or Email (optional, defaults to current user)",
                },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Successfully registered",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  event: { $ref: "#/components/schemas/Event" },
                  user: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
        "400": { description: "Bad request (e.g. already registered)" },
        "404": { description: "Event or User not found" },
      },
    },
    delete: {
      summary: "Unregister from an event",
      tags: ["Events"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string", format: "uuid" },
          description: "Event ID",
        },
      ],
      responses: {
        "200": {
          description: "Successfully unregistered",
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
        "400": { description: "Bad request (e.g. not registered)" },
        "404": { description: "Event or User not found" },
      },
    },
  },
  "/api/events/admin/dashboard": {
    get: {
      summary: "Get admin dashboard events (with attendee counts)",
      tags: ["Events"],
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
          description: "List of events with stats",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  events: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Event" },
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
        "403": { description: "Forbidden (Admin only)" },
        "500": { description: "Server error" },
      },
    },
  },
};
