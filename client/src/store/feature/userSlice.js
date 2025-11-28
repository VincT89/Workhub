import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3030/api/v1";

// GET ALL USERS (solo admin) - restituisce lista utenti senza password
export const fetchUsersAsync = createAsyncThunk(
  "users/fetchAll",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);

      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

// UPDATE USER - prende id, oggetti con aggiornamenti e token, restituisce utente aggiornato
export const updateUserAsync = createAsyncThunk(
  "users/update",
  async ({ id, updates, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);

      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

// DELETE USER - prende id e token, restituisce id eliminato
export const deleteUserAsync = createAsyncThunk(
  "users/delete",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);

      return id;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        const i = state.list.findIndex((u) => u._id === action.payload._id);
        if (i !== -1) state.list[i] = action.payload;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u._id !== action.payload);
      });
  },
});

export default userSlice.reducer;
