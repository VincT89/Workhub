import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./feature/authSlice";
import employeeReducer from "./feature/employeeSlice";
import tabReducer from "./feature/tabSlice";
import eventReducer from "./feature/eventsSlice";
import userReducer from "./feature/userSlice";
import pointOfSalesReducer from "./feature/pointOfSalesSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    tab: tabReducer,
    users: userReducer,
    pos: pointOfSalesReducer,
    events: eventReducer,
  },
});

export default store;
