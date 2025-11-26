import { formatResponse } from "../../../utils/format.js";
import { handleRouteErrors } from "../../../utils/error.js";

/**
 * Info utente loggato
 * GET /api/v1/me
 */
export const getMeInfo = async (req, res) => {
  try {
    return res
      .status(200)
      .json(
        formatResponse({ user: req.user }, true, "Current user information")
      );
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};
