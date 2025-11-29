import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3030/api/v1/events";

// GET tutti gli eventi
export const fetchEventsAsync = createAsyncThunk(
    "events/fetchEvents",
    async (_, { getState, rejectWithValue }) => { // metodo getState per accedere allo stato corrente e rejectWithValue per gestire gli errori, invece si mette _ quando non ci sono argomenti da passare
        try {
            const token = getState().auth.token;
            if (!token) {
                return rejectWithValue("Token mancante. Effettua il login.");
            }

            const res = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || "Errore nel recupero eventi.");
            }
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message || "Errore nel recupero eventi.");
        }
    }
);

// CREATE evento - solo admin
export const createEventAsync = createAsyncThunk(
    "events/createEvent",
    async (eventData, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            if (!token) {
                return rejectWithValue("Token mancante. Effettua il login.");
            }

            const res = await fetch(API_URL, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(eventData),
            });
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || "Errore nella creazione dell'evento.");
            }
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message || "Errore nella creazione dell'evento.");
        }
    }
);

// UPDATE evento - solo admin
export const updateEventAsync = createAsyncThunk(
    "events/updateEvent",
    async ({ id, updates }, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            if (!token) {
                return rejectWithValue("Token mancante. Effettua il login.");
            }

            const res = await fetch(`${API_URL}/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updates),
            });
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || "Errore nell'aggiornamento dell'evento.");
            }
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message || "Errore nell'aggiornamento dell'evento.");
        }
    }
);

// DELETE evento - solo admin
export const deleteEventAsync = createAsyncThunk(
    "events/deleteEvent",
    async (id, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            if (!token) {
                return rejectWithValue("Token mancante. Effettua il login.");
            }

            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || "Errore nella cancellazione dell'evento.");
            }
            return id;
        } catch (error) {
            return rejectWithValue(error.message || "Errore nella cancellazione dell'evento.");
        }
    }
);

// Slice eventi
const eventsSlice = createSlice({
    name: "events",
    initialState: {
        events: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // FETCH
            .addCase(fetchEventsAsync.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEventsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload || [];
            })
            .addCase(fetchEventsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // CREATE
            .addCase(createEventAsync.fulfilled, (state, action) => {
                state.events.push(action.payload);
            })
            .addCase(createEventAsync.rejected, (state, action) => {
                state.error = action.payload;
            })
            // UPDATE
            .addCase(updateEventAsync.fulfilled, (state, action) => {
                const index = state.events.findIndex(event => event._id === action.payload._id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
            })
            .addCase(updateEventAsync.rejected, (state, action) => {
                state.error = action.payload;
            })
            // DELETE
            .addCase(deleteEventAsync.fulfilled, (state, action) => {
                state.events = state.events.filter(event => event._id !== action.payload);
            })
            .addCase(deleteEventAsync.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export default eventsSlice.reducer;