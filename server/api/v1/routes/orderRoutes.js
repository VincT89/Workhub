import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController.js';
import { authUser } from '../middleware/auth.js';




const router = express.Router();


router.use(authUser);

// CRUD
router.post('/', createOrder);       //  Crea ordine
router.get('/', getOrders);          //  Lista ordini
router.get('/:id', getOrderById);    //  Dettaglio ordine
router.put('/:id', updateOrder);     //  Aggiorna ordine
router.delete('/:id', deleteOrder);  //  Elimina ordine

export default router;