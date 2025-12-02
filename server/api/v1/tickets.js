import express from 'express';
import { addDays, subDays, formatISO } from 'date-fns';

const router = express.Router();

// GET /api/v1/tickets/year
// Returns an array of fake tickets distributed over the last 365 days
router.get('/year', (req, res) => {
  const days = 365;
  const today = new Date();
  const users = Array.from({ length: 12 }).map((_, i) => ({
    id: String(i + 1),
    nome: `User${i + 1}`,
    cognome: `Test${i + 1}`,
    ruolo: 'Dipendente',
    email: `user${i + 1}@example.com`,
    avatar: `https://i.pravatar.cc/150?img=${i + 10}`
  }));

  let idCounter = 1;
  const tickets = [];

  for (let d = days - 1; d >= 0; d--) {
    const date = subDays(today, d);
    // generate 0..3 tickets per day (random distribution)
    const count = Math.floor(Math.random() * 4);

    for (let i = 0; i < count; i++) {
      const user = users[(idCounter + i) % users.length];
      tickets.push({
        id: String(idCounter++),
        title: `Ticket ${idCounter}`,
        description: `Descrizione del ticket generato automaticamente #${idCounter}`,
        user,
        date: formatISO(addDays(date, 0))
      });
    }
  }

  res.json({ total: tickets.length, tickets });
});

export default router;
