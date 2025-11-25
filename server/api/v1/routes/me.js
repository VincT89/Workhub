import express from "express";
import { getMeInfo } from "../controllers/me.js";
import { authUser } from "../middleware/auth.js";

const app = express.Router();

/**
 * get current user info -> `getMeInfo`
 * @path /api/v1/me
 * @method GET
 */
app.get("/", authUser, getMeInfo);

export default app;