import express from "express";
import {
  getUserLeaves,
  createLeaveRequest,
  updateLeaveStatus,
  initUserLeave,
  getUserLeavesByAdmin,
} from "../controllers/userLeave.js";
import { authUser } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/roles.js";

const app = express.Router();

/**
 * GET /api/v1/leaves
 * Restituisce il record ferie/permessi dell’utente autenticato
 */
app.get("/", authUser, getUserLeaves);

/** GET /api/v1/leaves/:userId
 * Restituisce il record ferie/permessi di un utente specifico (solo admin)
 */
app.get("/:userId", authUser, requireAdmin, getUserLeavesByAdmin);

/**
 * POST /api/v1/leaves/request
 * Crea una richiesta ferie/permesso
 */
app.post("/request", authUser, createLeaveRequest);

/**
 * PATCH /api/v1/leaves/:requestId/status
 * Aggiorna lo stato della richiesta
 */
app.patch("/:requestId/status", authUser, requireAdmin, updateLeaveStatus);

/**
 * POST /api/v1/leaves/init/:userId
 * Inizializza record UserLeave per utenti già esistenti
 */
app.post("/init/:userId", authUser, initUserLeave);

export default app;
