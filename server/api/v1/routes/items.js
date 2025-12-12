import express from "express"; 
import { 
  getAllItems, 
  getItemById, 
  createItem,
  updateItem,
  deliteItem,
  updateItemQuantity
} from "../controllers/items.js";
import { authUser } from "../middleware/auth.js";

const itemsRouter = express.Router();

//! JSDoc-style comments per documentare e spiegare 
/**
 * POST /api/v1/items
 * Crea un item
 */
itemsRouter.post("/", createItem);

/**
 * GET /api/v1/items
 * Restituisce tutti gli items
 */
itemsRouter.get("/", authUser, getAllItems);

/**
 * GET /api/v1/items/:id
 * Restituisce un singolo item per ID
 */
itemsRouter.get("/:id", getItemById);

/**
 * PUT /api/v1/items/:id
 * Modifica un singolo item per ID
 */
itemsRouter.put("/:id", updateItem);

/** 
* PATCH /api/v1/items/:id/quantity
Modifica la quantità di un singolo item per ID usando $inc 
( $inc è un operatore di MongoDB che incrementa (o decrementa, 
 se passi valore negativo) il valore di un campo numerico 
 in modo atomico sulla singola riga del DB.)
*/
itemsRouter.patch("/:id/quantity", updateItemQuantity);

/**
 * DELETE /api/v1/items/:id
 * Elimina un singolo item per ID
 */
itemsRouter.delete("/:id", deliteItem);

export default itemsRouter;