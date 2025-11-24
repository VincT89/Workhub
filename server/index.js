import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connect as connectDb } from './db/index.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.listen(process.env.SERVER_PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT || 3000}`);

  connectDb();
});