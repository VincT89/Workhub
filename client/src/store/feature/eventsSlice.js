import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchEvents, createEvent, updateEvent, deleteEvent } from "../../api/eventsApi"; 

// Creazione di azioni asincrone usando createAsyncThunk

// GET (legge tutti gli eventi)
export const fetchEventsAsync = createAsyncThunk(
    "events/fetchEvents", // nome univoco dell’azione (serve a Redux per identificarla).
    async ({token}) => {
        return await fetchEvents(token); // chiamata API per ottenere eventi
    });

// POST (aggiunge un nuovo evento)
export const createEventAsync = createAsyncThunk(
    "events/createEvent",
    async ({ data, token }) => {
        return await createEvent(data, token); // chiamata API per creare evento
    });

// PUT (modifica un evento esistente)
export const updateEventAsync = createAsyncThunk(
    "events/updateEvent",
    async ({ id, data, token }) => {
        return await updateEvent(id, data, token); // chiamata API per aggiornare evento
    });

// DELETE (elimina un evento)
export const deleteEventAsync = createAsyncThunk(
    "events/deleteEvent",
    async ({ id, token }) => {
        await deleteEvent(id, token);
        return {id}; // ritorna l'id dell'evento eliminato
    });

        const eventsSlice = createSlice({
            name: "events",
            initialState: {
                events: [],
                loading: false,
                error: null,
            },
            reducers: {},
            extraReducers: (builder) => {
                builder // Gestione azioni asincrone
                    // GET 
                    .addCase(fetchEventsAsync.pending, (state) => {
                        state.loading = true; // Inizio caricamento
                        state.error = null; // Resetta errori
                    })
                    .addCase(fetchEventsAsync.fulfilled, (state, action) => {
                        state.loading = false; // Fine caricamento
                        state.events = action.payload; // Aggiorna lo stato con gli eventi ricevuti
                    })
                    .addCase(fetchEventsAsync.rejected, (state, action) => {
                        state.loading = false; // Fine caricamento
                        state.error = action.error.message; // Imposta l'errore
                    })
                    // POST
                    .addCase(createEventAsync.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                    })
                    .addCase(createEventAsync.fulfilled, (state, action) => {
                        state.loading = false;
                        state.events.push(action.payload);
                    })
                    .addCase(createEventAsync.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.error.message;
                    })
                    // PUT
                    .addCase(updateEventAsync.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                    })
                    .addCase(updateEventAsync.fulfilled, (state, action) => {
                        state.loading = false;
                        const updated = action.payload;
                        const index = state.events.findIndex((ev) => ev._id === updated._id);
                        if (index !== -1) {
                            state.events[index] = updated;
                        }
                    })
                    .addCase(updateEventAsync.rejected, (state, action) => {
                        state.loading = false;  
                        state.error = action.error.message; // Imposta l'errore
                    })
                    // DELETE
                    .addCase(deleteEventAsync.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                    })
                    .addCase(deleteEventAsync.fulfilled, (state, action) => {
                        state.loading = false;
                        state.events = state.events.filter((ev) => ev._id !== action.payload.id);
                    })
                    .addCase(deleteEventAsync.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.error.message; 
                    });
            },
        });

        export default eventsSlice.reducer;  // reducer da inserire nello store.