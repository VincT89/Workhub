import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchLeaveRequest,
  fetchLeaveByUserIdRequest,
  createLeaveRequestRequest,
  updateLeaveStatusRequest,
  initLeaveRecordRequest,
} from "../../api/leaveApi";

/* GET USER LEAVES */
export const fetchLeaveAsync = createAsyncThunk(
  "leave/fetch",
  async (token, { rejectWithValue }) => {
    try {
      const { res, data } = await fetchLeaveRequest(token);

      if (!res.ok) return rejectWithValue(data.message);

      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

/* GET USER LEAVES BY USER ID (ADMIN) */
export const fetchLeaveByUserIdAsync = createAsyncThunk(
  "leave/fetchByUserId",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const { res, data } = await fetchLeaveByUserIdRequest({
        userId,
        token,
      });

      if (!res.ok) return rejectWithValue(data.message);

      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

/* CREATE REQUEST */
export const createLeaveRequestAsync = createAsyncThunk(
  "leave/createRequest",
  async ({ payload, token }, { rejectWithValue }) => {
    try {
      const { res, data } = await createLeaveRequestRequest({
        payload,
        token,
      });

      if (!res.ok) return rejectWithValue(data.message);

      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

/* UPDATE STATUS (admin) */
export const updateLeaveStatusAsync = createAsyncThunk(
  "leave/updateStatus",
  async ({ requestId, status, token }, { rejectWithValue }) => {
    try {
      const { res, data } = await updateLeaveStatusRequest({
        requestId,
        status,
        token,
      });

      if (!res.ok) return rejectWithValue(data.message);

      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

/* INIT USERLEAVE PER ADMIN */
export const initLeaveRecordAsync = createAsyncThunk(
  "leave/initRecord",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const { res, data } = await initLeaveRecordRequest({
        userId,
        token,
      });

      if (!res.ok) return rejectWithValue(data.message);

      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

const userLeaveSlice = createSlice({
  name: "leave",
  initialState: {
    record: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearLeave(state) {
      state.record = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchLeaveAsync.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchLeaveAsync.fulfilled, (s, action) => {
        s.loading = false;
        s.record = action.payload;
      })
      .addCase(fetchLeaveAsync.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload;
      })

      .addCase(fetchLeaveByUserIdAsync.fulfilled, (s, action) => {
        s.record = action.payload;
      })

      /* CREATE REQUEST */
      .addCase(createLeaveRequestAsync.fulfilled, (s, action) => {
        s.record = action.payload;
      })

      /* UPDATE STATUS */
      .addCase(updateLeaveStatusAsync.fulfilled, (s, action) => {
        s.record = action.payload;
      })

      /* INIT */
      .addCase(initLeaveRecordAsync.fulfilled, (s, action) => {
        s.record = action.payload;
      });
  },
});

export const { clearLeave } = userLeaveSlice.actions;
export default userLeaveSlice.reducer;
