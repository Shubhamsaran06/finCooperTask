import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customers: [],
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setCustomers(state, action) {
      state.customers = action.payload;
    },
    deleteCustomer(state, action) {
      state.customers = state.customers.filter((customer) => customer.id !== action.payload);
    },
  },
});

export const { setCustomers, deleteCustomer } = customerSlice.actions;

export default customerSlice.reducer;
