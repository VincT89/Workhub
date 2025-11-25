import express from "express";
import { login } from '../controllers/auth.js';

const app = express.Router();

/** *
 * Login user -> `login`
 @path /api/v1/auth/login
 @method POST
 */

app.post("/login", login);

export default app;