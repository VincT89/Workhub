import express from "express";
import { getMeInfo } from "../controllers/me.js";
import { authUser } from "../middleware/auth.js";

const app = express.Router();

/**
 * GET /api/v1/me
 * Utente deve essere loggato
 */
app.get("/", authUser, getMeInfo);

export default app;
