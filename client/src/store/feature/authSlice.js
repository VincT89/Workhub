import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3030/api/v1"; // url base API

// LOGIN
export const loginAsync = createAsyncThunk(
	"auth/login",
	async ({ username, password, code }, { rejectWithValue }) => { // includo code 2FA
		try {
			const response = await fetch(`${API_URL}/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password, code}), // includo token 2FA se presente
			});

			const data = await response.json();
			if (!response.ok) return rejectWithValue(data.message);
			if (!data.data.is2FARequired) { // login normale
				const authData = {
					token: data.data.token,
					user: data.data.user,
					role: data.data.user.role,
				};

				localStorage.setItem("auth", JSON.stringify(authData));
				return authData;
			} else { // login con code
				// 2FA richiesta, non salvo nulla
				return { is2FARequired: true }; 
			}
		} catch (error) {
			console.error("Login error:", error);
			return rejectWithValue("Errore di rete.");
		}
	}
);

// CAMBIO PASSWORD
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

// RECUPERO PASSWORD
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
			return data.data;
		} catch {
			return rejectWithValue("Errore di rete.");
		}
	}
);

// ENABLE 2FA
export const enable2FAAsync = createAsyncThunk(
	"auth/enable2FA",
	async ({ token }, { rejectWithValue }) => {
		try {
			const response = await fetch(`${API_URL}/auth/enable-2fa`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await response.json();
			if (!response.ok) return rejectWithValue(data.message);

			return data.data; // contiene qr e uri
		} catch {
			return rejectWithValue("Errore di rete.");
		}
	}
);

// DISABLE 2FA
export const disable2FAAsync = createAsyncThunk(
	"auth/disable2FA",
	async ({ token }, { rejectWithValue }) => {
		try {
			const response = await fetch(`${API_URL}/auth/disable-2fa`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await response.json();
			if (!response.ok) return rejectWithValue(data.message);

			return true;
		} catch {
			return rejectWithValue("Errore di rete.");
		}
	}
);

// VERIFY 2FA
export const verify2FAAsync = createAsyncThunk(
	"auth/verify2FA",
	async ({ userId, token2fa }, { rejectWithValue }) => {
		try {
			const response = await fetch(`${API_URL}/users/${userId}/2fa/verify`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: token2fa }),
			});

			const data = await response.json();
			if (!response.ok) return rejectWithValue(data.message);

			return true;
		} catch {
			return rejectWithValue("Errore di rete.");
		}
	}
);

// STATO INIZIALE
const storedAuth = JSON.parse(localStorage.getItem("auth")) || {
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
		twofaLoading: false,
		twofaError: null,
		twofaData: null, // contiene QR e URI quando abiliti
		is2FARequired: false,
		loginData: {
			username: null,
			password: null,
		},
	},

	reducers: {
		logout: (state) => {
			localStorage.removeItem("auth");
			localStorage.removeItem("persist:root");
			state.user = null;
			state.token = null;
			state.role = null;
			state.twofaData = null;
			state.loginData.username = null;
			state.loginData.password = null;
		},
		setLoginData: (state, action) => {
			state.loginData = action.payload;
		},
		setIs2FARequired: (state, action) => {
			state.is2FARequired = action.payload;
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
        if (action.payload.is2FARequired) {
          state.is2FARequired = true;
          return;
        }
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
			})

			// ENABLE 2FA
			.addCase(enable2FAAsync.pending, (state) => {
				state.twofaLoading = true;
				state.twofaError = null;
			})
			.addCase(enable2FAAsync.fulfilled, (state, action) => {
				state.twofaLoading = false;
				state.twofaData = action.payload; // contiene qr e uri
			})
			.addCase(enable2FAAsync.rejected, (state, action) => {
				state.twofaLoading = false;
				state.twofaError = action.payload;
			})

			// DISABLE 2FA
			.addCase(disable2FAAsync.fulfilled, (state) => {
				state.twofaData = null;
				state.twofaError = null;
			})
			.addCase(disable2FAAsync.rejected, (state, action) => {
				state.twofaError = action.payload;
			})

			// VERIFY 2FA
			.addCase(verify2FAAsync.fulfilled, (state) => {
				state.twofaError = null;
			})
			.addCase(verify2FAAsync.rejected, (state, action) => {
				state.twofaError = action.payload;
			});
	},
});

export const { logout, setLoginData, setIs2FARequired } = authSlice.actions;
export default authSlice.reducer;
