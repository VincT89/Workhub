import express from 'express';
import { listEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/events.js';

import { authUser } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roles.js';

const app = express.Router();

/**
 * GET /api/v1/events
 * Tutti gli utenti AUTENTICATI possono leggere gli eventi
 * */
app.get('/', authUser, listEvents);

/**
 * GET /api/v1/events/:id
 */
app.get('/:id', authUser, getEventById);

/**
 * POST /api/v1/events
 * Solo ADMIN può creare eventi
 */
app.post('/', authUser, requireAdmin, createEvent);

/**
 * PATCH /api/v1/events/:id
 * Solo ADMIN può aggiornare eventi
 */
app.patch('/:id', authUser, requireAdmin, updateEvent);

/**
 * DELETE /api/v1/events/:id
 * Solo ADMIN può eliminare eventi
 */
app.delete('/:id', authUser, requireAdmin, deleteEvent);

export default app;