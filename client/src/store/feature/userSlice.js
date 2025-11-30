import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3030/api/v1";

/* CREATE usa register di /auth/register perche' gli utenti che combaciano con i dipendenti vengono creati tramite questa rotta */
export const createUserAsync = createAsyncThunk(
  "users/create",
  async ({ newUser, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);

      // il backend restituisce: { user, tempPassword }
      return data.data.user;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

/* GET ALL USERS */
export const fetchUsersAsync = createAsyncThunk(
  "users/fetchAll",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);

      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

/* GET USER BY ID */
export const fetchUserByIdAsync = createAsyncThunk(
  "users/fetchById",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);

      return data.data;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

/* UPDATE */
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

/* DELETE */
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
    selected: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearSelected(state) {
      state.selected = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createUserAsync.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(createUserAsync.fulfilled, (s, action) => {
        s.loading = false;
        s.list.push(action.payload);
      })
      .addCase(createUserAsync.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload;
      })

      /* READ ALL */
      .addCase(fetchUsersAsync.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUsersAsync.fulfilled, (s, action) => {
        s.loading = false;
        s.list = action.payload;
      })
      .addCase(fetchUsersAsync.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload;
      })

      /* READ ONE */
      .addCase(fetchUserByIdAsync.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchUserByIdAsync.fulfilled, (s, action) => {
        s.loading = false;
        s.selected = action.payload;
      })
      .addCase(fetchUserByIdAsync.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload;
      })

      /* UPDATE */
      .addCase(updateUserAsync.fulfilled, (s, action) => {
        const i = s.list.findIndex((u) => u._id === action.payload._id);
        if (i !== -1) s.list[i] = action.payload;

        if (s.selected?._id === action.payload._id) {
          s.selected = action.payload;
        }
      })

      /* DELETE */
      .addCase(deleteUserAsync.fulfilled, (s, action) => {
        s.list = s.list.filter((u) => u._id !== action.payload);
        if (s.selected?._id === action.payload) s.selected = null;
      });
  },
});

export const { clearSelected } = userSlice.actions;
export default userSlice.reducer;
