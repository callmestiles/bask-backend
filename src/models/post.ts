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
import Challenge from "./challenge";

export type MediaType = "image" | "video";

export interface MediaItem {
  url: string;
  type: MediaType;
  publicId: string;
}

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<string>;
  declare userId: ForeignKey<string>;
  declare challengeId: CreationOptional<ForeignKey<string> | null>;
  declare content: string;
  declare media: CreationOptional<MediaItem[] | null>;
  declare likesCount: CreationOptional<number>;
  declare commentsCount: CreationOptional<number>;
  declare sharesCount: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Association methods
  declare getUser: () => Promise<User>;
}

Post.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    challengeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "challenges",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    media: {
      type: DataTypes.JSONB, // Store as JSONB array
      allowNull: true,
      defaultValue: null,
    },
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    commentsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sharesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    tableName: "posts",
    timestamps: true,
    indexes: [{ fields: ["userId"] }, { fields: ["createdAt"] }],
  }
);

export default Post;
