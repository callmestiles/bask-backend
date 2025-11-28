# Socket.io Documentation

This API uses Socket.io for real-time messaging.

## Connection

Connect to the base URL of the server (e.g., `http://localhost:3000` or `https://bask-backend.onrender.com`).

**Authentication:**
You must provide the JWT token in the handshake auth object or Authorization header.

```javascript
import { io } from "socket.io-client";

const socket = io("https://bask-backend.onrender.com", {
  auth: {
    token: "YOUR_JWT_TOKEN",
  },
});
```

## Events (Client -> Server)

### `create_conversation`

Creates a new 1-on-1 conversation.

**Payload:**

```json
{
  "recipientId": "uuid-of-recipient"
}
```

### `create_group_conversation`

Creates a new group conversation.

**Payload:**

```json
{
  "recipientIds": ["uuid-1", "uuid-2"],
  "name": "Group Name (Optional)"
}
```

### `join_conversation`

Joins a conversation room to receive real-time updates.

**Payload:**

```json
{
  "conversationId": "uuid-of-conversation"
}
```

### `leave_conversation`

Leaves a conversation room.

**Payload:**

```json
{
  "conversationId": "uuid-of-conversation"
}
```

### `send_message`

Sends a message to a conversation.

**Payload:**

```json
{
  "conversationId": "uuid-of-conversation",
  "content": "Hello world"
}
```

### `mark_as_read`

Marks all messages in a conversation as read by the current user.

**Payload:**

```json
{
  "conversationId": "uuid-of-conversation"
}
```

### `typing_start`

Indicates the user has started typing.

**Payload:**

```json
{
  "conversationId": "uuid-of-conversation"
}
```

### `typing_stop`

Indicates the user has stopped typing.

**Payload:**

```json
{
  "conversationId": "uuid-of-conversation"
}
```

## Events (Server -> Client)

### `conversation_created`

Emitted to the creator when a conversation is successfully created.

**Payload:** `Conversation` object

### `new_message`

Emitted to all participants in a conversation room when a new message is sent.

**Payload:** `Message` object

### `messages_read`

Emitted to other participants when a user marks messages as read.

**Payload:**

```json
{
  "conversationId": "uuid-of-conversation",
  "userId": "uuid-of-reader"
}
```

### `user_typing`

Emitted to other participants when a user starts or stops typing.

**Payload:**

```json
{
  "conversationId": "uuid-of-conversation",
  "userId": "uuid-of-typer",
  "isTyping": true // or false
}
```

### `error`

Emitted when an operation fails.

**Payload:**

```json
{
  "message": "Error description"
}
```
