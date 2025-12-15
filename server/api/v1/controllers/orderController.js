import OrderModel from "../../../db/models/Order.js";
import ClientModel from "../../../db/models/Client.js";
import ProductsModel from "../../../db/models/Product.js";
import AffiliateProgramModel from "../../../db/models/AffiliateProgram.js";
import { formatResponse } from "../../../utils/format.js";
import { calculateAffiliatePoints } from "../../../utils/orders.js";

import Joi from "joi";
import mongoose from "mongoose";

// -----------------------------
// VALIDATORE OBJECTID
// -----------------------------
const objectId = (value, helpers) => {
	if (!mongoose.Types.ObjectId.isValid(value)) {
		return helpers.error("any.invalid");
	}
	return value;
};

// -----------------------------
// SCHEMA CREATE
// -----------------------------
/**
 * Schema di validazione per la creazione di un nuovo ordine
 * Definisce tutti i campi obbligatori e le loro regole di validazione
 */
const createOrderSchema = Joi.object({
	pointOfSales: Joi.string().custom(objectId).required(), // Punto vendita (ObjectId obbligatorio)
	product: Joi.string().custom(objectId).required(), // Prodotto (ObjectId obbligatorio)
	totalQuantity: Joi.number().min(1).required(), // Quantità totale (minimo 1)

	// Array di clienti con le rispettive quantità
	clients: Joi.array()
		.items(
			Joi.object({
				client: Joi.string().custom(objectId).required(), // Cliente (ObjectId obbligatorio)
				quantity: Joi.number().min(1).required(), // Quantità per cliente (minimo 1)
			})
		)
		.min(1) // Almeno un cliente
		.required(),

	// Stato dell'ordine con valori predefiniti
	stato: Joi.string()
		.valid("Inviato", "In lavorazione", "Consegnato")
		.default("Inviato"),

	corriere: Joi.string().default("Bartolini"), // Corriere di default
	note: Joi.string().allow("").optional(), // Note opzionali
}).unknown(false); // Non permette campi aggiuntivi

// -----------------------------
// SCHEMA UPDATE
// -----------------------------
/**
 * Schema di validazione per l'aggiornamento di un ordine
 * Tutti i campi sono opzionali per permettere aggiornamenti parziali
 */
const updateOrderSchema = Joi.object({
	pointOfSales: Joi.string().custom(objectId),
	product: Joi.string().custom(objectId),
	totalQuantity: Joi.number().min(1),

	clients: Joi.array().items(
		Joi.object({
			client: Joi.string().custom(objectId),
			quantity: Joi.number().min(1),
		})
	),

	stato: Joi.string().valid("Inviato", "In lavorazione", "Consegnato"),
	corriere: Joi.string(),
	note: Joi.string().allow(""),
}).unknown(false);

// =====================================================================
//                              CREATE
// =====================================================================
/**
 * Controller per creare un nuovo ordine
 * - Valida i dati in input
 * - Crea l'ordine nel database
 * - Calcola e assegna punti affiliazione ai clienti
 * - Restituisce l'ordine popolato con i dati correlati
 */
const PREMIUM_AFTER_ORDERS = 10;

export const createOrder = async (req, res) => {
	try {
		// Validazione dei dati in input usando lo schema Joi
		const { error } = createOrderSchema.validate(req.body, {
			abortEarly: false,
		});

		if (error) {
			return res.status(400).json({
				error: "Validation error",
				details: error.details.map((d) => d.message),
			});
		}

		// Creazione e salvataggio dell'ordine nel database
		const order = new OrderModel(req.body);
		await order.save();

		// Recupero del prodotto per ottenere il prezzo unitario
		const product = await ProductsModel.findById(order.product);
		if (!product) {
			return res.status(404).json({ error: "Prodotto non trovato" });
		}

		const prezzoUnitario = Number(product.price) || 0;

		// 🔹 Recupero programma Premium UNA VOLTA
		const premiumProgram = await AffiliateProgramModel.findOne({
			name: "Premium",
		});

		// Calcolo e assegnazione punti affiliazione per ogni cliente
		if (Array.isArray(req.body.clients) && req.body.clients.length > 0) {
			await Promise.all(
				req.body.clients.map(async (item) => {
					// Recupero dati del cliente
					const client = await ClientModel.findById(item.client);
					if (!client || !client.affiliateProgram) return;

					// Recupero del programma di affiliazione
					const affiliateProgram = await AffiliateProgramModel.findById(
						client.affiliateProgram
					);
					if (!affiliateProgram) return;

					// Calcolo dell'importo dell'ordine per questo cliente
					const orderAmount = item.quantity * prezzoUnitario;

					// Calcolo dei punti affiliazione
					const points = calculateAffiliatePoints(
						orderAmount,
						affiliateProgram.name
					);

					// Aggiornamento punti
					if (points > 0) {
						await AffiliateProgramModel.findByIdAndUpdate(
							affiliateProgram._id,
							{ $inc: { points } }
						);
					}

					// dopo 10 ordini passa a premium se era standard
					if (premiumProgram && affiliateProgram.name === "Standard") {
						const ordiniTotali = await OrderModel.countDocuments({
							"clients.client": client._id,
						});

						if (ordiniTotali >= PREMIUM_AFTER_ORDERS) {
							await ClientModel.findByIdAndUpdate(client._id, {
								affiliateProgram: premiumProgram._id,
							});
						}
					}
				})
			);
		}

		// Popolamento dell'ordine con i dati correlati per la risposta
		const populatedOrder = await order.populate([
			"pointOfSales",
			"product",
			"clients.client",
		]);

		return res.status(201).json(populatedOrder);
	} catch (err) {
		console.error("CREATE ORDER ERROR:", err);
		return res.status(500).json({ error: err.message });
	}
};

