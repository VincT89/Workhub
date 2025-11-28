// server/api/v1/controllers/users.js
import { handleRouteErrors } from "../../../utils/error.js";
import { formatResponse } from "../../../utils/format.js";
import { User } from "../../../db/index.js";
import { comparePassword, hashPassword } from "../../../utils/auth.js";

/**
 * GET /api/v1/users
 * Solo admin
 * Restituisce tutti gli utenti senza password
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

/**
 * GET /api/v1/users/:id
 * Solo admin
 * Restituisce un singolo utente per ID
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validazione ID (formato ObjectId) in modo semplice per MongoDB per evitare errori di formato
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Invalid user ID"));
    }

    // Cerco utente, escludo password
    const user = await User.findById(id, "-password").lean(); // lean() per ottenere un oggetto semplice

    if (!user) {
      return res
        .status(404)
        .json(formatResponse(null, false, "User not found"));
    }

    return res
      .status(200)
      .json(formatResponse(user, true, "User found"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * UPDATE USER
 * PATCH /api/v1/users/:id
 * Solo admin
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validazione ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) { // controllo formato ObjectId
      return res
        .status(400)
        .json(formatResponse(null, false, "Invalid user ID"));
    }

    // Impedisce aggiornamento password qui
    if (req.body.password) {
      delete req.body.password;
    }

    // Aggiornamento
    const updated = await User.findByIdAndUpdate(id, req.body, { // aggiorna con i dati nel body della richiesta con findByIdAndUpdate poi restituisce il documento aggiornato
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!updated) {
      return res
        .status(404)
        .json(formatResponse(null, false, "User not found"));
    }

    return res
      .status(200)
      .json(formatResponse(updated, true, "User updated successfully"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * DELETE USER
 * DELETE /api/v1/users/:id
 * Solo admin
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validazione ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Invalid user ID"));
    }

    const deleted = await User.findByIdAndDelete(id); // elimina l'utente per ID

    if (!deleted) {
      return res
        .status(404)
        .json(formatResponse(null, false, "User not found"));
    }

    return res
      .status(200)
      .json(formatResponse(null, true, "User deleted successfully"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * CHANGE PASSWORD (by email)
 * PATCH /api/v1/users/password
 * Body: { email, oldPassword, newPassword }
 */
export const changePasswordByEmail = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Missing required fields"));
    }

    // Recupera utente tramite email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json(formatResponse(null, false, "User not found"));
    }

    // L’utente può cambiare SOLO la sua password
    if (req.user.email !== email) {
      return res
        .status(403)
        .json(formatResponse(null, false, "Cannot change another user's password"));
    }

    // Verifica old password
    const isValid = await comparePassword(oldPassword, user.password);

    if (!isValid) {
      return res
        .status(401)
        .json(formatResponse(null, false, "Old password is incorrect"));
    }

    // Hash nuova password
    const hashed = await hashPassword(newPassword);

    user.password = hashed;
    user.isGeneratedPassword = false;

    await user.save();

    return res
      .status(200)
      .json(formatResponse(null, true, "Password changed successfully"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

