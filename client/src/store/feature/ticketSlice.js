import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as ticketApi from "../../api/ticketApi";

/**
 * ===== FILE: ticketSlice.js =====
 * 
 * SCOPO: Questo file gestisce lo STATO GLOBALE dei ticket nell'applicazione usando Redux.
 * 
 * COSA SIGNIFICA "STATO GLOBALE"?
 * È come un database in memoria che può essere letto da qualsiasi componente React.
 * Quando lo stato cambia qui, tutti i componenti che lo usano si aggiornano automaticamente.
 * 
 * STRUTTURA:
 * 1. initialState: lo stato iniziale quando l'app parte
 * 2. Helper functions: funzioni di utilità (getToken, extractError, ecc.)
 * 3. Thunks: funzioni asincrone che chiamano le API
 * 4. Slice: definisce come lo stato cambia in base alle azioni
 * 5. Selectors: funzioni per leggere facilmente lo stato
 */

// STATO INIZIALE: Questo è lo stato quando l'app parte per la prima volta
const initialState = {
  users: [],      // Array di utenti estratti dai ticket
  tickets: [],    // Array di tutti i ticket
  status: "idle", // Può essere: "idle", "loading", "succeeded", "failed"
  error: null,    // Messaggio di errore se qualcosa va male
};

/**
 * FUNZIONE HELPER: extractError
 * 
 * SCOPO: Estrae un messaggio di errore leggibile da vari formati possibili
 * (gli errori possono arrivare come stringa, oggetto, ecc.)
 */
const extractError = (err) => {
  if (typeof err === 'string') return err;
  return err?.message || "Operazione fallita";
};

/**
 * FUNZIONE HELPER: getToken
 * 
 * SCOPO: Recupera il token JWT dal localStorage
 * 
 * COME FUNZIONA:
 * 1. Legge la stringa JSON salvata in localStorage con chiave "auth"
 * 2. Fa il parsing (conversione da stringa a oggetto JavaScript)
 * 3. Estrae il token
 * 4. Se qualcosa va male, ritorna null
 * 
 * NOTA: Il token viene salvato nel localStorage quando l'utente fa login
 */
const getToken = () => {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || null;
  } catch {
    return null;
  }
};

/**
 * FUNZIONE HELPER: deriveUsersFromTickets
 * 
 * SCOPO: Estrae una lista di utenti unici dai ticket
 * 
 * COME FUNZIONA:
 * 1. Prende l'array di ticket
 * 2. Estrae l'utente da ogni ticket
 * 3. Usa una Map per tenere solo utenti unici (senza duplicati)
 * 4. Filtra eventuali valori null/undefined
 * 
 * PERCHÉ È UTILE: Così possiamo mostrare una lista di utenti per i filtri
 */
const deriveUsersFromTickets = (tickets) =>
  Array.from(
    new Map(tickets.map((t) => [t.user?._id || t.user?.id, t.user])).values()
  ).filter(Boolean);

/**
 * THUNK: fetchTickets
 * 
 * COSA SONO I THUNK?
 * Sono funzioni speciali di Redux che possono fare operazioni asincrone
 * (come chiamate al server) prima di aggiornare lo stato.
 * 
 * QUESTA THUNK:
 * 1. Prende il token dal localStorage
 * 2. Chiama l'API per ottenere tutti i ticket
 * 3. Se tutto va bene, ritorna i dati (che andranno nello stato)
 * 4. Se qualcosa va male, ritorna un errore
 * 
 * QUANDO SI USA: Ogni volta che vogliamo caricare/aggiornare la lista di ticket
 * Esempio: useEffect(() => { dispatch(fetchTickets()); }, []);
 */
export const fetchTickets = createAsyncThunk(
  "tickets/fetch", // Nome univoco dell'azione
  async (_, { rejectWithValue }) => {
    try {
      // 1. Ottieni il token di autenticazione
      const token = getToken();
      if (!token) return rejectWithValue("Token non trovato");

      // 2. Chiama l'API
      const { response, data } = await ticketApi.fetchTicketsRequest(token);
      
      // 3. Controlla se la risposta è ok (status 200-299)
      if (!response.ok) return rejectWithValue(data?.error || "Errore nel fetch");
      
      // 4. Ritorna i dati che andranno nello stato Redux
      return data;
    } catch (err) {
      // 5. Se c'è un errore (rete, parsing, ecc.), gestiscilo
      return rejectWithValue(extractError(err));
    }
  }
);

/**
 * THUNK: createTicketAsync
 * 
 * COSA FA: Crea un nuovo ticket sul server e lo aggiunge allo stato Redux
 * 
 * PARAMETRI:
 * - payload: oggetto con i dati del ticket (es: { user, name, content, status })
 * 
 * FLUSSO:
 * 1. Ottieni token
 * 2. Chiama API per creare ticket
 * 3. Se OK, il nuovo ticket viene aggiunto automaticamente all'array dei ticket
 * 4. Se fallisce, ritorna errore dettagliato per mostrarlo all'utente
 */
