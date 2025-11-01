import express, { Express } from "express";

const app: Express = express();

app.get("/", (req, res) => {
  res.send("Hello, Bask Backend!");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
