import { Event, User } from "../models";
import { MediaItem } from "../models/event";
import { Op } from "sequelize";
import sequelize from "../config/database";

interface CreateEventData {
  title: string;
  description: string;
  date: Date | string;
  location: string;
  media?: MediaItem[] | null;
}

export const createEvent = async (
  data: CreateEventData,
  organizerId: string
) => {
  const event = await Event.create({
    ...data,
    date: new Date(data.date),
    organizerId,
  });
  return event;
};

export const registerUserToEvent = async (
  eventId: string,
  identifier: string
) => {
  const event = await Event.findByPk(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  // Find user by ID or Username (email)
  let user;
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  if (uuidRegex.test(identifier)) {
    user = await User.findByPk(identifier);
  }

  if (!user) {
    user = await User.findOne({ where: { email: identifier } });
  }

  if (!user) {
    throw new Error("User not found");
  }

  // Check if already registered
  const isRegistered = await event.hasAttendee(user);
  if (isRegistered) {
    throw new Error("User already registered for this event");
  }

  await event.addAttendee(user);
  return { message: "Successfully registered for the event", event, user };
};

export const unregisterUserFromEvent = async (eventId: string, userId: string) => {
  const event = await Event.findByPk(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const isRegistered = await event.hasAttendee(user);
  if (!isRegistered) {
    throw new Error("User is not registered for this event");
  }

  await event.removeAttendee(user);
  return { message: "Successfully unregistered from the event" };
};

export const getAllEvents = async (limit: number = 20, offset: number = 0) => {
  const { count, rows } = await Event.findAndCountAll({
    include: [
      {
        model: User,
        as: "organizer",
        attributes: ["id", "firstName", "lastName", "email", "profilePicture"],
      },
    ],
    order: [["date", "ASC"]],
    limit,
    offset,
    distinct: true,
  });
  return { events: rows, total: count };
};

export const getAdminEvents = async (limit: number = 20, offset: number = 0) => {
  const { count, rows } = await Event.findAndCountAll({
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM "EventAttendees" AS "attendees"
            WHERE "attendees"."eventId" = "Event"."id"
          )`),
          "attendeesCount",
        ],
      ],
    },
    include: [
      {
        model: User,
        as: "organizer",
        attributes: ["id", "firstName", "lastName", "email", "profilePicture"],
      },
    ],
    order: [["date", "ASC"]],
    limit,
    offset,
    distinct: true,
  });
  return { events: rows, total: count };
};

export const getEventById = async (eventId: string) => {
  const event = await Event.findByPk(eventId, {
    include: [
      {
        model: User,
        as: "organizer",
        attributes: ["id", "firstName", "lastName", "email", "profilePicture"],
      },
      {
        model: User,
        as: "attendees",
        attributes: ["id", "firstName", "lastName", "email", "profilePicture"],
        through: { attributes: [] }, // Hide join table attributes
      },
    ],
  });

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};
