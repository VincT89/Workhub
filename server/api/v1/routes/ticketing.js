import express from "express";
import {
  getAllTickets,
  getItemById,
  createTickets,
  updateTickets,
  deliteTickets,
} from "../controllers/ticketing.js";
import { requireAdmin } from "../middleware/roles.js";
import { authUser } from "../middleware/auth.js";

// Router per ticketing
const ticketingRouter = express.Router();

// CRUD routes
ticketingRouter.post("/", authUser, createTickets);
ticketingRouter.get("/", authUser, getAllTickets);
ticketingRouter.get("/:id",authUser, getItemById);
ticketingRouter.put("/:id", authUser, requireAdmin, updateTickets);
ticketingRouter.delete("/:id", authUser, requireAdmin, deliteTickets);

export default ticketingRouter;