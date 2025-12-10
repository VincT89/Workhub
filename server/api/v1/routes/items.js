import express from "express"; 
import { 
  getAllItems, 
  getItemById, 
  createItem,
  updateItem,
  deliteItem
} from "../controllers/items.js";
//import { requireAdmin } from "../middleware/roles.js";
import { authUser } from "../middleware/auth.js";

const itemsRouter = express.Router();

//! JSDoc-style comments per documentare e spiegare 
/**
 * POST /api/v1/items
 * Crea un item
 */
itemsRouter.post("/", authUser, createItem);

/**
 * GET /api/v1/items
 * Restituisce tutti gli items
 */
itemsRouter.get("/", authUser, getAllItems);

/**
 * GET /api/v1/items/:id
 * Restituisce un singolo item per ID
 */
itemsRouter.get("/:id", authUser, getItemById);

/**
 * PUT /api/v1/items/:id
 * Modifica un singolo item per ID
 */
itemsRouter.put("/:id", authUser, updateItem);

/**
 * DELETE /api/v1/items/:id
 * Elimina un singolo item per ID
 */
itemsRouter.delete("/:id", authUser, deliteItem);

export default itemsRouter;