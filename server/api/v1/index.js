import express from "express";
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import meRouter from "./routes/me.js";
import pointOfSalesRouter from "./routes/pointOfSales.js";
import userShiftRouter from "./routes/userShift.js";
import userLeaveRouter from "./routes/userLeave.js";
import ticketingRouter from "./routes/ticketing.js";



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

/** /api/v1/pointsofsales
 */
app.use("/pointsofsales", pointOfSalesRouter);

/** /api/v1/userShift
 */
app.use("/shifts", userShiftRouter);

/** /api/v1/leaves
*/
app.use("/leaves", userLeaveRouter);

/** /api/v1/ticketing
*/
app.use("/ticketing", ticketingRouter);



export default app;
