import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  createUserRequest,
  fetchUsersRequest,
  fetchUserByIdRequest,
  updateUserRequest,
  deleteUserRequest,
} from "../../api/usersApi";

/* CREATE */
export const createUserAsync = createAsyncThunk(
  "users/create",
  async ({ newUser, token }, { rejectWithValue }) => {
    try {
      const { response, data } = await createUserRequest({ newUser, token });

      if (!response.ok) return rejectWithValue(data.message);

      // backend returns { user, tempPassword }
      return data.data;
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
      const { response, data } = await fetchUsersRequest(token);

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
      const { response, data } = await fetchUserByIdRequest({ id, token });

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
      const { response, data } = await updateUserRequest({
        id,
        updates,
        token,
      });

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
      const { response, data } = await deleteUserRequest({ id, token });

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
        if (action.payload?.user) {
          s.list.push(action.payload.user);
        }
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
