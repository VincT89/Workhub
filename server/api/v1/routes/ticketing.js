import express from "express";
import {
  getAllTickets,
  getItemById,
  createTickets,
  updateTickets,
  deliteTickets,
} from "../controllers/ticketing.js";

// Router per ticketing
const ticketingRouter = express.Router();

// CRUD routes
ticketingRouter.post("/", createTickets);
ticketingRouter.get("/", getAllTickets);
ticketingRouter.get("/:id", getItemById);
ticketingRouter.put("/:id", updateTickets);
ticketingRouter.delete("/:id", deliteTickets);

export default ticketingRouter;