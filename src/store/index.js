import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./feature/authSlice";
import employeeReducer from "./feature/employeeSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
  },
});

export default store;
