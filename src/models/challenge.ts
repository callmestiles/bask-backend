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

export type MediaType = "image" | "video";

export interface MediaItem {
  url: string;
  type: MediaType;
  publicId: string;
}

class Challenge extends Model<
  InferAttributes<Challenge>,
  InferCreationAttributes<Challenge>
> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare description: string;
  declare hashtag: string;
  declare startDate: Date;
  declare endDate: Date;
  declare coverImage: CreationOptional<MediaItem | null>;
  declare creatorId: ForeignKey<User["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Challenge.init(
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
    hashtag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    coverImage: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    creatorId: {
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
    tableName: "challenges",
    timestamps: true,
    indexes: [{ fields: ["hashtag"] }, { fields: ["startDate", "endDate"] }],
  }
);

export default Challenge;
