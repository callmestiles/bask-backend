import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import sequelize from "../config/database";
import User from "./user";
import Event from "./event";

class EventAttendee extends Model<
  InferAttributes<EventAttendee>,
  InferCreationAttributes<EventAttendee>
> {
  declare eventId: ForeignKey<Event["id"]>;
  declare userId: ForeignKey<User["id"]>;
  declare ticketId: CreationOptional<string>;
  declare checkedIn: CreationOptional<boolean>;
  declare checkedInAt: CreationOptional<Date | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

EventAttendee.init(
  {
    eventId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: "events",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    ticketId: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    checkedIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    checkedInAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "EventAttendees",
    timestamps: true,
  }
);

export default EventAttendee;
