import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "../slice/customerSlice";


const store = configureStore({
  reducer: {
    customers: customerReducer,
  },
});

export default store;
