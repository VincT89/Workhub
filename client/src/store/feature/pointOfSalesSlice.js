import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchPointsOfSalesRequest,
  createPointOfSaleRequest,
  updatePointOfSaleRequest,
  deletePointOfSaleRequest,
} from "../../api/pointsApi";

// === FETCH ALL POS ===
export const fetchPointsOfSalesAsync = createAsyncThunk(
  "points/fetchAll",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { res, data } = await fetchPointsOfSalesRequest({ token });

      if (!res.ok) return rejectWithValue(data.message);
      return data.data; // array POS
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

// === CREATE POS ===
export const createPointOfSaleAsync = createAsyncThunk(
  "points/create",
  async ({ newPos, token }, { rejectWithValue }) => {
    try {
      const { res, data } = await createPointOfSaleRequest({ newPos, token });

      if (!res.ok) return rejectWithValue(data.message);
      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

// === UPDATE POS ===
export const updatePointOfSaleAsync = createAsyncThunk(
  "points/update",
  async ({ id, updates, token }, { rejectWithValue }) => {
    try {
      const { res, data } = await updatePointOfSaleRequest({
        id,
        updates,
        token,
      });

      if (!res.ok) return rejectWithValue(data.message);
      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

// === DELETE POS ===
export const deletePointOfSaleAsync = createAsyncThunk(
  "points/delete",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const { res, data } = await deletePointOfSaleRequest({ id, token });

      if (!res.ok) return rejectWithValue(data.message);
      return id;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

const pointOfSalesSlice = createSlice({
  name: "points",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /** FETCH ALL **/
      .addCase(fetchPointsOfSalesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPointsOfSalesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPointsOfSalesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /** CREATE **/
      .addCase(createPointOfSaleAsync.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      /** UPDATE **/
      .addCase(updatePointOfSaleAsync.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (pos) => pos._id === action.payload._id
        );
        if (index !== -1) state.list[index] = action.payload;
      })

      /** DELETE **/
      .addCase(deletePointOfSaleAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((pos) => pos._id !== action.payload);
      });
  },
});

export default pointOfSalesSlice.reducer;
