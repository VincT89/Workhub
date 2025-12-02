import express from "express";
import {
  getAllShifts,
  getShiftsByUser,
  createShift,
  updateShift,
  deleteShift,
} from "../controllers/userShift.js";

import { authUser } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/roles.js";

const router = express.Router();

/**
 * GET /api/v1/userShift
 * Ritorna tutti i turni degli utenti.
 */
router.get("/", authUser, requireAdmin, getAllShifts);

/**
 * GET /api/v1/userShift/:userId
 * Ritorna i turni di uno specifico utente.
 */
router.get("/:userId", authUser, requireAdmin, getShiftsByUser);

/** POST /api/v1/userShift
 * Crea un nuovo turno per un utente.
 */
router.post("/", authUser, requireAdmin, createShift);

/** PATCH /api/v1/userShift/:id
 * Aggiorna un turno esistente.
 */
router.patch("/:id", authUser, requireAdmin, updateShift);

/** DELETE /api/v1/userShift/:id
 * Elimina un turno esistente.
 */
router.delete("/:id", authUser, requireAdmin, deleteShift);

export default router;
