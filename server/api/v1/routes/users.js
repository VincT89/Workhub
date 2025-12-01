import express from "express";
import {
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePasswordByEmail,
} from "../controllers/users.js";
import { authUser } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/roles.js";

const app = express.Router();

/**
 * PATCH /api/v1/users/password
 * Cambia la password del PROPRIO account
 */
app.patch("/password", authUser, changePasswordByEmail); // middleware authUser per autenticare l'utente e poi controller changePasswordByEmail

/**
 * GET /api/v1/users
 * Solo admin
 */
app.get("/", authUser, requireAdmin, listUsers); // solo admin dopo il path ci sono i middleware authUser e requireAdmin e poi il controller listUsers

/**
 * GET /api/v1/users/:id
 * Solo admin
 */
app.get("/:id", authUser, requireAdmin, getUserById); // solo admin dopo il path ci sono i middleware authUser e requireAdmin e poi il controller getUserById

/**
 * PATCH /api/v1/users/:id
 * Solo admin (per ora)
 */
app.patch("/:id", authUser, updateUser); // solo admin dopo il path ci sono i middleware authUser e requireAdmin e poi il controller updateUser

/**
 * DELETE /api/v1/users/:id
 * Solo admin
 */
app.delete("/:id", authUser, requireAdmin, deleteUser); // solo admin dopo il path ci sono i middleware authUser e requireAdmin e poi il controller deleteUser


export default app;
