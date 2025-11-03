import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fakeFetchClients,
  fakeAddClient,
  fakeUpdateClient,
  fakeDeleteClient,
} from "../../api/clientiApi";

// 🔹 Fetch all clients
export const fetchClients = createAsyncThunk(
  "clienti/fetchAll",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fakeFetchClients(token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Add new client
export const addClient = createAsyncThunk(
  "clienti/add",
  async ({ token, newClient }, { rejectWithValue }) => {
    try {
      const response = await fakeAddClient(token, newClient);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Update existing client
export const updateClient = createAsyncThunk(
  "clienti/update",
  async ({ token, id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await fakeUpdateClient(token, id, updatedData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🔹 Delete client
export const deleteClient = createAsyncThunk(
  "clienti/delete",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await fakeDeleteClient(token, id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const clientiSlice = createSlice({
  name: "clienti",
  initialState: {
    lista: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.lista = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addClient.fulfilled, (state, action) => {
        state.lista.push(action.payload);
      })
      .addCase(addClient.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.lista.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.lista = state.lista.filter((c) => c.id !== action.payload.id);
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default clientiSlice.reducer;
