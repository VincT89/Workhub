import express from "express";
import { createUser } from "../controllers/users.js";

const app = express.Router();

/**
 * Create a new user -> `create`
 * @path /api/v1/users
 * @method POST
 */
app.post("/", createUser);

export default app;