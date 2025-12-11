import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createOrderRequest,
  fetchOrdersRequest,
  fetchOrderByIdRequest,
  updateOrderRequest,
  deleteOrderRequest,
} from "../../api/ordersApi";

/* CREATE */
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async ({ orderData, token }, { rejectWithValue }) => {
    try {
      const { res, data } = await createOrderRequest({ orderData, token });
      if (!res.ok)  throw new Error(data?.error || "Errore nella creazione ordine");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* FETCH ALL */
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { res, data } = await fetchOrdersRequest({ token });
      if (!res.ok) throw new Error(data?.error || "Errore nel recupero ordini");

      // formatResponse può restituire sia {data: [...]} che array diretto
      return data?.data || data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* FETCH ONE */
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const { res, data } = await fetchOrderByIdRequest({id, token});
      if (!res.ok) throw new Error(data?.error || "Ordine non trovato");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* UPDATE */
export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ id, data, token }, { rejectWithValue }) => {
    try {
      const { res, data: updated } = await updateOrderRequest({ id, data, token });
      if (!res.ok) throw new Error(updated?.error || "Errore nell’aggiornamento ordine");
      return updated;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* DELETE */
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const { res } = await deleteOrderRequest({ id, token });
      if (!res.ok) throw new Error("Errore nell’eliminazione ordine");
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    selectedOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH ALL */
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH ONE */
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((o) => o._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
