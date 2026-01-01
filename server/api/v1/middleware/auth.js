import { User } from "../../../db/index.js";
import { verifyAccessToken } from "../../../utils/auth.js";
import { handleRouteErrors } from "../../../utils/error.js";
import { formatResponse } from "../../../utils/format.js";

/**
 * Middleware di autenticazione JWT
 * Controlla header Authorization: Bearer <token>
 */
export const authUser = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(formatResponse(null, false, "Not Authorized"));
    }

    const token = bearerToken.split(" ")[1]; // Prendo il token dopo "Bearer " 

    let decoded; // Payload decodificato
    try {
      decoded = verifyAccessToken(token); // Verifica e decodifica il token
    } catch (err) {
      // Token scaduto o non valido
      return res
        .status(401)
        .json(formatResponse(null, false, "Invalid or expired token"));
    }

    // Cerco l'utente nel DB e tolgo la password dal risultato
    const user = await User.findById(decoded._id, "-password").lean();

    if (!user) {
      return res
        .status(401)
        .json(formatResponse(null, false, "Not Authorized"));
    }

    // Metto l'utente sulla request per i controller successivi
    req.user = user;
    req.token = {
      accessToken: token,
      decoded,
    }
    next();
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};
