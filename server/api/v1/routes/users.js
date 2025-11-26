import express from "express";
import { listUsers } from "../controllers/users.js";
import { authUser } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/roles.js";

const app = express.Router();

/**
 * GET /api/v1/users
 * Solo admin
 */
app.get("/", authUser, requireAdmin, listUsers);

export default app;
