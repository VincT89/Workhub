import express from "express";
import {
  getAllShifts,
  getShiftsByUser,
  updateShift,
  deleteShift,
} from "../controllers/userShift.js";

import { authUser } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/roles.js";

const router = express.Router();

/**
 * GET /api/v1/userShift
 * Ritorna tutti i turni degli utenti → SOLO ADMIN.
 */
router.get("/", authUser, requireAdmin, getAllShifts);

/**
 * GET /api/v1/userShift/:userId
 * Ritorna i turni di uno specifico utente → USER o ADMIN.
 * - USER vede solo i propri turni 
 * - ADMIN può vedere qualsiasi utente 
 */
router.get("/:userId", authUser, getShiftsByUser);

/**
 * PATCH /api/v1/userShift/:id
 * Aggiorna un turno esistente → SOLO ADMIN.
 */
router.patch("/:id", authUser, requireAdmin, updateShift);

/**
 * DELETE /api/v1/userShift/:id
 * Elimina un turno esistente → SOLO ADMIN.
 */
router.delete("/:id", authUser, requireAdmin, deleteShift);

export default router;
