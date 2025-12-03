import mongoose from "mongoose";
import dotenv from "dotenv";
import ProductModel from "../../../db/models/Product.js";
import CategoryModel from "../../../db/models/Category.js";
import path from "path";
import { fileURLToPath } from "url";

// Risolve il percorso assoluto di questo file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Risolve il percorso assoluto del file .env nella root del server
const envPath = path.resolve(__dirname, "../../../.env");

// Carica il file .env
dotenv.config({ path: envPath });

console.log("Using .env from:", envPath);
console.log("DB_CONNECTION_URI:", process.env.DB_CONNECTION_URI);

const URI = process.env.DB_CONNECTION_URI;

const productsData = [
	{
		name: "BILLY Libreria",
		price: 59,
		sku: "BILLY-WHT",
		image: "https://www.ikea.com/it/it/images/products/billy-libreria-bianco__0751192_pe746381_s5.jpg",
		description: "La libreria più famosa e versatile di IKEA.",
		specs: { weight: 25, height: 202, width: 80, depth: 28 },
	},
	{
		name: "LACK Tavolino",
		price: 9,
		sku: "LACK-TBL",
		image: "https://www.ikea.com/it/it/images/products/lack-tavolino-bianco__0644877_pe702557_s5.jpg",
		description: "Tavolino minimalista, leggero e robusto.",
		specs: { weight: 5, height: 45, width: 55, depth: 55 },
	},
	{
		name: "KALLAX Scaffale 4x4",
		price: 79,
		sku: "KALLAX-4X4",
		image: "https://www.ikea.com/it/it/images/products/kallax-scaffale-bianco__0626824_pe692835_s5.jpg",
		description: "Scaffale componibile con 16 scomparti.",
		specs: { weight: 32, height: 147, width: 147, depth: 39 },
	},
	{
		name: "POÄNG Poltrona",
		price: 79,
		sku: "POANG-CHR",
		image: "https://www.ikea.com/it/it/images/products/poaeng-poltrona-betulla-massiccia-knisa-nero__0952082_pe801541_s5.jpg",
		description: "Poltrona ergonomica in faggio curvato.",
		specs: { weight: 7, height: 104, width: 68, depth: 82 },
	},
	{
		name: "MALM Cassettiera 4 cassetti",
		price: 99,
		sku: "MALM-DRW4",
		image: "https://www.ikea.com/it/it/images/products/malm-cassettiera-a-4-cassetti-bianco__0626933_pe693030_s5.jpg",
		description: "Cassettiera elegante, scorrimento morbido.",
		specs: { weight: 28, height: 100, width: 80, depth: 48 },
	},
	{
		name: "HEMNES Comò",
		price: 149,
		sku: "HEMNES-COM3",
		image: "https://www.ikea.com/it/it/images/products/hemnes-como-a-3-cassetti-bianco-mordenzato__0910235_pe615324_s5.jpg",
		description: "Comò in legno massiccio, stile classico.",
		specs: { weight: 30, height: 95, width: 108, depth: 50 },
	},
	{
		name: "BRIMNES Letto contenitore",
		price: 249,
		sku: "BRIMNES-BED",
		image: "https://www.ikea.com/it/it/images/products/brimnes-letto-contenitore-bianco__0845653_pe709213_s5.jpg",
		description: "Letto con ampi vani contenitore.",
		specs: { weight: 45, height: 47, width: 160, depth: 206 },
	},
	{
		name: "INGOLF Sedia",
		price: 39,
		sku: "INGOLF-CHR",
		image: "https://www.ikea.com/it/it/images/products/ingolf-sedia-bianco__0323760_pe517873_s5.jpg",
		description: "Sedia stile tradizionale con schienale a croce.",
		specs: { weight: 6, height: 91, width: 42, depth: 52 },
	},
	{
		name: "ALEX Cassettiera",
		price: 69,
		sku: "ALEX-DRW",
		image: "https://www.ikea.com/it/it/images/products/alex-cassettiera-bianco__0644248_pe702242_s5.jpg",
		description: "Cassettiera per ufficio con cassetti scorrevoli.",
		specs: { weight: 21, height: 70, width: 36, depth: 58 },
	},
	{
		name: "NORRÅKER Tavolo",
		price: 129,
		sku: "NORRA-TBL",
		image: "https://www.ikea.com/it/it/images/products/norraker-tavolo-betulla__0737383_pe740209_s5.jpg",
		description: "Tavolo robusto in legno massiccio.",
		specs: { weight: 22, height: 75, width: 74, depth: 74 },
	},
];

async function seedProducts() {
	try {
		console.log("Connessione al DB...");
		await mongoose.connect(URI);

		let category = await CategoryModel.findOne({ name: "Furniture" });
		if (!category) {
			category = await CategoryModel.create({ name: "Furniture" });
		}

		console.log("Elimino vecchi prodotti...");
		await ProductModel.deleteMany();

		const docs = productsData.map((p) => ({
			...p,
			category: category._id,
		}));

		const inserted = await ProductModel.insertMany(docs);

		console.log("Prodotti IKEA inseriti:", inserted.length);
		await mongoose.connection.close();
		process.exit(0);
	} catch (error) {
		console.error("Errore seed prodotti:", error);
		await mongoose.connection.close();
		process.exit(1);
	}
}

seedProducts();

// node server/api/v1/seed/seedProducts.js 
