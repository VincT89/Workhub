import express from "express";
import { getMe } from "../controllers/me.js";
import { authUser } from "../middleware/auth.js";

const app = express.Router();

/**
 * GET /api/v1/me
 * Utente deve essere loggato
 */
app.get("/", authUser, getMe); // L'utente deve essere autenticato per accedere alle proprie info - nelle parentesi c'è il middleware da eseguire (authUser) prima di eseguire la funzione getMe

export default app;
