// server/index.js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { connect as connectDb } from "./db/index.js";
import apiRouter from "./api/index.js";

dotenv.config();

const app = express();

// Middleware globali
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health-check semplice
app.get("/", (req, res) => {
  res.json({ success: true, message: "WorkHub API is running" });
});

// Tutte le API stanno sotto /api
app.use("/api", apiRouter);

// Porta dal .env o default
const PORT = process.env.SERVER_PORT || 3030;

const startServer = async () => {
  try {
    await connectDb();
    console.log("Connected to database");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
