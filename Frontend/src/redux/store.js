// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authentication/reducer";
import accountReducer from "./account/reducer";


const store = configureStore({
  reducer: {
    auth: authReducer, 
    account: accountReducer,
  },
});

export default store;
