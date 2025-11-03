import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fakeFetchMagazzino,
  fakeAddProdotto,
  fakeUpdateProdotto,
  fakeDeleteProdotto,
  fakeOrdinaDaAltroDeposito,
} from "../../api/magazzinoApi";

// 🔹 Thunk: ottieni magazzino
export const fetchMagazzino = createAsyncThunk(
  "magazzino/fetchAll",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fakeFetchMagazzino(token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Aggiungi prodotto
export const addProdotto = createAsyncThunk(
  "magazzino/addProdotto",
  async ({ token, depositoId, nuovoProdotto }, { rejectWithValue }) => {
    try {
      const response = await fakeAddProdotto(token, depositoId, nuovoProdotto);
      return { depositoId, prodotto: response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Aggiorna prodotto
export const updateProdotto = createAsyncThunk(
  "magazzino/updateProdotto",
  async ({ token, depositoId, prodottoId, dataAggiornata }, { rejectWithValue }) => {
    try {
      const response = await fakeUpdateProdotto(token, depositoId, prodottoId, dataAggiornata);
      return { depositoId, prodotto: response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Elimina prodotto
export const deleteProdotto = createAsyncThunk(
  "magazzino/deleteProdotto",
  async ({ token, depositoId, prodottoId }, { rejectWithValue }) => {
    try {
      const response = await fakeDeleteProdotto(token, depositoId, prodottoId);
      return { depositoId, prodottoId: response.id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Ordina da altro deposito
export const ordinaDaAltroDeposito = createAsyncThunk(
  "magazzino/ordinaDaAltroDeposito",
  async ({ token, sorgenteId, destinazioneId, prodottoId, quantita }, { rejectWithValue }) => {
    try {
      const response = await fakeOrdinaDaAltroDeposito(
        token,
        sorgenteId,
        destinazioneId,
        prodottoId,
        quantita
      );
      return response.messaggio;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const magazzinoSlice = createSlice({
  name: "magazzino",
  initialState: {
    depositi: [],
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
      // Fetch
      .addCase(fetchMagazzino.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMagazzino.fulfilled, (state, action) => {
        state.loading = false;
        state.depositi = action.payload;
      })
      .addCase(fetchMagazzino.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Aggiungi prodotto
      .addCase(addProdotto.fulfilled, (state, action) => {
        const deposito = state.depositi.find((d) => d.depositoId === action.payload.depositoId);
        if (deposito) deposito.prodotti.push(action.payload.prodotto);
      })

      // Aggiorna prodotto
      .addCase(updateProdotto.fulfilled, (state, action) => {
        const deposito = state.depositi.find((d) => d.depositoId === action.payload.depositoId);
        if (!deposito) return;
        const index = deposito.prodotti.findIndex((p) => p.id === action.payload.prodotto.id);
        if (index !== -1) deposito.prodotti[index] = action.payload.prodotto;
      })

      // Elimina prodotto
      .addCase(deleteProdotto.fulfilled, (state, action) => {
        const deposito = state.depositi.find((d) => d.depositoId === action.payload.depositoId);
        if (deposito)
          deposito.prodotti = deposito.prodotti.filter(
            (p) => p.id !== action.payload.prodottoId
          );
      })

      // Ordina da altro deposito
      .addCase(ordinaDaAltroDeposito.fulfilled, (state, action) => {
        state.messaggio = action.payload;
      });
  },
});

export const { clearMessaggio } = magazzinoSlice.actions;
export default magazzinoSlice.reducer;
