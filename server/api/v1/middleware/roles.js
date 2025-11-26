import { formatResponse } from "../../../utils/format.js";

/**
 * Permette l'accesso solo agli admin
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json(formatResponse(null, false, "Admin privileges required"));
  }
  next();
};
