import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fakeFetchPersonale,
  fakeAddPersonale,
  fakeUpdatePersonale,
  fakeDeletePersonale,
  fakeRichiediFerie,
  fakeApprovaFerie,
} from "../../api/personaleApi";

// 🔹 Fetch completo personale
export const fetchPersonale = createAsyncThunk(
  "personale/fetchAll",
  async (token, { rejectWithValue }) => {
    try {
      return await fakeFetchPersonale(token);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Aggiungi dipendente
export const addPersonale = createAsyncThunk(
  "personale/add",
  async ({ token, nuovo }, { rejectWithValue }) => {
    try {
      return await fakeAddPersonale(token, nuovo);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Aggiorna dipendente
export const updatePersonale = createAsyncThunk(
  "personale/update",
  async ({ token, id, aggiornato }, { rejectWithValue }) => {
    try {
      return await fakeUpdatePersonale(token, id, aggiornato);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Elimina dipendente
export const deletePersonale = createAsyncThunk(
  "personale/delete",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      return await fakeDeletePersonale(token, id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Richiesta ferie
export const richiediFerie = createAsyncThunk(
  "personale/richiediFerie",
  async ({ token, id, giorni }, { rejectWithValue }) => {
    try {
      return await fakeRichiediFerie(token, id, giorni);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Approva ferie
export const approvaFerie = createAsyncThunk(
  "personale/approvaFerie",
  async ({ token, id, giorni, approvata }, { rejectWithValue }) => {
    try {
      return await fakeApprovaFerie(token, id, giorni, approvata);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const personaleSlice = createSlice({
  name: "personale",
  initialState: {
    lista: [],
    loading: false,
    error: null,
    messaggio: null,
  },
  reducers: {
    clearMessaggio: (state) => {
      state.messaggio = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersonale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonale.fulfilled, (state, action) => {
        state.loading = false;
        state.lista = action.payload;
      })
      .addCase(fetchPersonale.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addPersonale.fulfilled, (state, action) => {
        state.lista.push(action.payload);
      })

      // Update
      .addCase(updatePersonale.fulfilled, (state, action) => {
        const index = state.lista.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.lista[index] = action.payload;
      })

      // Delete
      .addCase(deletePersonale.fulfilled, (state, action) => {
        state.lista = state.lista.filter((p) => p.id !== action.payload.id);
      })

      // Richiesta ferie
      .addCase(richiediFerie.fulfilled, (state, action) => {
        const index = state.lista.findIndex((p) => p.id === action.payload.user.id);
        if (index !== -1) state.lista[index] = action.payload.user;
        state.messaggio = action.payload.messaggio;
      })

      // Approva ferie
      .addCase(approvaFerie.fulfilled, (state, action) => {
        const index = state.lista.findIndex((p) => p.id === action.payload.user.id);
        if (index !== -1) state.lista[index] = action.payload.user;
        state.messaggio = action.payload.messaggio;
      });
  },
});

export const { clearMessaggio } = personaleSlice.actions;
export default personaleSlice.reducer;
