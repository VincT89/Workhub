import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3030/api/v1"; // url base API riutilizzabile nelle chiamate

// LOGIN - prende username e password, restituisce token e dati utente
export const loginAsync = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) return rejectWithValue(data.message);

      const authData = {
        token: data.data.token,
        user: data.data.user,
        role: data.data.user.role,
      };

      localStorage.setItem("auth", JSON.stringify(authData)); // memorizza i dati di autenticazione nel localStorage
      return authData;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

// CAMBIO PASSWORD - prende email, vecchia e nuova password e restituisce successo/fallimento
export const changePasswordAsync = createAsyncThunk(
  "auth/changePassword",
  async ({ email, oldPassword, newPassword, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);

      return true;
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

// RECUPERO PASSWORD - prende email o username e restituisce successo/fallimento per ora restituisce una password temporanea in console
export const recoverPasswordAsync = createAsyncThunk(
  "auth/recoverPassword",
  async ({ email, username }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/recover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username }),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);
      console.log("RECOVERY PASSWORD RESPONSE:", data);
      return data.data;
     
    } catch {
      return rejectWithValue("Errore di rete.");
    }
  }
);

// STATO INIZIALE
const storedAuth =
  JSON.parse(localStorage.getItem("auth")) || {
    user: null,
    token: null,
    role: null,
  };

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedAuth.user,
    token: storedAuth.token,
    role: storedAuth.role,
    loading: false,
    error: null,
    recoveryLoading: false,
    recoveryError: null,
    recoveryMessage: null,
  },

  reducers: {
    logout: (state) => {
      localStorage.removeItem("auth");
      state.user = null;
      state.token = null;
      state.role = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PASSWORD
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.error = action.payload;
      })

      // RECOVERY
      .addCase(recoverPasswordAsync.pending, (state) => {
        state.recoveryLoading = true;
      })
      .addCase(recoverPasswordAsync.fulfilled, (state, action) => {
        state.recoveryLoading = false;
        state.recoveryMessage = action.payload;
      })
      .addCase(recoverPasswordAsync.rejected, (state, action) => {
        state.recoveryLoading = false;
        state.recoveryError = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
