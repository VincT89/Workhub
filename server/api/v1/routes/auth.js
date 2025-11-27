import express from "express";
import { login, register, recoverPassword } from "../controllers/auth.js";
import { authUser } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/roles.js";

const app = express.Router();

/**
 * POST /api/v1/auth/login
 * Pubblica
 */
app.post("/login", login); // pubblica, non richiede autenticazione dopo il path ci sono direttamente i controller

/**
 * POST /api/v1/auth/register
 * Protetta → solo admin
 */
app.post("/register", authUser, requireAdmin, register); // solo admin dopo il path ci sono i middleware authUser e requireAdmin e poi il controller register

/**
 * POST /api/v1/auth/recover
 * Pubblica (non richiede autenticazione)
 */
app.post("/recover", recoverPassword); // pubblica, non richiede autenticazione dopo il path ci sono direttamente i controller


export default app;
