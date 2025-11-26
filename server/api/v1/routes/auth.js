import express from "express";
import { login, register } from "../controllers/auth.js";
import { authUser } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/roles.js";

const app = express.Router();

/**
 * POST /api/v1/auth/login
 * Pubblica
 */
app.post("/login", login);

/**
 * POST /api/v1/auth/register
 * Protetta → solo admin
 */
app.post("/register", authUser, requireAdmin, register);

export default app;
