import TicketModel from "../../../db/models/Ticket.js";
import { handleRouteErrors } from "../../../utils/error.js";

// Crea funzioni C.R.U.D.

//! CREATE
//@ Controller per creare un singolo ticket per ID
// creo un nuovo ticket che deve rispettare la struttura definita in TicketModel
export const createTickets = async (req, res) => {
  try {
    // Ensure `name` exists and avoid trivial duplicate collisions when client doesn't provide it.
    const payload = { ...req.body };

    if (!payload.name) {
      // Accept `title` from some clients as alias, otherwise build a fallback
      const base = payload.title ? String(payload.title).trim() : 'ticket';
      // Append timestamp to make name effectively unique by default
      payload.name = `${base}-${Date.now()}`;
    }

    const newTicket = new TicketModel(payload);  // Crea un ticket coi dati passati nel corpo della richiesta (req.body)
    const savedTicket = await newTicket.save();  // Salva il nuovo ticket nel database

    // Popola il riferimento `user` prima di rispondere
    await savedTicket.populate('user', 'firstName lastName email');

    res.status(201).json(savedTicket); // Risponde con status 201 (creato) e il ticket salvato in formato JSON
  } catch (error) {
    // Validation errors -> 400
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }

    // Duplicate key (unique) -> 409 Conflict
    if (error.code && error.code === 11000) {
      return res.status(409).json({ error: 'Duplicate key', details: error.keyValue });
    }

    return handleRouteErrors(res, { error });
  }
};
/* 
il codice di stato HTTPS "201 Created" è più preciso in questo caso: 
dice al client che un nuovo oggetto è stato creato.
È una buona pratica REST rispettare i codici HTTP corretti, 
perché aiutano chi consuma (utilizza/fa richiesta, 
quindi il client) l’API a capire cosa è successo.


Alcuni codici hanno anche un “reason phrase” (una descrizione testuale standard), ad esempio:
200 OK
201 Created
404 Not Found
500 Internal Server Error
*/

//! READ
//@ Controller per ottenere tutti gli ticket
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await TicketModel.find()
      .populate('user', 'firstName lastName email'); // Popola user per la lista

    res.status(200).json(tickets); // Risponde con status 200 (OK) e i ticket in formato JSON
  }
    catch (error) { 
    return handleRouteErrors(res, { error });
  } 
};

//@ Controller per ottenere un singolo ticket per ID
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await TicketModel.findById(id)
      .populate('user', 'firstName lastName email avatar') // campi user che vuoi
      /* .populate('category', 'name'); // campi category che vuoi */
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.status(200).json(ticket);
  } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

//! UPDATE
//@ Controller per aggiornare un singolo ticket per ID
export const updateTickets = async (req, res) => {
  try {
    const { id } = req.params; // Estrae l'ID dai parametri della richiesta
    const updatedTicket = await TicketModel.findByIdAndUpdate(
        id,
        req.body,
        { new: true } // Opzione per restituire il documento aggiornato
    );
    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" }); // Se non trovato, risponde con status 404 (Non trovato)
    }  
    res.status(200).json(updatedTicket); // Risponde con status 200 (OK) e il ticket aggiornato in formato JSON
    } catch (error) {
    return handleRouteErrors(res, { error });
  }
};

//! DELETE
//@ Controller per eliminare un singolo ticket per ID
export const deliteTickets = async (req, res) => {
  try {
    const { id } = req.params; // Estrae l'ID dai parametri della richiesta
    const deletedTicket = await TicketModel.findByIdAndDelete(id); // Elimina il ticket dal database usando l'ID
    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found" }); // Se non trovato, risponde con status 404 (Non trovato)
    }   
    res.status(200).json({ message: "Ticket deleted successfully" }); // Risponde con status 200 (OK) e un messaggio di successo
    } catch (error) {
    return handleRouteErrors(res, { error });
  }
};
/* Cos’è req?

req significa request → è l’oggetto che contiene tutto ciò che il client invia al server.

Dentro req trovi:

req.params → parametri nell’URL

req.body → dati nel corpo della richiesta

req.query → parametri dopo il ? dell’URL

req.headers → info come token, tipo di contenuto, ecc.
In questo caso:

tu passi req.body a Mongoose

Mongoose verifica che i campi coincidano con il tuo schema

se qualcosa manca → errore

se qualcosa è in più → Mongoose decide se ignorarlo o generare errore (a seconda delle impostazioni) 
È il pacchetto di dati grezzi spedito dal client.

Express lo mette in req.body per permetterti di lavorarci.

il “controllo modello”

Lo fanno Mongoose o un middleware di validazione (es. Zod, Yup, Joi… oppure Express Validator).*/