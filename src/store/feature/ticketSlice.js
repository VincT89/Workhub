import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fakeFetchTickets,
  fakeCreateTicket,
  fakeUpdateTicketStatus,
  fakeAddComment,
  fakeDeleteTicket,
} from "../../api/ticketApi";

// 🔹 Async thunks
export const fetchTickets = createAsyncThunk(
  "ticket/fetchTickets",
  async (token, { rejectWithValue }) => {
    try {
      return await fakeFetchTickets(token);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createTicket = createAsyncThunk(
  "ticket/createTicket",
  async (newTicket, { rejectWithValue }) => {
    try {
      return await fakeCreateTicket(newTicket);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateTicketStatus = createAsyncThunk(
  "ticket/updateTicketStatus",
  async ({ id, newStatus }, { rejectWithValue }) => {
    try {
      return await fakeUpdateTicketStatus(id, newStatus);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addTicketComment = createAsyncThunk(
  "ticket/addTicketComment",
  async ({ id, comment }, { rejectWithValue }) => {
    try {
      return await fakeAddComment(id, comment);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteTicket = createAsyncThunk(
  "ticket/deleteTicket",
  async (id, { rejectWithValue }) => {
    try {
      return await fakeDeleteTicket(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Slice
const ticketSlice = createSlice({
  name: "ticket",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createTicket.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update status
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        const i = state.list.findIndex((t) => t.id === action.payload.id);
        if (i !== -1) state.list[i] = action.payload;
      })
      // Add comment
      .addCase(addTicketComment.fulfilled, (state, action) => {
        const i = state.list.findIndex((t) => t.id === action.payload.id);
        if (i !== -1) state.list[i] = action.payload;
      })
      // Delete
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t.id !== action.meta.arg);
      });
  },
});

export default ticketSlice.reducer;