// =====================================================================
//                              READ ALL
// =====================================================================
/**
 * Controller per recuperare tutti gli ordini
 * - Recupera tutti gli ordini con dati popolati
 * - Arricchisce ogni cliente con informazioni aggiuntive (punti ordine, punti totali, ordini totali)
 * - Restituisce la lista formattata
 */
export const getOrders = async (req, res) => {
	try {
		// Recupero di tutti gli ordini con dati correlati popolati
		const orders = await OrderModel.find()
			.populate("pointOfSales")
			.populate("product")
			.populate("clients.client");

		// Arricchimento degli ordini con informazioni aggiuntive sui clienti
		const enrichedOrders = await Promise.all(
			orders.map(async (order) => {
				// Elaborazione di ogni cliente nell'ordine
				const enrichedClients = await Promise.all(
					order.clients.map(async (c) => {
						let puntiOrdine = 0; // Punti guadagnati con questo ordine
						let puntiTotali = 0; // Punti totali nel programma affiliazione
						let ordiniTotali = 0; // Numero totale di ordini del cliente

						// Calcolo informazioni se il cliente ha un programma di affiliazione
						if (c.client?.affiliateProgram) {
							const affiliateProgram = await AffiliateProgramModel.findById(
								c.client.affiliateProgram
							);

							if (affiliateProgram) {
								// Calcolo dell'importo totale dell'ordine
								const totalOrderAmount =
									Number(order.product?.price || 0) *
									Number(order.totalQuantity || 1);

								// Calcolo del prezzo unitario reale
								const unitPriceReal = totalOrderAmount / order.totalQuantity;
								// Importo specifico per questo cliente
								const clientAmount = unitPriceReal * c.quantity;

								// Calcolo punti per questo ordine
								puntiOrdine = calculateAffiliatePoints(
									clientAmount,
									affiliateProgram.name
								);

								// Punti totali nel programma
								puntiTotali = affiliateProgram.points;

								// Conteggio ordini totali del cliente
								ordiniTotali = await OrderModel.countDocuments({
									"clients.client": c.client._id,
								});
							}
						}

						// Restituzione dell'oggetto cliente arricchito
						return {
							...c.toObject(),
							puntiOrdine,
							puntiTotali,
							ordiniTotali,
						};
					})
				);

				// Restituzione dell'ordine con clienti arricchiti
				return {
					...order.toObject(),
					clients: enrichedClients,
				};
			})
		);

		res.status(200).json(formatResponse(enrichedOrders));
	} catch (err) {
		res.status(500).json(formatResponse({ error: err.message }, false));
	}
};

// =====================================================================
//                              READ ONE
// =====================================================================
/**
 * Controller per recuperare un singolo ordine tramite ID
 * - Cerca l'ordine per ID
 * - Popola i dati correlati
 * - Restituisce l'ordine o errore 404 se non trovato
 */
export const getOrderById = async (req, res) => {
	try {
		// Ricerca dell'ordine per ID con dati correlati popolati
		const order = await OrderModel.findById(req.params.id)
			.populate("pointOfSales")
			.populate("product")
			.populate("clients.client");

		// Verifica se l'ordine esiste
		if (!order) {
			return res.status(404).json({ error: "Ordine non trovato" });
		}

		res.status(200).json(order);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// =====================================================================
//                              UPDATE
// =====================================================================
/**
 * Controller per aggiornare un ordine esistente
 * - Valida i dati in input
 * - Aggiorna l'ordine nel database
 * - Restituisce l'ordine aggiornato con dati popolati
 */
export const updateOrder = async (req, res) => {
	try {
		// Validazione dei dati in input per l'aggiornamento
		const { error } = updateOrderSchema.validate(req.body, {
			abortEarly: false,
		});

		if (error) {
			return res.status(400).json({
				error: "Validation error",
				details: error.details.map((d) => d.message),
			});
		}

		// Aggiornamento dell'ordine nel database
		const order = await OrderModel.findByIdAndUpdate(req.params.id, req.body, {
			new: true, // Restituisce il documento aggiornato
			runValidators: true, // Esegue le validazioni del modello
		}).populate(["pointOfSales", "product", "clients.client"]);

		// Verifica se l'ordine esiste
		if (!order) {
			return res.status(404).json({ error: "Ordine non trovato" });
		}

		res.status(200).json(order);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

// =====================================================================
//                              DELETE
// =====================================================================
/**
 * Controller per eliminare un ordine
 * - Cerca e elimina l'ordine per ID
 * - Restituisce messaggio di conferma o errore 404
 */
export const deleteOrder = async (req, res) => {
	try {
		// Eliminazione dell'ordine dal database
		const order = await OrderModel.findByIdAndDelete(req.params.id);

		// Verifica se l'ordine esisteva
		if (!order) {
			return res.status(404).json({ error: "Ordine non trovato" });
		}

		res.status(200).json({ message: "Ordine eliminato con successo" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
