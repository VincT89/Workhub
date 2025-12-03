import { handleRouteErrors } from "../../../utils/error.js";
import { formatResponse } from "../../../utils/format.js";
import { Leave } from "../../../db/index.js";

/** 
 * GET /api/v1/leaves
 * Ottiene il record ferie dell’utente autenticato 
 */
export const getUserLeaves = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    let record = await Leave.findOne({ user: userId }).lean();

    // se non esiste, crealo automaticamente
    if (!record) {
      record = await Leave.create({
        user: userId,
        vacationHours: 160,
        leaveHours: 20,
        requestedHours: [],
      });

      return res.status(201).json(
        formatResponse(record, true, "Record UserLeave creato automaticamente")
      );
    }

    return res
      .status(200)
      .json(formatResponse(record, true, "UserLeave trovato"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/** 
 * GET /api/v1/leaves/user/:userId
 * Solo admin: ottiene il record ferie di un utente specifico
 */
export const getUserLeavesByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const record = await Leave.findOne({ user: userId });

    if (!record) {
      return res.status(404).json(
        formatResponse(null, false, "UserLeave non trovato")
      );
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
 * Crea una richiesta ferie/permesso
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

    // se non esiste record → crealo automaticamente
    let record = await Leave.findOne({ user: userId });

    if (!record) {
      record = await Leave.create({
        user: userId,
        vacationHours: 160,
        leaveHours: 20,
        requestedHours: [],
      });
    }

    // aggiungi richiesta
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
 * Solo admin: aggiorna lo stato della richiesta
 */
export const updateLeaveStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!requestId.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Invalid request ID"));
    }

    if (!["approved", "pending", "denied"].includes(status)) {
      return res
        .status(400)
        .json(formatResponse(null, false, "Valore 'status' non valido"));
    }

    // Admin modifica qualsiasi richiesta
    const record = await Leave.findOne({
      "requestedHours._id": requestId,
    });

    if (!record) {
      return res
        .status(404)
        .json(formatResponse(null, false, "Richiesta non trovata"));
    }

    const request = record.requestedHours.id(requestId);
    const oldStatus = request.status;

    // ↘ Se approvata, sottrae ore
    if (status === "approved" && oldStatus !== "approved") {
      if (request.mode === "vacation") {
        if (record.vacationHours < request.hours) {
          return res.status(400).json(
            formatResponse(null, false, "Ore di ferie insufficienti")
          );
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

    // ↗ Se togli approvazione → restituisci ore
    if (oldStatus === "approved" && status !== "approved") {
      if (request.mode === "vacation") {
        record.vacationHours += request.hours;
      } else {
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
 * (opzionale per admin)
 */
export const initUserLeave = async (req, res) => {
  try {
    const { userId } = req.params;

    let record = await Leave.findOne({ user: userId });

    if (record) {
      return res
        .status(200)
        .json(formatResponse(record, true, "UserLeave già presente"));
    }

    record = await Leave.create({
      user: userId,
      vacationHours: 120,
      leaveHours: 40,
      requestedHours: [],
    });

    return res
      .status(201)
      .json(formatResponse(record, true, "UserLeave creato"));
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};
