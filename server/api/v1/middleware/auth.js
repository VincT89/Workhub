import { User } from "../../../db/index.js";
import { verifyAccessToken } from "../../../utils/auth.js";
import { handleRouteErrors } from "../../../utils/error.js";
import { formatResponse } from "../../../utils/format.js";

/**
 * Middleware di autenticazione JWT
 */
export const authUser = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(formatResponse(null, false, "Not Authorized"));
    }

    const token = bearerToken.split(" ")[1];

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded._id, "-password", { lean: true });

    if (!user) {
      return res
        .status(401)
        .json(formatResponse(null, false, "Not Authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};
