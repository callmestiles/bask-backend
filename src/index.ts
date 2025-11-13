import express, { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

import cors from "cors";
import { initDatabase } from "./config/database";
import passport from "passport";
// register passport strategies (side-effect import) - must run after dotenv.config()
import "./config/passport";
import authRoutes from "./routes/auth.routes";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app: Express = express();

const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(",")
  : ["http://localhost:4200"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Hello, Bask Backend!");
});

app.use("/api/auth", authRoutes);

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const startServer = async () => {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`✅Server is running on port ${PORT}`);
  });
};

startServer();
