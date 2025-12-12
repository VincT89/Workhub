import OrderModel from "../../../db/models/Order.js";
import { formatResponse } from "../../../utils/format.js";

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
const createOrderSchema = Joi.object({
  pointOfSales: Joi.string().custom(objectId).required(),
  product: Joi.string().custom(objectId).required(),
  totalQuantity: Joi.number().min(1).required(),

  clients: Joi.array()
    .items(
      Joi.object({
        client: Joi.string().custom(objectId).required(),
        quantity: Joi.number().min(1).required(),
      })
    )
    .min(1)
    .required(),

  stato: Joi.string().valid("Inviato", "In lavorazione", "Consegnato").default("Inviato"),
  corriere: Joi.string().default("Da assegnare"),
  note: Joi.string().allow("").optional(),

}).unknown(false);


// -----------------------------
// SCHEMA UPDATE
// -----------------------------
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
export const createOrder = async (req, res) => {
  try {
    const { error } = createOrderSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    const order = new OrderModel(req.body);
    await order.save();

    const populated = await order.populate([
      "pointOfSales",
      "product",
      "clients.client"
    ]);

    res.status(201).json(populated);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// =====================================================================
//                              READ ALL
// =====================================================================
export const getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("pointOfSales")
      .populate("product")
      .populate("clients.client");

    res.status(200).json(formatResponse(orders));

  } catch (err) {
    res.status(500).json(formatResponse({ error: err.message }, false, err.message));
  }
};


// =====================================================================
//                              READ ONE
// =====================================================================
export const getOrderById = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id)
      .populate("pointOfSales")
      .populate("product")
      .populate("clients.client");

    if (!order)
      return res.status(404).json({ error: "Ordine non trovato" });

    res.status(200).json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =====================================================================
//                              UPDATE
// =====================================================================
export const updateOrder = async (req, res) => {
  try {
    const { error } = updateOrderSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    const order = await OrderModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate(["pointOfSales", "product", "clients.client"]);

    if (!order)
      return res.status(404).json({ error: "Ordine non trovato" });

    res.status(200).json(order);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// =====================================================================
//                              DELETE
// =====================================================================
export const deleteOrder = async (req, res) => {
  try {
    const order = await OrderModel.findByIdAndDelete(req.params.id);

    if (!order)
      return res.status(404).json({ error: "Ordine non trovato" });

    res.status(200).json({ message: "Ordine eliminato con successo" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};