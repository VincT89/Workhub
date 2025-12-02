import Joi from "joi";
import { handleRouteErrors } from "../../../utils/error.js";
import { formatResponse } from "../../../utils/format.js";
import UserShiftModel from "../../../db/models/UserShift.js";

/* GET ALL SHIFTS  */
export const getAllShifts = async (req, res) => {
  try {
    const shifts = await UserShiftModel.find()
      .populate({
        path: "user",
        select: "firstName lastName email personnelNumber department workplace",
      })
      .lean();

    return res
      .status(200)
      .json(formatResponse(shifts, true, "All shifts retrieved"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/* GET SHIFTS BY USER */
export const getShiftsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Invalid user ID"));
    }

    const shifts = await UserShiftModel.find({ user: userId }).lean();

    return res
      .status(200)
      .json(formatResponse(shifts, true, "User shifts retrieved"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/* CREATE SHIFT */
export const createShift = async (req, res) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    shiftDays: Joi.array().items(Joi.string()).min(1).required(),
    shiftHours: Joi.object({
      start: Joi.string().required(),
      end: Joi.string().required(),
    }).required(),
  });

  try {
    const { value, error } = schema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json(formatResponse(null, false, error.details[0].message));
    }

    const newShift = await UserShiftModel.create(value);

    return res
      .status(201)
      .json(formatResponse(newShift, true, "Shift created successfully"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/* UPDATE SHIFT */
export const updateShift = async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res
      .status(400)
      .json(formatResponse(null, false, "Invalid shift ID"));
  }

  try {
    const updated = await UserShiftModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return res
        .status(404)
        .json(formatResponse(null, false, "Shift not found"));
    }

    return res
      .status(200)
      .json(formatResponse(updated, true, "Shift updated successfully"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/* DELETE SHIFT */
export const deleteShift = async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res
      .status(400)
      .json(formatResponse(null, false, "Invalid shift ID"));
  }

  try {
    const deleted = await UserShiftModel.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json(formatResponse(null, false, "Shift not found"));
    }

    return res
      .status(200)
      .json(formatResponse(null, true, "Shift deleted successfully"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};
