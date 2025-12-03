import mongoose from "mongoose";
import dotenv from "dotenv";
import CategoryModel from "../../../db/models/Category.js";
import path from "path";
import { fileURLToPath } from "url";

// Calcola percorso assoluto verso la root del server
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path esatto verso server/.env
const envPath = path.resolve(__dirname, "../../../.env");

// Carica il file .env
dotenv.config({ path: envPath });

console.log("Loaded .env from:", envPath);
console.log("DB_CONNECTION_URI:", process.env.DB_CONNECTION_URI);

const URI = process.env.DB_CONNECTION_URI;

const categories = [
  { name: "Living" },
  { name: "Bedroom" },
  { name: "Office" },
  { name: "Storage" },
  { name: "Tables & Chairs" }
];

async function seedCategories() {
  try {
    console.log("Connessione al DB...");
    await mongoose.connect(URI);

    console.log("Eliminazione categorie esistenti...");
    await CategoryModel.deleteMany();

    console.log("Inserimento nuove categorie...");
    const inserted = await CategoryModel.insertMany(categories);

    console.log("Seed Categorie completato:", inserted.length);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Errore seed categorie:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedCategories();

// node server/api/v1/seed/seedCategories.js