export const createTicketAsync = createAsyncThunk(
  "tickets/create",
  async (payload, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Token non trovato");

      const { response, data } = await ticketApi.createTicketRequest({ payload, token });
      
      // Se il server risponde con errore, ritorna dettagli per debug
      if (!response.ok) return rejectWithValue({ 
        message: data?.error || "Errore nella creazione", 
        details: data?.details || data 
      });
      
      return data; // Il ticket appena creato
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

/**
 * THUNK: updateTicketAsync
 * 
 * COSA FA: Aggiorna un ticket esistente (es: cambia lo status da "open" a "closed")
 * 
 * PARAMETRI:
 * - id: l'ID del ticket da modificare
 * - payload: oggetto con i campi da aggiornare (es: { status: "closed" })
 * 
 * ESEMPIO D'USO:
 * dispatch(updateTicketAsync({ id: "123", payload: { status: "closed" } }))
 */
export const updateTicketAsync = createAsyncThunk(
  "tickets/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Token non trovato");

      const { response, data } = await ticketApi.updateTicketRequest({ id, payload, token });
      if (!response.ok) return rejectWithValue({ 
        message: data?.error || "Errore nell'aggiornamento", 
        details: data?.details || data 
      });
      return data; // Il ticket aggiornato
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

export const deleteTicketAsync = createAsyncThunk(
  "tickets/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue("Token non trovato");

      const { response, data } = await ticketApi.deleteTicketRequest({ id, token });
      if (!response.ok) return rejectWithValue({ message: data?.error || "Errore nell'eliminazione", details: data?.details || data });
      return { id };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  }
);

/**
 * SLICE: ticketSlice
 * 
 * COSA SONO GLI SLICE?
 * Sono le "fette" dello stato Redux. Definiscono:
 * 1. Come lo stato cambia in risposta alle azioni
 * 2. Quali sono le azioni disponibili
 * 
 * EXTRAREDUCERS:
 * Gestiscono le azioni asincrone (thunk). Ogni thunk ha 3 stati:
 * - pending: operazione in corso (mostriamo un loading)
 * - fulfilled: operazione riuscita (aggiorniamo lo stato con i nuovi dati)
 * - rejected: operazione fallita (mostriamo un errore)
 */
const ticketSlice = createSlice({
  name: "tickets", // Nome dello slice (usato per le azioni)
  initialState,
  reducers: {}, // Reducers sincroni (qui non ne abbiamo)
  extraReducers: (builder) => {
    builder
      // ===== FETCH TICKETS (Caricamento lista) =====
      
      // PENDING: Stiamo caricando i ticket
      .addCase(fetchTickets.pending, (state) => {
        state.status = "loading"; // Mostriamo spinner di caricamento
        state.error = null;       // Reset errori precedenti
      })
      
      // FULFILLED: Abbiamo ricevuto i ticket dal server
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tickets = action.payload || [];  // Salva i ticket nello stato
        state.users = deriveUsersFromTickets(action.payload || []); // Estrai utenti
      })
      
      // REJECTED: Errore nel caricamento
      .addCase(fetchTickets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message; // Salva messaggio errore
      })

      // ===== CREATE TICKET (Creazione nuovo ticket) =====
      
      .addCase(createTicketAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      
      // Quando il ticket è stato creato con successo
      .addCase(createTicketAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        // unshift() aggiunge il nuovo ticket all'INIZIO dell'array
        // (così appare in cima alla lista)
        state.tickets.unshift(action.payload);
      })
      
      .addCase(createTicketAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // ===== UPDATE TICKET (Aggiornamento ticket esistente) =====
      
      .addCase(updateTicketAsync.pending, (state) => {
        state.error = null;
      })
      
      // Quando il ticket è stato aggiornato con successo
      .addCase(updateTicketAsync.fulfilled, (state, action) => {
        // 1. Trova l'indice del ticket da aggiornare nell'array
        const idx = state.tickets.findIndex(
          (t) => (t._id || t.id) === (action.payload._id || action.payload.id)
        );
        // 2. Se lo trova, sostituiscilo con la versione aggiornata
        if (idx !== -1) state.tickets[idx] = action.payload;
      })
      
      .addCase(updateTicketAsync.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // delete
      .addCase(deleteTicketAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTicketAsync.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter((t) => (t._id || t.id) !== action.payload.id);
      })
      .addCase(deleteTicketAsync.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

/**
 * SELECTORS
 * 
 * COSA SONO?
 * Sono funzioni helper che ci permettono di leggere pezzi specifici dello stato.
 * 
 * PERCHÉ USARLI?
 * Invece di scrivere ogni volta: useSelector(state => state.tickets.tickets)
 * Possiamo scrivere: useSelector(selectTickets)
 * 
 * VANTAGGI:
 * 1. Codice più pulito e leggibile
 * 2. Se cambiamo la struttura dello stato, modifichiamo solo qui
 * 3. Possiamo aggiungere logica (filtri, trasformazioni) se serve
 */

// Ottiene l'array di tutti i ticket
export const selectTickets = (state) => state.tickets.tickets;

// Ottiene l'array di utenti (estratti dai ticket)
export const selectUsers = (state) => state.tickets.users;

// Ottiene lo stato del caricamento ("idle", "loading", "succeeded", "failed")
export const selectTicketStatus = (state) => state.tickets.status;

// Ottiene il messaggio di errore (se presente)
export const selectTicketError = (state) => state.tickets.error;

// Esporta il reducer (Redux lo usa internamente)
export default ticketSlice.reducer;