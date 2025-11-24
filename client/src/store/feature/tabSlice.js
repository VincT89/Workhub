import { createSlice } from "@reduxjs/toolkit";

const tabSlice = createSlice({
  name: "tab",
  initialState: {
    activeTab: "Anagrafica", // tab attiva di default
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload; // aggiorna la tab attiva
    },
  },
});

export const { setActiveTab } = tabSlice.actions;
export default tabSlice.reducer;