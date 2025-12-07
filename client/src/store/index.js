import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./feature/authSlice";
import tabReducer from "./feature/tabSlice";
import eventReducer from "./feature/eventsSlice";
import userReducer from "./feature/userSlice";
import pointOfSalesReducer from "./feature/pointOfSalesSlice";
import shiftsReducer from "./feature/shiftsSlice";
import leaveReducer from "./feature/userLeave";


const store = configureStore({
  reducer: {
    auth: authReducer,
    tab: tabReducer,
    users: userReducer,
    pos: pointOfSalesReducer,
    events: eventReducer,
    shifts: shiftsReducer,
    leave: leaveReducer,
  },
});

export default store;
