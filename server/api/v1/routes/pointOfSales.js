import express from "express";
import {
  listPointsOfSales,
  getPointOfSaleById,
  createPointOfSale,
  updatePointOfSale,
  deletePointOfSale
} from "../controllers/pointOfSales.js";
import { authUser } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/roles.js";

const app = express.Router();

/* LIST */
app.get("/", authUser, listPointsOfSales);

/* GET ONE */
app.get("/:id", authUser, requireAdmin, getPointOfSaleById);

/* CREATE */
app.post("/", authUser, requireAdmin, createPointOfSale);

/* UPDATE */
app.patch("/:id", authUser, requireAdmin, updatePointOfSale);

/* DELETE */
app.delete("/:id", authUser, requireAdmin, deletePointOfSale);

export default app;
