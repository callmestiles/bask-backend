import { Request, Response } from "express";
import * as messageService from "../services/messageService";

export const getConversations = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const conversations = await messageService.getConversations(userId);
    res.status(200).json(conversations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const { conversationId } = req.params;
    const messages = await messageService.getMessages(conversationId, userId);
    res.status(200).json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
