import express from "express";
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import meRouter from "./routes/me.js";

const app = express.Router();

/**
 * /api/v1/users
 */
app.use("/users", userRouter);

/**
 * /api/v1/auth
 */
app.use("/auth", authRouter);

/**
 * /api/v1/me
 */
app.use("/me", meRouter);

export default app;
