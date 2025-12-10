// routes/customers.js
import express from "express";
import {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from "../controllers/customers.js";
import { authUser } from "../middleware/auth.js";

const app = express.Router();

/**
 * GET /api/v1/customers
 * Accessibile a tutti gli utenti e admin loggati
 */
app.get("/", authUser, getCustomers);

/**
 * GET /api/v1/customers/:id
 * Accessibile a tutti gli utenti e admin loggati
 */
app.get("/:id", authUser, getCustomerById);

/**
 * POST /api/v1/customers
 * Accessibile a tutti gli utenti e admin loggati
 */
app.post("/", authUser, createCustomer);

/**
 * PATCH /api/v1/customers/:id
 * Accessibile a tutti gli utenti e admin loggati
 */
app.patch("/:id", authUser, updateCustomer);

/**
 * DELETE /api/v1/customers/:id
 * Accessibile a tutti gli utenti e admin loggati
 */
app.delete("/:id", authUser, deleteCustomer);

export default app;