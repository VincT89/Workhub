import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchAllShiftsRequest,
  fetchUserShiftsRequest,
  updateShiftRequest,
  deleteShiftRequest,
} from "../../api/shiftsApi";

/* ------------------- GET ALL ------------------- */
export const fetchAllShiftsAsync = createAsyncThunk(
  "shifts/fetchAll",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { res, data } = await fetchAllShiftsRequest({ token });

      if (!res.ok) return rejectWithValue(data.message);

      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

/* ------------------- GET BY USER ------------------- */
export const fetchUserShiftsAsync = createAsyncThunk(
  "shifts/fetchByUser",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const { res, data } = await fetchUserShiftsRequest({ userId, token });

      if (!res.ok) return rejectWithValue(data.message);

      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

/* ------------------- UPDATE SINGLE DAY/PERIOD ------------------- */
export const updateShiftAsync = createAsyncThunk(
  "shifts/update",
  async ({ id, day, period, value, token }, { rejectWithValue }) => {
    try {
      const { res, data } = await updateShiftRequest({
        id,
        day,
        period,
        value,
        token,
      });

      if (!res.ok) return rejectWithValue(data.message);

      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

/* ------------------- DELETE SHIFT DOC ------------------- */
export const deleteShiftAsync = createAsyncThunk(
  "shifts/delete",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const { res, data } = await deleteShiftRequest({ id, token });

      if (!res.ok) return rejectWithValue(data.message);

      return id;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

/* ------------------- SLICE ------------------- */
const shiftsSlice = createSlice({
  name: "shifts",
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllShiftsAsync.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchAllShiftsAsync.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchAllShiftsAsync.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(fetchUserShiftsAsync.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUserShiftsAsync.fulfilled, (s, a) => {
        s.loading = false;
        s.current = a.payload;
      })
      .addCase(fetchUserShiftsAsync.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(updateShiftAsync.fulfilled, (s, a) => {
        s.current = a.payload;
      })

      .addCase(deleteShiftAsync.fulfilled, (s, a) => {
        s.list = s.list.filter((x) => x._id !== a.payload);
        if (s.current?._id === a.payload) s.current = null;
      });
  },
});

export default shiftsSlice.reducer;
