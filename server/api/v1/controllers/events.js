import Joi  from "joi";
import { formatResponse } from "../../../utils/format.js";
import { handleRouteErrors } from "../../../utils/error.js";
import EventModel from "../../../db/models/Event.js";


/**
 * GET /api/v1/events
 * Recupera tutti gli eventi
 */
export const listEvents = async (req, res) => {
  try {
    const events = await EventModel.find({}).sort({ startDate: 1 }).lean(); // Recupera tutti gli eventi ordinati per data di inizio - lean() per restituire oggetti JavaScript semplici
    return res.status(200).json(
      formatResponse(events, true, "Events retrieved successfully")
    );
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * GET /api/v1/events/:id
 * Recupera un evento per ID
 */
export const getEventById = async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id).lean();// Trova l'evento per ID
    if (!event) {
      return res
        .status(404)
        .json(formatResponse(null, false, "Event not found"));
    }
    return res.status(200).json(
      formatResponse(event, true, "Event retrieved successfully")
    );
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * POST /api/v1/events
 * Crea un nuovo evento - solo admin
 */
export const createEvent = async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow("", null),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
//opzionale
    user: Joi.string().optional().allow(null, ""),
  });

  try {
    const { value, error } = schema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json(formatResponse(null, false, error.details[0].message));
    }
    
    const { title, description, startDate, endDate, user } = value; // Estrai i dati validati - cioe. title, description, startDate, endDate, user si trovano in value

    if (new Date(endDate) < new Date(startDate)) {
      return res
        .status(400)
        .json(formatResponse(null, false, "End date must be after start date"));
    }

    const newEventDoc = await EventModel.create({ // Crea il nuovo evento con i dati validati
      title,
      description,
      startDate,
      endDate,
      user: user || null,
    });

    const newEvent = newEventDoc.toObject(); // Converti in oggetto semplice

    return res.status(201).json(
      formatResponse(newEvent, true, "Event created successfully")
    );
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * PATCH /api/v1/events/:id
 * Aggiorna un evento esistente - solo admin
 */
export const updateEvent = async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().min(3).optional(),
    description: Joi.string().min(3).optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    user: Joi.string().optional().allow(null, ""),
  });

  try {
    const { value, error } = schema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json(formatResponse(null, false, error.details[0].message));
    }

    if (value.startDate && value.endDate) {
      if (new Date(value.endDate) < new Date(value.startDate)) {
        return res
          .status(400)
          .json(formatResponse(null, false, "End date must be after start date"));
      }
    }
    
    const updated = await EventModel.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true }
    ).lean();

    if (!updated) {
      return res
        .status(404)
        .json(formatResponse(null, false, "Event not found"));
    }
    return res.status(200).json(
      formatResponse(updated, true, "Event updated successfully")
    );
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

/**
 * DELETE /api/v1/events/:id
 * Elimina un evento esistente - solo admin
 */
export const deleteEvent = async (req, res) => {
  try {
    const deleted = await EventModel.findByIdAndDelete(req.params.id).lean();

    if (!deleted) {
      return res
        .status(404)
        .json(formatResponse(null, false, "Event not found"));
    }
    return res.status(200).json(
      formatResponse(deleted, true, "Event deleted successfully")
    );
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};