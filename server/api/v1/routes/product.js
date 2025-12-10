import express from "express";
import { listProducts, getProductById } from "../controllers/product.js";
import { authUser } from "../middleware/auth.js";

const app = express.Router();

/* LIST */
app.get("/", authUser, listProducts);

/* GET ONE */
app.get("/:id", authUser, getProductById);

export default app;
