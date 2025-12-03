import mongoose from "mongoose";
import dotenv from "dotenv";
import PointOfSalesModel from "../../../db/models/PointOfSales.js";
import path from "path";
import { fileURLToPath } from "url";

// Percorso assoluto del file corrente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Percorso assoluto del file .env nella root del server
const envPath = path.resolve(__dirname, "../../../.env");

// Carichiamo il .env
dotenv.config({ path: envPath });

console.log("Using .env from:", envPath);
console.log("DB_CONNECTION_URI:", process.env.DB_CONNECTION_URI);

const URI = process.env.DB_CONNECTION_URI;

const posData = [
	{
		name: "IKEA Roma Anagnina",
		location: {
			address: "Via Anagnina, 81",
			city: "Roma",
			state: "RM",
			zipCode: "00173",
			country: "Italy",
		},
	},
	{
		name: "IKEA Napoli Afragola",
		location: {
			address: "Via Padula, 80021 Afragola (NA)",
			city: "Afragola",
			state: "NA",
			zipCode: "80021",
			country: "Italy",
		},
	},
	{
		name: "IKEA Milano San Giuliano",
		location: {
			address: "Via Po, 1",
			city: "San Giuliano Milanese",
			state: "MI",
			zipCode: "20098",
			country: "Italy",
		},
	},
];


async function seedPOS() {
	try {
		console.log("Connessione al DB...");
		await mongoose.connect(URI);

		console.log("Rimozione POS esistenti...");
		await PointOfSalesModel.deleteMany();

		console.log("Inserimento nuovi POS...");
		const inserted = await PointOfSalesModel.insertMany(posData);

		console.log(
			"Seed POS completato:",
			inserted.length,
			"punti vendita inseriti."
		);

		await mongoose.connection.close();
		process.exit(0);
	} catch (error) {
		console.error("Errore nel seed POS:", error);
		await mongoose.connection.close();
		process.exit(1);
	}
}

seedPOS();

// node server/api/v1/seed/seedPointOfSales.js
