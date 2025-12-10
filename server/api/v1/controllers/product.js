import ProductModel from "../../../db/models/Product.js";
import { handleRouteErrors } from "../../../utils/error.js";
import { formatResponse } from "../../../utils/format.js";

/**
 * GET /api/v1/products
 * Lista dei prodotti
 * Accesso: user, admin
 */
export const listProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().lean();

    return res
      .status(200)
      .json(formatResponse(products, true, "Products list"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * GET /api/v1/products/:id
 * Dettaglio prodotto
 * Accesso: user, admin
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Invalid product ID"));
    }

    const product = await ProductModel.findById(id).lean();

    if (!product) {
      return res
        .status(404)
        .json(formatResponse(null, false, "Product not found"));
    }

    return res
      .status(200)
      .json(formatResponse(product, true, "Product found"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};
