import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch fake tickets + users (same as before in component)
export const fetchFakeTickets = createAsyncThunk(
  "tickets/fetchFake",
  async (_, { rejectWithValue }) => {
    try {
      const usersRes = await fetch("https://jsonplaceholder.typicode.com/users");
      const usersData = await usersRes.json();

      const ticketsRes = await fetch("https://jsonplaceholder.typicode.com/posts");
      const posts = await ticketsRes.json();

      const formattedUsers = usersData.map((u, i) => ({
        id: u.id.toString(),
        nome: u.name.split(" ")[0],
        cognome: u.name.split(" ")[1] || "",
        ruolo: "Dipendente",
        email: u.email,
        avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
      }));

      const formattedTickets = posts.slice(0, 20).map((p, i) => ({
        id: p.id.toString(),
        title: p.title,
        description: p.body,
        user: formattedUsers[i % formattedUsers.length],
        date: new Date(Date.now() - Math.random() * 10 * 86400000).toISOString(),
      }));

      return { users: formattedUsers, tickets: formattedTickets };
    } catch (err) {
      return rejectWithValue(err.message || "Fetch error");
    }
  }
);

const initialState = {
  users: [],
  tickets: [],
  status: "idle",
  error: null,
};

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    // optional local reducers (e.g., add/remove) can be added here
    setTickets(state, action) {
      state.tickets = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFakeTickets.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFakeTickets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.users;
        state.tickets = action.payload.tickets;
      })
      .addCase(fetchFakeTickets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setTickets } = ticketSlice.actions;

export const selectTickets = (state) => state.tickets.tickets;
export const selectUsers = (state) => state.tickets.users;
export const selectTicketStatus = (state) => state.tickets.status;

export default ticketSlice.reducer;
// questo pag richiama le funzioni per gestire le CRUD nel file ticket api (ticketApi) in piu salva tutto in redux. Usa asyncThunk per azioni asincrone
// ricreare ogni chiamata per ogni controller che ho, richiamando il link (API_URL )

//import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//import { fetchTickets, createTicket, updateTicket, deleteTicket } from "../../api/ticketApi";