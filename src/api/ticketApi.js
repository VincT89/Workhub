import { ticket } from "./mock/ticketMock.js";

let ticketData = [...ticket]; // Copia mutabile dei dati mock

// GET: Recupera tutti i ticket
export const fakeFetchTickets = async (token) => {
  await new Promise((res) => setTimeout(res, 400));
  if (!token?.startsWith("FAKE_JWT_")) throw new Error("Token non valido");
  return ticketData;
};

// POST: Crea un nuovo ticket
export const fakeCreateTicket = async (newTicket) => {
  await new Promise((res) => setTimeout(res, 300));
  const ticketObj = {
    id: ticketData.length + 1,
    stato: "Aperto",
    dataCreazione: new Date().toISOString().split("T")[0],
    commenti: [],
    ...newTicket,
  };
  ticketData.push(ticketObj);
  return ticketObj;
};

// PATCH: Aggiorna lo stato di un ticket
export const fakeUpdateTicketStatus = async (id, newStatus) => {
  await new Promise((res) => setTimeout(res, 300));
  const t = ticketData.find((tk) => tk.id === id);
  if (!t) throw new Error("Ticket non trovato");
  t.stato = newStatus;
  return t;
};

// PATCH: Aggiunge un commento a un ticket
export const fakeAddComment = async (id, comment) => {
  await new Promise((res) => setTimeout(res, 300));
  const t = ticketData.find((tk) => tk.id === id);
  if (!t) throw new Error("Ticket non trovato");
  t.commenti.push({
    ...comment,
    data: new Date().toISOString().split("T")[0],
  });
  return t;
};

// DELETE: Elimina ticket
export const fakeDeleteTicket = async (id) => {
  await new Promise((res) => setTimeout(res, 300));
  ticketData = ticketData.filter((tk) => tk.id !== id);
  return { success: true };
};
