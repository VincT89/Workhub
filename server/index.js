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

// API
app.use("/api", apiRouter);

const PORT = process.env.SERVER_PORT || 3000;

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
