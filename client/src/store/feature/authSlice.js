import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// LOGIN REALE 
//fetch POST /auth/login con body { username, password }
export const loginAsync = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3030/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Errore durante il login");
      }

      // Salvo token + user nel localStorage per persistenza
      const authData = {
        token: data.data.token,
        user: data.data.user,
        role: data.data.user.role,
      };

      localStorage.setItem("auth", JSON.stringify(authData));

      return authData;

    } catch (error) {
      return rejectWithValue("Errore di rete. Server non raggiungibile.");
    }
  }
);

// UPDATE USER (PATCH /users/:id) 
// fetch con body { updates } e token per auth 
export const updateUserAsync = createAsyncThunk(
  "auth/updateUser",
  async ({ id, updates, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3030/api/v1/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Errore durante l'aggiornamento utente");
      }

      return data.data; // utente aggiornato

    } catch (error) {
      return rejectWithValue("Errore di rete.");
    }
  }
);

// DELETE USER (DELETE /users/:id)
// fetch con token in modo da autorizzare l'operazione
export const deleteUserAsync = createAsyncThunk(
  "auth/deleteUser",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3030/api/v1/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Errore durante l'eliminazione utente");
      }

      return id;

    } catch (error) {
      return rejectWithValue("Errore di rete.");
    }
  }
);

// CHANGE PASSWORD BY EMAIL (PATCH /users/password)
// fetch con body { email, oldPassword, newPassword } e token per auth
export const changePasswordAsync = createAsyncThunk(
  "auth/changePassword",
  async ({ email, oldPassword, newPassword, token }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3030/api/v1/users/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Errore nel cambio password");
      }

      return true;

    } catch (error) {
      return rejectWithValue("Errore di rete.");
    }
  }
);

// RECUPERO PASSWORD (POST /auth/recover)
// fetch con body { email, username } e senza token (pubblica) 
export const recoverPasswordAsync = createAsyncThunk(
  "auth/recoverPassword",
  async ({ email, username }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3030/api/v1/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Errore durante il recupero password");
      }

      return data.data; // { email, tempPassword }
    } catch (error) {
      return rejectWithValue("Errore di rete. Server non raggiungibile.");
    }
  }
);


// RECUPERA AUTH DAL LOCALSTORAGE
const storedAuth =
  JSON.parse(localStorage.getItem("auth")) || {
    user: null,
    token: null,
    role: null,
  };

// SLICE AUTH
const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: storedAuth.user,
    token: storedAuth.token,
    role: storedAuth.role,
    recoveryLoading: false,
    recoveryError: null,
    recoveryMessage: null,
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
  },

  extraReducers: (builder) => {
    builder
      // LOGIN
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

      // UPDATE USER
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        if (state.user && action.payload._id === state.user._id) {
          state.user = action.payload;

          const updatedAuth = {
            user: state.user,
            token: state.token,
            role: state.user.role,
          };

          localStorage.setItem("auth", JSON.stringify(updatedAuth));
        }
      })

      // DELETE USER
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        if (state.user?._id === action.payload) {
          state.user = null;
          state.token = null;
          state.role = null;
          localStorage.removeItem("auth");
        }
      })

      // CHANGE PASSWORD
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
    
    // RECOVERY PASSWORD
      .addCase(recoverPasswordAsync.pending, (state) => {
        state.recoveryLoading = true;
        state.recoveryError = null;
        state.recoveryMessage = null;
      })
      .addCase(recoverPasswordAsync.fulfilled, (state, action) => {
        state.recoveryLoading = false;
        state.recoveryMessage = action.payload;
      })
      .addCase(recoverPasswordAsync.rejected, (state, action) => {
        state.recoveryLoading = false;
        state.recoveryError = action.payload;
      })    
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
