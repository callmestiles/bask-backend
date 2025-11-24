import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config();

if (
  !process.env.DB_HOST ||
  !process.env.DB_PORT ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_NAME
) {
  throw new Error("Database configuration environment variables are missing");
}

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging:
    process.env.NODE_ENV === "development" ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    charset: "UTF8",
    collate: "en_US.UTF-8",
  },
});

export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info("🚀 Database has been connected");
    if (process.env.DB_SYNC === "true") {
      await sequelize.sync({ alter: true });
      logger.info("✅ Database models synchronized.");
    } else {
      logger.warn(
        "⚠️ Skipping automatic DB sync (DB_SYNC not set). If you need tables created, set DB_SYNC=true"
      );
    }
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

export default sequelize;
