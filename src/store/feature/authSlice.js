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

      return { ...response, user: { ...response.user, role } };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice di autenticazione
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    role: null, 
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
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
        state.role = action.payload.user.role; 
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
