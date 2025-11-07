import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fakeLogin } from "../../api/authApi";

// Login asincrono
export const loginAsync = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => { // rejectWithValue per gestire errori
    try {
      const response = await fakeLogin(username, password);

      // Simula il ruolo utente ricevuto dal server
      const role =
        response.user?.role ||
        (username === "admin"
          ? "admin"
          : username === "supervisor"
          ? "supervisor"
          : "user");

      const userData = { ...response, user: { ...response.user, role } };

      // --- Salva i dati utente e token nel localStorage ---
      localStorage.setItem("auth", JSON.stringify(userData));

      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Recupera lo stato iniziale da localStorage (se presente)
const storedAuth = JSON.parse(localStorage.getItem("auth")) || {
  user: null,
  token: null,
  role: null,
};

// Slice di autenticazione
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedAuth.user,
    token: storedAuth.token,
    role: storedAuth.user?.role || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      // --- Rimuove i dati salvati nel localStorage ---
      localStorage.removeItem("auth");
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
        state.role = action.payload.user.role;

        // --- Aggiorna anche il localStorage ---
        localStorage.setItem("auth", JSON.stringify(action.payload));
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
