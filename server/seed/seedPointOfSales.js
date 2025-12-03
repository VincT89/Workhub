import mongoose from "mongoose";
import dotenv from "dotenv";
import PointOfSalesModel from "../../../db/models/PointOfSales.js";

dotenv.config();

const URI = process.env.DB_CONNECTION_URI;

const posData = [
	{
		name: "IKEA Roma Anagnina",
		address: "Via Anagnina, 81, Roma",
		phone: "+39 06 7290 1",
	},
	{
		name: "IKEA Torino Collegno",
		address: "Corso Monte Cucco, 26, Collegno (TO)",
		phone: "+39 011 40341",
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
		process.exit(0);
	} catch (error) {
		console.error("Errore nel seed POS:", error);
		process.exit(1);
	}
}

seedPOS();

// Esecuzione seed con: node server/api/v1/seed/seedPointOfSales.js
