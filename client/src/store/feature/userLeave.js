import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3030/api/v1";

/* GET USER LEAVES */
export const fetchLeaveAsync = createAsyncThunk(
  "leave/fetch",
  async (token, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/leaves`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
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
      const res = await fetch(`${API_URL}/leaves/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
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
      const res = await fetch(`${API_URL}/leaves/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
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
      const res = await fetch(
        `${API_URL}/leaves/${requestId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();
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
      const res = await fetch(`${API_URL}/leaves/init/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);

      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

const leaveSlice = createSlice({
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

export const { clearLeave } = leaveSlice.actions;
export default leaveSlice.reducer;
