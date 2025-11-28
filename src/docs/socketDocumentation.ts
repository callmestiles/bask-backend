export const socketDocumentation = `
## Real-time Messaging (Socket.io)

This API supports real-time messaging using Socket.io.

**Connection:**
Connect to the root URL with your JWT token in the \`auth\` object:
\`\`\`javascript
const socket = io("https://bask-backend.onrender.com", {
  auth: { token: "YOUR_JWT_TOKEN" }
});
\`\`\`

**Events:**

*   **Client -> Server**:
    *   \`create_conversation\`: \`{ recipientId: string }\`
    *   \`create_group_conversation\`: \`{ recipientIds: string[], name?: string }\`
    *   \`join_conversation\`: \`{ conversationId: string }\`
    *   \`send_message\`: \`{ conversationId: string, content: string }\`
    *   \`mark_as_read\`: \`{ conversationId: string }\`
    *   \`typing_start\`: \`{ conversationId: string }\`
    *   \`typing_stop\`: \`{ conversationId: string }\`

*   **Server -> Client**:
    *   \`new_message\`: Returns the full Message object.
    *   \`conversation_created\`: Returns the full Conversation object.
    *   \`messages_read\`: \`{ conversationId: string, userId: string }\`
    *   \`user_typing\`: \`{ conversationId: string, userId: string, isTyping: boolean }\`
    *   \`error\`: \`{ message: string }\`

For full documentation, please refer to the [Socket Documentation](https://github.com/callmestiles/bask-backend/blob/main/src/docs/sockets.md) (or the \`src/docs/sockets.md\` file in the repo).
`;
