import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { initDatabase } from "./config/database";

dotenv.config();

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, Bask Backend!");
});

const startServer = async () => {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`✅Server is running on port ${PORT}`);
  });
};

startServer();
