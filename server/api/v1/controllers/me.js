import { formatResponse } from "../../../utils/format.js";
import { handleRouteErrors } from "../../../utils/error.js";

/**
 * GET /api/v1/me
 * Restituisce i dati dell’utente loggato
 */
export const getMe = async (req, res) => {
  try {
    const user = req.user; // Inserito da authUser middleware

    return res
      .status(200)
      .json(formatResponse({ user }, true, "Current user information"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};
