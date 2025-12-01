import PointOfSalesModel from "../../../db/models/PointOfSales.js";
import { handleRouteErrors } from "../../../utils/error.js";
import { formatResponse } from "../../../utils/format.js";

/**
 * GET ALL — /api/v1/pointsofsales
 * Solo admin
 */
export const listPointsOfSales = async (req, res) => {
  try {
    const list = await PointOfSalesModel.find().lean();
    return res
      .status(200)
      .json(formatResponse(list, true, "Points of sale list"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * GET BY ID — /api/v1/pointsofsales/:id
 * Solo admin
 */
export const getPointOfSaleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Invalid PointOfSale ID"));
    }

    const pos = await PointOfSalesModel.findById(id).lean();

    if (!pos) {
      return res
        .status(404)
        .json(formatResponse(null, false, "Point of sale not found"));
    }

    return res
      .status(200)
      .json(formatResponse(pos, true, "Point of sale found"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * CREATE — /api/v1/pointsofsales
 * Solo admin
 */
export const createPointOfSale = async (req, res) => {
  try {
    const newPOS = await PointOfSalesModel.create(req.body);

    return res
      .status(201)
      .json(formatResponse(newPOS, true, "Point of sale created"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * UPDATE — /api/v1/pointsofsales/:id
 * Solo admin
 */
export const updatePointOfSale = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Invalid PointOfSale ID"));
    }

    const updated = await PointOfSalesModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return res
        .status(404)
        .json(formatResponse(null, false, "Point of sale not found"));
    }

    return res
      .status(200)
      .json(formatResponse(updated, true, "Point of sale updated"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * DELETE — /api/v1/pointsofsales/:id
 * Solo admin
 */
export const deletePointOfSale = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Invalid PointOfSale ID"));
    }

    const deleted = await PointOfSalesModel.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json(formatResponse(null, false, "Point of sale not found"));
    }

    return res
      .status(200)
      .json(formatResponse(null, true, "Point of sale deleted"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};
