import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fakeLogin, updateUserPassword } from "../../api/authApi";
import { personnel } from "../../api/mock/personaleMock";

// --- LOGIN ASYNC ---
export const loginAsync = createAsyncThunk(
	"auth/login",
	async ({ username, password }, { rejectWithValue }) => {
		try {
			const response = await fakeLogin(username, password);

			const role =
				response.user?.role ||
				personnel.find((p) => p.username === username)?.role ||
				"user";

			const userData = { ...response, user: { ...response.user, role } };

			localStorage.setItem("auth", JSON.stringify(userData));
			return userData;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// --- STATO INIZIALE ---
const storedAuth = JSON.parse(localStorage.getItem("auth")) || {
	user: null,
	token: null,
	role: null,
};

// --- SLICE ---
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
			localStorage.removeItem("auth");
		},

		// --- AGGIORNA CREDENZIALI ---
		updateCredentials: (state, action) => {
			const { username, password, name, email, role } = action.payload;
			users[index] = {
				...users[index],
				username,
				password,
				name,
				email,
				role,
			};

			// Recupera utenti dal localStorage o mock
			const users = JSON.parse(localStorage.getItem("users")) || [...personnel];
			const index = users.findIndex((u) => u.username === state.user?.username);

			if (index === -1) {
				alert("Utente non trovato");
				return;
			}

			// Mantiene tutti i campi, incluso id, email, role, name
			users[index] = {
				...users[index],
				username,
				password,
			};

			localStorage.setItem("users", JSON.stringify(users));
			updateUserPassword(username, password);

			// Aggiorna Redux + localStorage
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
