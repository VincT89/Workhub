import Joi from "joi";
import { handleRouteErrors } from "../../../utils/errors.js";
import { formatResponse } from "../../../utils/format.js";
import { hashPassword } from "../../../utils/auth.js";
import { User } from "../../../db/index.js";

/**
 * Register a new user
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
export const createUser = async (req, res) => {
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
    });

    try {
        const data = await schema.validateAsync(req.body);

        data.password = await hashPassword(data.password);

        const user = (await new User(data).save()).toObject();

        delete user.password;

        return res.status(200).json(formatResponse({ user }, true, "New user registered"));
    } catch (error) {
        return handleRouteErrors(res, { error });
    }
}