import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employees: [
    {
      nome: "Jennifer Bianchi",
      ruolo: "Responsabile reparto",
      matricola: "ADD-0001",
      email: "jennifer.bianchi@example.com",
      role: "admin",
      turni: [
        { giorno: "Lunedì", orari: ["09:00-13:00", "14:00-18:00"] },
        { giorno: "Mercoledì", orari: ["10:00-14:00"] },
        { giorno: "Venerdì", orari: ["12:00-16:00", "17:00-20:00"] },
      ],
    },
    {
      nome: "Luca Rossi",
      ruolo: "Sviluppatore",
      matricola: "ADD-0002",
      email: "luca.rossi@example.com",
      role: "user",
      turni: [
        { giorno: "Martedì", orari: ["09:00-13:00", "14:00-18:00"] },
        { giorno: "Giovedì", orari: ["10:00-14:00"] },
      ],
    },
    {
      nome: "Maria Verdi",
      ruolo: "Designer",
      matricola: "ADD-0003",
      email: "maria.verdi@example.com",
      role: "supervisor",
      turni: [
        { giorno: "Lunedì", orari: ["09:00-13:00", "14:00-18:00"] },
        { giorno: "Mercoledì", orari: ["10:00-14:00"] },
      ],
    },
  ],
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
  },
});

export const { setEmployees } = employeeSlice.actions;
export default employeeSlice.reducer;
