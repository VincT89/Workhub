import express from "express";
import v1Router from "./v1/index.js";

const app = express.Router();

/**
 * @path /api/v1
 * @method ALL
 */
app.use("/v1", v1Router); 

export default app;