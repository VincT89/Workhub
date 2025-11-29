import express from "express";
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import meRouter from "./routes/me.js";
import eventsRouter from "./routes/events.js"; 

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

/**
 * /api/v1/events
 */
app.use("/events", eventsRouter);

export default app;
