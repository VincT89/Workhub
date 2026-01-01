// Qui devo stabilire le funzionalità legate agli eventi

import Joi from "joi";
import { handleRouteErrors } from "../../../utils/error.js";
import { formatResponse } from "../../../utils/format.js";
import Event from "../../../db/models/Event.js";
 
/**
 * 1 - Lettura di tutti gli eventi - getAllEvents (l'export serve per usarla poi nelle routes)
 * GET /api/v1/events
 * Restituisce tutti gli eventi
 * Visibile a users e admin
 */
export const getAllEvents = async (req, res) => {
    // Provo a leggere tutti gli eventi dal database
    try {
        const events = await Event.find({}, null, { lean: true });

        return res
            .status(200) // Codice 200 -> successo di GET
            .json(formatResponse(events, true, "Events list")); // Funzione formatResponse formatta la risposta per il client

    } catch (error) {
        return handleRouteErrors(res, { error, statusCode: 500 }); // utility function per gestire errori nei controller
    }
};

/**
 * 2 - Lettura di un evento specifico - getEventById
 * GET /api/v1/events/:id
 * Restituisce un singolo evento per ID
 * Visibile a users e admin
 */
export const getEventById = async (req, res) => {
    const { id } = req.params; // Estrazione Id da URL

    // Provo a leggere l'evento specifico dal database per ID
    try {
        const event = await Event.findById(id, null, { lean: true });

        if (!event) {
            return res
                .status(404) // Codice 404 -> non trovato
                .json(formatResponse(null, false, "Event not found"));
        }

        return res
            .status(200)
            .json(formatResponse(event, true, "Event found"));

    } catch (error) {
        return handleRouteErrors(res, { error, statusCode: 500 }); 
    }
};

/**
 * 3 - Creazione di un nuovo evento - createEvent
 * POST /api/v1/event
 * Restituisce un nuovo evento
 * Private - solo admin  
 */
export const createEvent = async (req, res) => {
    const { title, description, startDate, endDate, user } = req.body; // Estrazione dati dal body

    // Definizione schema di validazione dei dati: joi verifica che i campi siano presenti e corretti
    const schema = Joi.object({ 
        title: Joi.string().required(),
        description: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        user: Joi.string().optional() 
    });

    try {
        const validatedData = await schema.validateAsync(req.body); // ValidateAsync restiuisce dati validi

        const newEvent = await new Event(validatedData).save(); // Creo e salvo il nuovo evento nel database

        return res
        .status(201) // Codice 201 -> creato
        .json(formatResponse(newEvent.toObject(), true, "Event created successfully")); 

    } catch (error) {
        return handleRouteErrors(res, { error, statusCode: 500 });
    }
}

/**
 * 4 - Modifica evento esistente - updateEvent
 * PUT /api/v1/event/:id
 * Restituisce l'evento modificato
 * Private - solo admin 
 */
export const updateEvent = async (req, res) => {
    const { id } = req.params; // Estrazione Id da URL
    const { title, description, startDate, endDate, user } = req.body; // Estrazione dati dal body

    // Definizione schema di validazione dei dati
    const schema = Joi.object({ 
        title: Joi.string().optional(),
        description: Joi.string().optional(),
        startDate: Joi.date().optional(),
        endDate: Joi.date().optional(),
        user: Joi.string().optional() 
    });

    try {
        const validatedData = await schema.validateAsync(req.body); // Validazione dati

        /**
         * Trova l'evento per ID e aggiorna con i dati validati (id, validatedData)
         * Opzioni: 
         * new -> restituisce documento aggiornato; 
         * runValidators -> applica validazione del modello Mongoose; 
         * lean: true -> restituisce un oggetto semplice;
         */
        const updatedEvent = await Event.findByIdAndUpdate( 
            id,
            validatedData,
            {new: true, runValidators: true, lean: true}  
        );

        // Se l'evento non esiste -> errore 404
        if(!updatedEvent) {
            return res
                .status(404)
                .json(formatResponse(null, false, "Event not found"));
        }

        // Eventro trovato: successo modifica -> restituisco evento aggiornato
        return res
            .status(200)
            .json(formatResponse(updatedEvent, true, "Event updated successfully"));

    } catch (error) {
        return handleRouteErrors(res, { error, statusCode: 500 });
    }
}

/**
 * 5 - Cancella evento esistente - deleteEvent
 * DELETE /api/v1/event/:id
 * Restituisce l'evento cancellato
 * Private - solo admin  
 */
export const deleteEvent = async (req, res) => {
    const { id } = req.params; // Estrazione Id da URL

    // Trovo l'evento e lo elimino: findByIdAndDelete restituisce evento cancellato
    try {
        const deletdEvent = await Event.findByIdAndDelete(
            id,
            { lean: true } 
        );

        // Se non esiste -> errore 404
        if (!deletdEvent) {
            return res
                .status(404)
                .json(formatResponse(null, false, "Event not found"));
        }
        
        // Eventro trovato: successo cancellazione -> restituisco evento cancellato
        return res
            .status(200)
            .json(formatResponse(deletdEvent, true, "Event deleted successfully"));

    } catch (error) {
        return handleRouteErrors(res, { error, statusCode: 500 });
    }
};