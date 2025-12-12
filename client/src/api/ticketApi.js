import { API_URL } from "../config/api";

/**
 * ===== FILE: ticketApi.js =====
 * 
 * SCOPO: Questo file contiene tutte le funzioni per comunicare con il server
 * riguardo ai ticket. Ogni funzione esegue una chiamata HTTP (fetch) al backend.
 * 
 * IMPORTANTE: Queste funzioni NON gestiscono lo stato dell'app (quello lo fa Redux),
 * ma si limitano a fare richieste HTTP e restituire la risposta.
 * 
 * STRUTTURA DI RITORNO: Ogni funzione ritorna un oggetto { response, data }
 * - response: l'oggetto Response di fetch (contiene status code, headers, ecc.)
 * - data: il JSON ricevuto dal server (i dati effettivi)
 */

/* 
 * FUNZIONE: fetchTicketsRequest
 * 
 * COSA FA: Recupera tutti i ticket dal server
 * 
 * PARAMETRI:
 * - token: il token JWT dell'utente autenticato (necessario per autenticarsi)
 * 
 * COME FUNZIONA:
 * 1. Fa una richiesta GET a /api/v1/ticketing
 * 2. Invia il token nell'header Authorization per provare che siamo autenticati
 * 3. Riceve la risposta JSON dal server
 * 4. Ritorna sia la risposta che i dati
 */
export const fetchTicketsRequest = async (token) => {
  const response = await fetch(`${API_URL}/ticketing`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  return { response, data };
};

/* 
 * FUNZIONE: fetchTicketByIdRequest
 * 
 * COSA FA: Recupera UN SINGOLO ticket specifico dal server
 * 
 * PARAMETRI:
 * - id: l'ID univoco del ticket che vogliamo recuperare
 * - token: il token JWT per l'autenticazione
 * 
 * ESEMPIO D'USO:
 * const { response, data } = await fetchTicketByIdRequest({ id: "123abc", token: "jwt..." });
 */
export const fetchTicketByIdRequest = async ({ id, token }) => {
  const response = await fetch(`${API_URL}/ticketing/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  return { response, data };
};

/* 
 * FUNZIONE: createTicketRequest
 * 
 * COSA FA: Crea un nuovo ticket sul server
 * 
 * PARAMETRI:
 * - payload: un oggetto con i dati del nuovo ticket (es: { user, name, content, status })
 * - token: il token JWT per l'autenticazione
 * 
 * COME FUNZIONA:
 * 1. Fa una richiesta POST (per creare nuovi dati)
 * 2. Converte il payload in JSON con JSON.stringify()
 * 3. Invia tutto al server
 * 4. Il server risponde con il ticket appena creato
 */
export const createTicketRequest = async ({ payload, token }) => {
  const response = await fetch(`${API_URL}/ticketing`, {
    method: "POST", // POST = creare nuovi dati
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return { response, data };
};

/* 
 * FUNZIONE: updateTicketRequest
 * 
 * COSA FA: Aggiorna un ticket esistente sul server
 * 
 * PARAMETRI:
 * - id: l'ID del ticket da modificare
 * - payload: un oggetto con i nuovi dati (es: { status: "closed" })
 * - token: il token JWT per l'autenticazione
 * 
 * ESEMPIO: Per segnare un ticket come risolto:
 * updateTicketRequest({ id: "123", payload: { status: "closed" }, token: "jwt..." })
 */
export const updateTicketRequest = async ({ id, payload, token }) => {
  const response = await fetch(`${API_URL}/ticketing/${id}`, {
    method: "PUT", // PUT = aggiornare dati esistenti
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return { response, data };
};

/* 
 * FUNZIONE: deleteTicketRequest
 * 
 * COSA FA: Elimina un ticket dal server
 * 
 * PARAMETRI:
 * - id: l'ID del ticket da eliminare
 * - token: il token JWT per l'autenticazione
 * 
 * ATTENZIONE: Questa operazione è irreversibile!
 */
export const deleteTicketRequest = async ({ id, token }) => {
  const response = await fetch(`${API_URL}/ticketing/${id}`, {
    method: "DELETE", // DELETE = eliminare dati
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  return { response, data };
};