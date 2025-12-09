
import express from "express";
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../controllers/event.js";
import { authUser } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/roles.js";

const app = express.Router();

/**
 * 1 getAllEvents 
 * GET /api/v1/events
 * Visibile user e admin 
 */
app.get("/", authUser, getAllEvents);

/**
 * 2 getEventById 
 * GET /api/v1/event/:id
 * Visibile user e admin 
 */
app.get("/:id", authUser, getEventById);

/**
 * 3 createEvent 
 * POST /api/v1/events
 * Visibile SOLO admin 
 */
app.post("/", authUser, requireAdmin, createEvent);

/**
 * 4 updateEvent 
 * PUT /api/v1/events/:id
 * Visibile SOLO admin 
 */
app.put("/:id", authUser, requireAdmin, updateEvent);

/**
 * 5 deleteEvent 
 * DELETE /api/v1/events/:id
 * Visibile SOLO admin 
 */
app.delete("/:id", authUser, requireAdmin, deleteEvent);

export default app; 