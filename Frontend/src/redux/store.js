// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authentication/reducer";
import accountReducer from "./account/reducer";
import productReducer from "./Product/reducer";
import supportReducer from "./Support/reducer";
import blogReducer from "./Blog/reducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
    support: supportReducer,
    product: productReducer,
    blog: blogReducer,
  },
});

export default store;
