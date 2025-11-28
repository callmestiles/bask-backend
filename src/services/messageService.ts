import { User, Conversation, Message } from "../models";
import { Op } from "sequelize";

export const createConversation = async (
  initiatorId: string,
  recipientId: string
) => {
  console.log(
    `[createConversation] Initiator: ${initiatorId}, Recipient: ${recipientId}`
  );

  const initiator = await User.findByPk(initiatorId);
  const recipient = await User.findByPk(recipientId);

  console.log(`[createConversation] Initiator Found: ${!!initiator}`);
  console.log(`[createConversation] Recipient Found: ${!!recipient}`);

  if (!initiator) {
    throw new Error(`Initiator user not found: ${initiatorId}`);
  }

  if (!recipient) {
    throw new Error(`Recipient user not found: ${recipientId}`);
  }

  // Restriction: Fans cannot initiate conversations with other user types
  if (initiator.accountType === "Fan" && recipient.accountType !== "Fan") {
    throw new Error("Fans can only initiate conversations with other fans.");
  }

  // Check if conversation already exists
  const conversations = await Conversation.findAll({
    include: [
      {
        model: User,
        as: "participants",
        where: {
          id: {
            [Op.in]: [initiatorId, recipientId],
          },
        },
      },
    ],
  });

  // Filter to find one with exactly these 2 participants
  // Note: This logic might need refinement depending on how Sequelize returns the data
  // But essentially we want to avoid creating duplicate conversations
  let existingConversation = null;

  for (const conv of conversations) {
    // @ts-ignore
    const participants = await conv.getParticipants();
    const participantIds = participants.map((p: any) => p.id);
    if (
      participantIds.length === 2 &&
      participantIds.includes(initiatorId) &&
      participantIds.includes(recipientId)
    ) {
      existingConversation = conv;
      break;
    }
  }

  if (existingConversation) {
    return existingConversation;
  }

  const conversation = await Conversation.create();
  // @ts-ignore
  await conversation.addParticipants([initiator, recipient]);

  return conversation;
};

export const createGroupConversation = async (
  initiatorId: string,
  recipientIds: string[],
  name?: string
) => {
  const initiator = await User.findByPk(initiatorId);
  if (!initiator) {
    throw new Error(`Initiator user not found: ${initiatorId}`);
  }

  const recipients = await User.findAll({
    where: {
      id: {
        [Op.in]: recipientIds,
      },
    },
  });

  if (recipients.length !== recipientIds.length) {
    throw new Error("One or more recipients not found");
  }

  // Restriction: Fans cannot initiate conversations with other user types
  if (initiator.accountType === "Fan") {
    const nonFanRecipients = recipients.filter((r) => r.accountType !== "Fan");
    if (nonFanRecipients.length > 0) {
      throw new Error("Fans can only initiate conversations with other fans.");
    }
  }

  const conversation = await Conversation.create({
    isGroup: true,
    name: name || "Group Chat",
  });

  // @ts-ignore
  await conversation.addParticipants([initiator, ...recipients]);

  return conversation;
};

export const sendMessage = async (
  senderId: string,
  conversationId: string,
  content: string
) => {
  const conversation = await Conversation.findByPk(conversationId, {
    include: [{ model: User, as: "participants" }],
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // Check if sender is participant
  // @ts-ignore
  const isParticipant = conversation.participants.some(
    (p: any) => p.id === senderId
  );
  if (!isParticipant) {
    throw new Error("User is not a participant in this conversation");
  }

  const message = await Message.create({
    conversationId,
    senderId,
    content,
  });

  return message;
};

export const getConversations = async (userId: string) => {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Conversation,
        as: "conversations",
        include: [
          {
            model: User,
            as: "participants",
            attributes: ["id", "firstName", "lastName", "profilePicture"],
            through: { attributes: [] },
          },
          {
            model: Message,
            as: "messages",
            limit: 1,
            order: [["createdAt", "DESC"]],
          },
        ],
      },
    ],
    order: [
      [
        { model: Conversation, as: "conversations" },
        { model: Message, as: "messages" },
        "createdAt",
        "DESC",
      ],
    ],
  });

  if (!user) {
    throw new Error("User not found");
  }

  // @ts-ignore
  return user.conversations;
};

export const getMessages = async (conversationId: string, userId: string) => {
  const conversation = await Conversation.findByPk(conversationId, {
    include: [
      {
        model: User,
        as: "participants",
      },
    ],
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // @ts-ignore
  const isParticipant = conversation.participants.some(
    (p: any) => p.id === userId
  );
  if (!isParticipant) {
    throw new Error("User is not a participant in this conversation");
  }

  const messages = await Message.findAll({
    where: { conversationId },
    order: [["createdAt", "ASC"]],
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "firstName", "lastName", "profilePicture"],
      },
    ],
  });

  return messages;
};

export const markMessagesAsRead = async (
  conversationId: string,
  userId: string
) => {
  // Mark all messages in this conversation NOT sent by the user as read
  await Message.update(
    { isRead: true },
    {
      where: {
        conversationId,
        senderId: {
          [Op.ne]: userId,
        },
        isRead: false,
      },
    }
  );
};
