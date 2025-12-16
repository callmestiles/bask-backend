import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { findUserById } from "../services/userService";
import {
  createConversation,
  createGroupConversation,
  sendMessage,
  markMessagesAsRead,
} from "../services/messageService";

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  const allowedOrigins = process.env.FRONTEND_URLS
    ? process.env.FRONTEND_URLS.split(",")
    : ["http://localhost:9002"];

  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
          allowedOrigins.includes(origin) ||
          origin.startsWith("capacitor://") ||
          origin.startsWith("ionic://") ||
          origin === "file://"
        ) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket: Socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      const user = await findUserById(decoded.userId);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.data.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.data.user.id}`);

    // Join a conversation room
    socket.on("join_conversation", (data: any) => {
      let conversationId: string;
      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          conversationId = parsed.conversationId || data; // Handle { conversationId: "..." } or just "..."
        } catch (e) {
          conversationId = data;
        }
      } else {
        conversationId = data.conversationId || data; // Handle object or direct value
      }

      socket.join(conversationId);
      console.log(
        `User ${socket.data.user.id} joined conversation ${conversationId}`
      );
    });

    // Leave a conversation room
    socket.on("leave_conversation", (data: any) => {
      let conversationId: string;
      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          conversationId = parsed.conversationId || data;
        } catch (e) {
          conversationId = data;
        }
      } else {
        conversationId = data.conversationId || data;
      }

      socket.leave(conversationId);
      console.log(
        `User ${socket.data.user.id} left conversation ${conversationId}`
      );
    });

    // Create a new conversation
    socket.on("create_conversation", async (data: any) => {
      try {
        console.log("Received create_conversation event:", data);
        console.log("Type of data:", typeof data);

        let recipientId: string;

        if (typeof data === "string") {
          try {
            const parsed = JSON.parse(data);
            recipientId = parsed.recipientId;
          } catch (e) {
            // If it's just a raw string, assume it IS the ID
            recipientId = data;
          }
        } else {
          recipientId = data.recipientId;
        }

        const initiatorId = socket.data.user.id;
        console.log("Initiator ID:", initiatorId, "Recipient ID:", recipientId);

        if (!recipientId) {
          throw new Error("Recipient ID is missing in payload");
        }

        const conversation = await createConversation(initiatorId, recipientId);

        // Emit back to sender so they can navigate/update UI
        socket.emit("conversation_created", conversation);
      } catch (error: any) {
        console.error("Error creating conversation:", error);
        socket.emit("error", { message: error.message });
      }
    });

    // Create a new group conversation
    socket.on("create_group_conversation", async (data: any) => {
      try {
        console.log("Received create_group_conversation event:", data);
        let recipientIds: string[];
        let name: string | undefined;

        if (typeof data === "string") {
          try {
            const parsed = JSON.parse(data);
            recipientIds = parsed.recipientIds;
            name = parsed.name;
          } catch (e) {
            throw new Error("Invalid payload format");
          }
        } else {
          recipientIds = data.recipientIds;
          name = data.name;
        }

        const initiatorId = socket.data.user.id;

        if (
          !recipientIds ||
          !Array.isArray(recipientIds) ||
          recipientIds.length === 0
        ) {
          throw new Error("Recipient IDs are missing or invalid");
        }

        const conversation = await createGroupConversation(
          initiatorId,
          recipientIds,
          name
        );

        // Emit back to sender
        socket.emit("conversation_created", conversation);
      } catch (error: any) {
        console.error("Error creating group conversation:", error);
        socket.emit("error", { message: error.message });
      }
    });

    // Send a message
    socket.on("send_message", async (data: any) => {
      try {
        let conversationId: string;
        let content: string;

        if (typeof data === "string") {
          try {
            const parsed = JSON.parse(data);
            conversationId = parsed.conversationId;
            content = parsed.content;
          } catch (e) {
            throw new Error("Invalid payload format");
          }
        } else {
          conversationId = data.conversationId;
          content = data.content;
        }

        const senderId = socket.data.user.id;

        console.log(
          `[send_message] Sender: ${senderId}, Conversation: ${conversationId}, Content: ${content}`
        );

        // Save message to DB
        const message = await sendMessage(senderId, conversationId, content);

        console.log(
          `[send_message] Message saved. Emitting to room: ${conversationId}`
        );

        // Emit to everyone in the room including sender
        io.to(conversationId).emit("new_message", message);
      } catch (error: any) {
        socket.emit("error", { message: error.message });
      }
    });

    // Mark messages as read
    socket.on("mark_as_read", async (data: any) => {
      try {
        console.log("Received mark_as_read event:", data);
        let conversationId: string;

        if (typeof data === "string") {
          try {
            const parsed = JSON.parse(data);
            conversationId = parsed.conversationId;
          } catch (e) {
            // If it's just a raw string, assume it IS the ID
            conversationId = data;
          }
        } else {
          conversationId = data.conversationId;
        }

        if (!conversationId) {
          throw new Error("Conversation ID is missing");
        }

        const userId = socket.data.user.id;
        console.log(
          `Marking messages as read for conversation: ${conversationId}, user: ${userId}`
        );

        await markMessagesAsRead(conversationId, userId);

        // Notify others in the room that messages were read
        socket
          .to(conversationId)
          .emit("messages_read", { conversationId, userId });

        console.log("Messages marked as read and event emitted.");
      } catch (error: any) {
        console.error("Error in mark_as_read:", error);
        socket.emit("error", { message: error.message });
      }
    });

    // Typing indicators
    socket.on("typing_start", (data: any) => {
      let conversationId: string;

      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          conversationId = parsed.conversationId;
        } catch (e) {
          conversationId = data;
        }
      } else {
        conversationId = data.conversationId;
      }

      socket.to(conversationId).emit("user_typing", {
        conversationId: conversationId,
        userId: socket.data.user.id,
        isTyping: true,
      });
    });

    socket.on("typing_stop", (data: any) => {
      let conversationId: string;

      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          conversationId = parsed.conversationId;
        } catch (e) {
          conversationId = data;
        }
      } else {
        conversationId = data.conversationId;
      }

      socket.to(conversationId).emit("user_typing", {
        conversationId: conversationId,
        userId: socket.data.user.id,
        isTyping: false,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
