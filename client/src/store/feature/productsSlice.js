import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchProductsRequest,
  fetchProductByIdRequest,
} from "../../api/productApi";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (token, { rejectWithValue }) => {
    try {
      const { res, data } = await fetchProductsRequest(token);

      if (!res.ok)
        return rejectWithValue(data.message || "Errore nel recupero prodotti");

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const { res, data } = await fetchProductByIdRequest(id, token);

      if (!res.ok)
        return rejectWithValue(data.message || "Errore nel recupero prodotto");

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LIST
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BY ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productsSlice.reducer;
