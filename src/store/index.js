import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./feature/authSlice";
import employeeReducer from "./feature/employeeSlice";
import tabReducer from "./feature/tabSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    tab: tabReducer,
  },
});

export default store;
