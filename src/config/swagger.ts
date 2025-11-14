import { OpenAPIV3 } from "openapi-types";

const swaggerSpec: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Bask Backend API",
    version: "1.0.0",
    description: "API docs for authentication endpoints",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
      description: "Local development",
    },
    {
      url: "https://bask-backend.onrender.com",
      description: "Production (Render)",
    },
  ],
  components: {
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
            enum: ["Player", "Fan", "Team", "Scout"],
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
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register new user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "email",
                  "password",
                  "accountType",
                  "firstName",
                  "lastName",
                ],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                  accountType: {
                    type: "string",
                    enum: ["Player", "Fan", "Team", "Scout"],
                  },
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
                example: {
                  message: "User registered successfully",
                  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  user: {
                    id: "uuid-v4",
                    email: "user@example.com",
                    accountType: "Fan",
                    firstName: "John",
                    lastName: "Doe",
                    isEmailVerified: false,
                  },
                },
              },
            },
          },
          "400": {
            description: "Validation or email exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
                example: {
                  message: "Login successful",
                  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  user: {
                    id: "uuid-v4",
                    email: "user@example.com",
                    accountType: "Fan",
                    firstName: "John",
                    lastName: "Doe",
                    isEmailVerified: false,
                  },
                },
              },
            },
          },
          "400": { description: "Invalid credentials or validation errors" },
          "500": { description: "Server error" },
        },
      },
    },
    "/api/auth/google": {
      get: {
        summary: "Start Google OAuth2 flow",
        tags: ["Auth"],
        description:
          "Redirects to Google for authentication. No bearer token required.",
        responses: {
          "302": { description: "Redirect to Google OAuth consent screen" },
          "500": { description: "Server error" },
        },
      },
    },
    "/api/auth/google/callback": {
      get: {
        summary: "Google OAuth2 callback",
        tags: ["Auth"],
        description:
          "Callback endpoint used by Google. No bearer token required. On success redirects to frontend with token.",
        responses: {
          "302": {
            description:
              "Redirect to frontend with token or to login on failure",
          },
          "500": { description: "Server error" },
        },
      },
    },
    "/api/auth/profile": {
      get: {
        summary: "Get authenticated user's profile",
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "User profile",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
                example: {
                  user: {
                    id: "uuid-v4",
                    email: "user@example.com",
                    accountType: "Fan",
                    firstName: "John",
                    lastName: "Doe",
                    isEmailVerified: true,
                  },
                },
              },
            },
          },
          "401": { description: "Unauthorized - invalid or missing token" },
          "500": { description: "Server error" },
        },
      },
    },
  },
  tags: [{ name: "Auth", description: "Authentication and user routes" }],
};

export default swaggerSpec;
