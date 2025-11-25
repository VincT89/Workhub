import { handleRouteErrors } from "../../../utils/error.js";
import { formatResponse } from "../../../utils/format.js";

/**
 * Register a new user
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
export const getMeInfo = async (req, res) => {
    try {
        const user = req.user;

        return res.status(200).json(formatResponse({ user }, true, "Current user informations"));
    } catch (error) {
        return handleRouteErrors(res, { error });
    }
}