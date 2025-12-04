import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/**
 * EVENTI FINTI INIZIALI
 */
const initialFakeEvents = [
  {
    _id: "1",
    title: "Riunione generale",
    startDate: "2025-02-10",
    endDate: "2025-02-10",
    description: "Briefing aziendale",
  },
  {
    _id: "2",
    title: "Controllo inventario",
    startDate: "2025-02-15",
    endDate: "2025-02-15",
    description: "Inventario magazzino",
  },
];

/**
 * FETCH  
 */
export const fetchEventsAsync = createAsyncThunk(
  "events/fetchEvents",
  async () => {
    // simuliamo una risposta immediata del "server"
    return initialFakeEvents;
  }
);

/**
 * CREATE 
 */
export const createEventAsync = createAsyncThunk(
  "events/createEvent",
  async (eventData) => {
    const newEvent = {
      _id: Date.now().toString(),
      ...eventData,
    };
    return newEvent;
  }
);

/**
 * UPDATE 
 *  BoardPage chiama: updateEventAsync({ id, data })
 */
export const updateEventAsync = createAsyncThunk(
  "events/updateEvent",
  async ({ id, data }) => {
    // restituiamo l'evento aggiornato con lo stesso _id
    return {
      _id: id,
      ...data,
    };
  }
);

/**
 * DELETE 
 */
export const deleteEventAsync = createAsyncThunk(
  "events/deleteEvent",
  async (id) => {
    return id;
  }
);

/**
 * SLICE
 */
const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: initialFakeEvents,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchEventsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload || [];
      })
      .addCase(fetchEventsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Errore fetch eventi (mock).";
      })

      // CREATE
      .addCase(createEventAsync.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(createEventAsync.rejected, (state, action) => {
        state.error = action.payload || "Errore create eventi (mock).";
      })

      // UPDATE
      .addCase(updateEventAsync.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.events.findIndex((ev) => ev._id === updated._id);
        if (index !== -1) {
          state.events[index] = updated;
        }
      })
      .addCase(updateEventAsync.rejected, (state, action) => {
        state.error = action.payload || "Errore update eventi (mock).";
      })

      // DELETE
      .addCase(deleteEventAsync.fulfilled, (state, action) => {
        const id = action.payload;
        state.events = state.events.filter((ev) => ev._id !== id);
      })
      .addCase(deleteEventAsync.rejected, (state, action) => {
        state.error = action.payload || "Errore delete eventi (mock).";
      });
  },
});

export default eventsSlice.reducer;
