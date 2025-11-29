import { OpenAPIV3 } from "openapi-types";
import { components } from "./components";
import { authPaths } from "./paths/auth";
import { postPaths } from "./paths/post";
import { userPaths } from "./paths/user";
import { commentPaths } from "./paths/comment";
import { messagePaths } from "./paths/message";
import { eventPaths } from "./paths/event";
import { socketDocumentation } from "./socketDocumentation";

const swaggerSpec: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Bask Backend API",
    version: "1.0.0",
    description: "API docs for Bask Backend\n\n" + socketDocumentation,
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
  components: components,
  paths: {
    ...authPaths,
    ...postPaths,
    ...userPaths,
    ...commentPaths,
    ...messagePaths,
    ...eventPaths,
  },
  tags: [
    { name: "Auth", description: "Authentication and user routes" },
    { name: "Posts", description: "Post management routes" },
    { name: "Users", description: "User management routes" },
    { name: "Comments", description: "Comment management routes" },
    { name: "Likes", description: "Like management routes" },
    { name: "Follows", description: "Follow management routes" },
    { name: "Messages", description: "Messaging routes" },
    { name: "Events", description: "Event management routes" },
  ],
};

export default swaggerSpec;
