/* 
SLICE dedicato ai dati e alle API.
*/

//? IMPORTO L'URL BASE del backend
import { API_URL } from "../../config/api.js";

//? Importo gli strumenti necessari da Redux Toolkit
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//? Importo il file itemsAPI le funzioni per chiamare le API per fare il fetch sul backend 
import * as api from "../../api/itemsApi.js";

//? Creo una thunk asincrona per prendere tutti gli items dal server
export const fetchItems = createAsyncThunk(
  "items/fetchAll",                         // Nome dell'azione asincrona
  async (_, { rejectWithValue }) => {       // '_' significa che non mi serve nessun parametro
    try {
      const data = await api.fetchItems();  //  fetchItems restituisce già i dati JSON
      return data;                          //  ritorno direttamente i dati al reducer
    } catch (err) {
      // Se c’è un errore, lo passo a Redux usando rejectWithValue
      return rejectWithValue(err.message);
    }
  }
);

//? Thunk per aggiornare la quantità di un item
export const updateItemQuantity = createAsyncThunk(
  "items/updateItemQuantity",
  async ({ id, quantityToAdd }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("auth"))?.token; // se usi auth
      const res = await fetch(`${API_URL}/items/${id}/quantity`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ quantityToAdd })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return rejectWithValue(errorData.error || "Errore nell'aggiornamento");
      }

      const data = await res.json();
      return data; // item aggiornato
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

//? Thunk per aggiungere un prodotto 
export const addItem = createAsyncThunk(
  "items/addItem",
  async (newItem, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
      });
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

//? Creo lo slice "items", che contiene stato, reducers e gestione azioni asincrone
const itemsSlice = createSlice({
  name: "items",  // Nome dello slice

  initialState: {    // Stato iniziale dello slice
    list: [],        // Lista vuota di items che prenderemo dal backend
    status: "idle",  // Stato iniziale della richiesta (idle = fermo)
    error: null,     // Nessun errore inizialmente
  },

  reducers: {
    // Qui andrebbero eventuali reducers normali (non asincroni)
  },

  /*
    Stati delle richieste:
    "idle" → non è ancora partita
    "loading" → sta caricando i dati
    "succeeded" → è arrivata la risposta buona
    "failed" → la richiesta è fallita
  */

  //? extraReducers serve per gestire le azioni create con createAsyncThunk
  // fetchItems è la funzione che chiama i controller API (api.fetchItems()) 
  // poi comunica a Redux i risultati della chiamata API e aggiorna lo stato (list, status, error)
  // Le azioni asincrone (pending, fulfilled, rejected) vengono gestite dagli extraReducers.
  // È proprio la parte che collega frontend --> API --> Redux.

  extraReducers: (builder) => {
    //? fetchItems
    builder
      // Quando fetchItems è in pending, cioè la richiesta sta partendo
      .addCase(fetchItems.pending, (state) => {
        state.status = "loading";   // Stato: caricamento in corso
      })

      // Quando fetchItems va a buon fine (fulfilled)
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = "succeeded";  // Stato: richiesta riuscita
        state.list = action.payload;  // Salvo direttamente i dati ricevuti
      })

      // Quando fetchItems fallisce (rejected)
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = "failed";      // Stato: richiesta fallita
        state.error = action.payload; // Salvo l’errore ricevuto
      });

    //? addItem
    builder
      // Quando addItem va a buon fine
      .addCase(addItem.fulfilled, (state, action) => {
        state.list.push(action.payload); // Aggiungo il nuovo item alla lista
      });

    //? updateItemQuantity
    builder
      // Quando updateItemQuantity sta caricando
      .addCase(updateItemQuantity.pending, (state) => {
        state.status = "loading"; // Stato: caricamento in corso
      })

      // Quando updateItemQuantity va a buon fine
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.status = "succeeded";

        // Trovo l’item aggiornato nella lista
        const index = state.list.findIndex(item => item._id === action.payload._id);

        if (index !== -1) {
          // Aggiorno solo lo stock, mantenendo tutti gli altri campi
          state.list[index] = {
            ...state.list[index],       // mantieni tutti gli altri dati
            stock: action.payload.stock // aggiorna solo lo stock
          };
        }
      })

      // Quando updateItemQuantity fallisce
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Salvo il messaggio di errore
      });
  },
});

// Esporto solo il reducer dello slice (che verrà aggiunto allo store)
export default itemsSlice.reducer;


/* 
COMMENTI ORIGINALI NON PIÙ DIRETTAMENTE APPLICABILI:
- normalizeItem e commenti sullo stato colorato
- Normalizziamo TUTTI gli item ricevuti dal backend
- aggiorna la lista locale normalizzando l'item
*/