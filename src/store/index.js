import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./feature/authSlice";
import clientiReducer from "./feature/clientiSlice";
import magazzinoReducer from "./feature/magazzinoSlice";
import personaleReducer from "./feature/personaleSlice";
import ticketReducer from "./feature/ticketSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    clienti: clientiReducer,
    magazzino: magazzinoReducer,
    personale: personaleReducer,
    ticket: ticketReducer,
  },
});

export default store;
