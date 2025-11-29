import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  BelongsToManyAddAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyCountAssociationsMixin,
} from "sequelize";
import sequelize from "../config/database";
import User from "./user";

export type MediaType = "image" | "video";

export interface MediaItem {
  url: string;
  type: MediaType;
  publicId: string;
}

class Event extends Model<
  InferAttributes<Event>,
  InferCreationAttributes<Event>
> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare description: string;
  declare date: Date;
  declare location: string;
  declare media: CreationOptional<MediaItem[] | null>; // Array of MediaItems
  declare organizerId: ForeignKey<User["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Association Mixins for Attendees
  declare addAttendee: BelongsToManyAddAssociationMixin<User, string>;
  declare removeAttendee: BelongsToManyRemoveAssociationMixin<User, string>;
  declare hasAttendee: BelongsToManyHasAssociationMixin<User, string>;
  declare countAttendees: BelongsToManyCountAssociationsMixin;
}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    media: {
      type: DataTypes.JSONB,
      defaultValue: [],
      allowNull: true,
    },
    organizerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
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
    tableName: "events",
    timestamps: true,
  }
);

export default Event;
