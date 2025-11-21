import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fakeLogin, updateUserPassword } from "../../api/authApi";
import { personnel } from "../../api/mock/personaleMock";

// LOGIN ASYNC

export const loginAsync = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // Verifica credenziali simulate
      const response = await fakeLogin(username, password);

      // Trova il dipendente nella lista mock
      const dipendente = personnel.find((p) => p.username === username);

      if (!dipendente) {
        return rejectWithValue("Utente non trovato nel database personale");
      }

      // Unisci i dati del login con i dati del dipendente
      const userData = {
        ...response,
        user: {
          ...response.user,

          // Permessi (admin/user/supervisor)
          role: dipendente.role || "user",

          // 👤 Dati reali del dipendente
          nome: dipendente.nome,
          matricola: dipendente.matricola,
          email: dipendente.email,
          reparto: dipendente.ruolo, // ruolo aziendale
        },
      };

      // Salva nel localStorage
      localStorage.setItem("auth", JSON.stringify(userData));

      return userData;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


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
    role: storedAuth.user?.role || null,
    loading: false,
    error: null,
  },

  reducers: {
    // LOGOUT

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem("auth");
    },

    // AGGIORNA CREDENZIALI / PROFILO
    updateCredentials: (state, action) => {
      const { username, password, nome, email, role } = action.payload;

      // Recupera utenti da localStorage o mock
      const users = JSON.parse(localStorage.getItem("users")) || [...personnel];

      const index = users.findIndex(
        (u) => u.username === state.user?.username
      );

      if (index === -1) {
        alert("Utente non trovato");
        return;
      }

      // Aggiorna i dati dell'utente
      users[index] = {
        ...users[index],
        username: username || users[index].username,
        password: password || users[index].password,
        nome: nome || users[index].nome,
        email: email || users[index].email,
        role: role || users[index].role,
      };

      // Salva aggiornamenti
      localStorage.setItem("users", JSON.stringify(users));
      updateUserPassword(username, password);

      // Aggiorna Redux
      state.user = { ...users[index] };
      state.role = users[index].role;

      const newAuth = {
        user: state.user,
        token: state.token,
        role: state.role,
      };

      localStorage.setItem("auth", JSON.stringify(newAuth));
    },
	},
	
  // ASYNC REDUCERS
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

export const { logout, updateCredentials } = authSlice.actions;
export default authSlice.reducer;
