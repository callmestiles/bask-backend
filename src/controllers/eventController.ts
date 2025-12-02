import { Request, Response } from "express";
import * as eventService from "../services/eventService";
import { uploadToCloudinary } from "../services/cloudinary-service";
import { MediaItem } from "../models/event";

export const createEvent = async (req: Request, res: Response) => {
  try {
    //req.user is an Admin
    const organizerId = (req.user as any).id;
    const eventData = req.body;
    const files = req.files as Express.Multer.File[];

    let media: MediaItem[] = [];

    // If files are uploaded, upload all to Cloudinary
    if (files && files.length > 0) {
      try {
        // Upload all files in parallel
        const uploadPromises = files.map((file) =>
          uploadToCloudinary(file.buffer)
        );
        const uploadResults = await Promise.all(uploadPromises);

        // Map results to MediaItem format
        media = uploadResults.map((result) => ({
          url: result.url,
          type: result.mediaType,
          publicId: result.publicId,
        }));
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          message: "Failed to upload media files",
          error: uploadError,
        });
      }
    }

    const event = await eventService.createEvent(
      {
        ...eventData,
        media: media.length > 0 ? media : null,
      },
      organizerId
    );

    res.status(201).json(event);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const registerForEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // User can register themselves.
    // If an identifier is provided in body (e.g. for admin registering someone else, or user confirming their id), use it.
    // Otherwise default to the authenticated user's ID.
    const identifier = req.body.identifier || (req.user as any).id;

    const result = await eventService.registerUserToEvent(id, identifier);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const unregisterFromEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any).id;

    const result = await eventService.unregisterUserFromEvent(id, userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const { events, total } = await eventService.getAllEvents(limit, offset);
    res.status(200).json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(id);
    res.status(200).json(event);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const verifyEventTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // eventId
    const { ticketId } = req.body;

    if (!ticketId) {
      return res.status(400).json({ message: "Ticket ID is required" });
    }

    const result = await eventService.verifyTicket(id, ticketId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
