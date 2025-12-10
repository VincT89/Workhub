import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3030/api/v1"; // URL backend

/* GET ALL CUSTOMERS */
export const fetchCustomersAsync = createAsyncThunk( //createAsyncThunk() è una funzione di redux toolkit che crea automaticamente le tre azioni di pending e poi di fullfilled o rejected
  "customers/fetchAll", //identifico l'azione, per convenzione feature/action
  async (token, { rejectWithValue }) => { // token -> JWT che si ottiene dopo il login e serve per autenticarci
    // rejectWithValue() è una funzione di redux toolkit che ci perfette di restituire un errore personalizzato. quindi possiamo restituire messaggi di errore specifici invece che generici
    try {
      const response = await fetch(`${API_URL}/customers`, {
        headers: { Authorization: `Bearer ${token}` }, // bearer -> schema di autenticazione standard per HTTP. indica che stiamo usando un token bearer 
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);

      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

/* GET CUSTOMER BY ID */
export const fetchCustomerByIdAsync = createAsyncThunk(
  "customers/fetchById",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);

      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

/* CREATE CUSTOMER */
export const createCustomerAsync = createAsyncThunk(
  "customers/create",
  async ({ newCustomer, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/customers`, {
        method: "POST", //non essendo chiamata GET, ma POST, specifico il method
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCustomer),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);

      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

/* UPDATE CUSTOMER */
export const updateCustomerAsync = createAsyncThunk(
  "customers/update",
  async ({ id, updates, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);

      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

/* DELETE CUSTOMER */
export const deleteCustomerAsync = createAsyncThunk(
  "customers/delete",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);

      return id;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

const customerSlice = createSlice({
  name: "customers",

  initialState: {
    list: [], //array vuoto per tutti i customers
    selected: null, // customer selezionato per la pagina di dettaglio, inizialmente null perchè nessun customer è selezionato
    loading: false, // caricamento dei dati, diventa true quando inizia la chiamata API
    error: null, // errore null se non ce ne sono, o contiene una stringa se ci sono errori
  },

  reducers: { //sono funzioni che gestiscono azioni sincrone (non chiamano API, gestiscono azioni create da me)
    clearSelected(state) { //usiamo questo reducer per uscire dalla pagina del dettaglio del customer
      state.selected = null;
    },
    clearError(state) { // usiamo questo reducer per nascondere un messaggio di errore
      state.error = null;
    },
  },

  extraReducers: (builder) => { // extraReducers -> sono funzioni che gestiscono azioni asincrone (gestiscono azioni create da createAsyncThunk())
    // builder -> è l'oggetto che ci permette di costruire gli extraReducers
    builder
      /* CREATE */
      .addCase(createCustomerAsync.pending, (state) => { // addCase() aggiunge un case (o caso) per gestire una sepcifica azione
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createCustomerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* READ ALL */
      .addCase(fetchCustomersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCustomersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* READ ONE */
      .addCase(fetchCustomerByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchCustomerByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateCustomerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomerAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Aggiorna nella lista
        const index = state.list.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        // Aggiorna il selected se è lo stesso customer
        if (state.selected?._id === action.payload._id) {
          state.selected = action.payload;
        }
      })
      .addCase(updateCustomerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteCustomerAsync.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c._id !== action.payload);
        if (state.selected?._id === action.payload) {
          state.selected = null;
        }
      });
  },
});

export const { clearSelected, clearError } = customerSlice.actions;
export default customerSlice.reducer;