// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authentication/reducer";


const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
