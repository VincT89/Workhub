import Joi from "joi";
import { handleRouteErrors } from "../../../utils/error.js";
import { formatResponse } from "../../../utils/format.js";
import {
  hashPassword,
  generateTempPassword,
} from "../../../utils/auth.js";
import { User, PointOfSales } from "../../../db/index.js";

/**
 * Register a new employee (admin only)
 */
export const createUser = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    personnelNumber: Joi.number().required(),
    phone: Joi.number().optional(),
    workplace: Joi.string().required(),
    contractType: Joi.string()
      .valid("indeterminato", "determinato", "part-time")
      .optional(),
    hireDate: Joi.date().optional(),
    role: Joi.string().valid("user", "admin").default("user"),
  });

  try {
    const data = await schema.validateAsync(req.body);

    const exists = await User.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });

    if (exists) {
      return res
        .status(400)
        .json(formatResponse(null, false, "User already exists"));
    }

    const pos = await PointOfSales.findById(data.workplace);
    if (!pos) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Invalid workplace ID"));
    }

    const tempPassword = generateTempPassword();
    const hashedPassword = await hashPassword(tempPassword);

    const newUser = await User.create({
      ...data,
      password: hashedPassword,
      isGeneratedPassword: true,
    });

    const { password, ...userWithoutPassword } = newUser.toObject();

    return res.status(201).json(
      formatResponse(
        {
          user: userWithoutPassword,
          tempPassword,
        },
        true,
        "User created with temporary password"
      )
    );
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * List all users (admin only)
 */
export const listUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password", { lean: true });

    return res
      .status(200)
      .json(formatResponse(users, true, "Users list"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};
