import Joi from "joi";
import { handleRouteErrors } from "../../../utils/error.js";
import { formatResponse } from "../../../utils/format.js";
import {
  comparePassword,
  generateAccessToken,
  hashPassword,
  generateTempPassword,
} from "../../../utils/auth.js";
import { User, PointOfSales } from "../../../db/index.js";

/**
 * LOGIN dipendente
 * POST /api/v1/auth/login
 */
export const login = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  try {
    const data = await schema.validateAsync(req.body);

    const user = await User.findOne({ username: data.username }, null, {
      lean: true,
    });

    if (!user || !(await comparePassword(data.password, user.password))) {
      return res
        .status(401)
        .json(formatResponse(null, false, "Not Authorized"));
    }

    const token = generateAccessToken({ _id: user._id, role: user.role });

    const { password, ...userInfo } = user;

    return res
      .status(200)
      .json(formatResponse({ token, user: userInfo }, true, "User logged in"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * REGISTER dipendente (solo ADMIN)
 * POST /api/v1/auth/register
 */
export const register = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    personnelNumber: Joi.number().required(),
    phone: Joi.number().optional(),
    workplace: Joi.string().required(), // ObjectId PointOfSales
    contractType: Joi.string()
      .valid("indeterminato", "determinato", "part-time")
      .optional(),
    hireDate: Joi.date().optional(),
    role: Joi.string().valid("user", "admin").default("user"),
  });

  try {
    const data = await schema.validateAsync(req.body);

    // Duplicati username / email
    const exists = await User.findOne({
      $or: [{ username: data.username }, { email: data.email }],
    });

    if (exists) {
      return res
        .status(400)
        .json(formatResponse(null, false, "User already exists"));
    }

    // Verifica workplace valido
    const pos = await PointOfSales.findById(data.workplace);
    if (!pos) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Invalid workplace ID"));
    }

    // Genera password temporanea
    const tempPassword = generateTempPassword();
    const hashed = await hashPassword(tempPassword);

    const user = await User.create({
      ...data,
      password: hashed,
      isGeneratedPassword: true,
    });

    const { password, ...userInfo } = user.toObject();

    return res.status(201).json(
      formatResponse(
        {
          user: userInfo,
          tempPassword, // la vedi tu admin, da comunicare al dipendente
        },
        true,
        "User created with temporary password"
      )
    );
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};
