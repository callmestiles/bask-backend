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
  },
  tags: [
    { name: "Auth", description: "Authentication and user routes" },
    { name: "Posts", description: "Post management routes" },
    { name: "Users", description: "User management routes" },
    { name: "Comments", description: "Comment management routes" },
    { name: "Likes", description: "Like management routes" },
    { name: "Follows", description: "Follow management routes" },
  ],
};

export default swaggerSpec;
