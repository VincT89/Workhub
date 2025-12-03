import { handleRouteErrors } from "../../../utils/error.js";
import { formatResponse } from "../../../utils/format.js";
import { Leave } from "../../../db/index.js";

/**
 * GET /api/v1/leaves
 * Restituisce il record ferie/permessi dell’utente autenticato
 */
export const getUserLeaves = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const record = await Leave.findOne({ user: userId }).lean();

    if (!record) {
      return res
        .status(404)
        .json(formatResponse(null, false, "UserLeave non trovato"));
    }

    return res
      .status(200)
      .json(formatResponse(record, true, "UserLeave trovato"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/** GET /api/v1/leaves/:userId
 * Restituisce il record ferie/permessi di un utente specifico (solo admin)
 */

export const getUserLeavesByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const record = await Leave.findOne({ user: userId });

    if (!record) {
      return res
        .status(404)
        .json(formatResponse(null, false, "UserLeave non trovato"));
    }

    return res
      .status(200)
      .json(formatResponse(record, true, "Record recuperato"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};


/**
 * POST /api/v1/leaves/request
 * Crea una nuova richiesta ferie/permesso
 * Body: { year, hours, mode }
 */
export const createLeaveRequest = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    const { year, hours, mode, from, to, timeFrom, timeTo } = req.body;

    if (!year || !hours || !mode) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Campi obbligatori mancanti"));
    }

    const record = await Leave.findOne({ user: userId });
    if (!record) {
      return res
        .status(404)
        .json(formatResponse(null, false, "UserLeave non trovato"));
    }

    record.requestedHours.push({
      year,
      hours,
      mode,
      from,
      to,
      timeFrom,
      timeTo,
      status: "pending",
    });

    await record.save();

    return res
      .status(201)
      .json(formatResponse(record, true, "Richiesta inserita"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};


/**
 * PATCH /api/v1/leaves/:requestId/status
 * Aggiorna lo stato di una richiesta
 * Body: { status }
 */
export const updateLeaveStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    // validazione ID
    if (!requestId.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Invalid request ID"));
    }

    // validazione status
    if (!["approved", "pending", "denied"].includes(status)) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Valore 'status' non valido"));
    }

    const isAdmin = req.user?.role === "admin";

    // se è admin → può aggiornare qualsiasi richiesta
    const query = isAdmin
      ? { "requestedHours._id": requestId }
      : { user: req.user._id, "requestedHours._id": requestId };

    const record = await Leave.findOne(query);

    if (!record) {
      return res
        .status(404)
        .json(formatResponse(null, false, "Richiesta non trovata"));
    }

    const request = record.requestedHours.id(requestId);
    if (!request) {
      return res
        .status(404)
        .json(formatResponse(null, false, "Richiesta non trovata"));
    }

    const oldStatus = request.status;

    // Se viene APPROVATA
    if (status === "approved" && oldStatus !== "approved") {
      if (request.mode === "vacation") {
        if (record.vacationHours < request.hours) {
          return res
            .status(400)
            .json(formatResponse(null, false, "Ore di ferie insufficienti"));
        }
        record.vacationHours -= request.hours;
      }

      if (request.mode === "leave") {
        if (record.leaveHours < request.hours) {
          return res
            .status(400)
            .json(formatResponse(null, false, "Ore di permesso insufficienti"));
        }
        record.leaveHours -= request.hours;
      }
    }

    // Se viene tolta approvazione
    if (oldStatus === "approved" && status !== "approved") {
      if (request.mode === "vacation") {
        record.vacationHours += request.hours;
      } else if (request.mode === "leave") {
        record.leaveHours += request.hours;
      }
    }

    request.status = status;

    await record.save();

    return res
      .status(200)
      .json(formatResponse(record, true, "Stato richiesta aggiornato"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};


/**
 * POST /api/v1/leaves/init/:userId
 * Crea un record UserLeave per utenti già esistenti
 */
export const initUserLeave = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Invalid user ID"));
    }

    const exists = await Leave.findOne({ user: userId });
    if (exists) {
      return res
        .status(200)
        .json(formatResponse(exists, true, "UserLeave già presente"));
    }

    const created = await Leave.create({
      user: userId,
      vacationHours: 120,
      leaveHours: 40,
      requestedHours: [],
    });

    return res
      .status(201)
      .json(formatResponse(created, true, "UserLeave creato"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};
