import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { connect as connectDb } from "./db/index.js";
import apiRouter from "./api/index.js";

dotenv.config();

const app = express();

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // Aggiunto CLIENT_URL nel .env - usa localhost:5173 come default
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Metodi permessi
  credentials: true, // Permetti credenziali (cookie, header di autorizzazione, ecc.)
}));

// Middleware globali
app.use(helmet());
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
 
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
