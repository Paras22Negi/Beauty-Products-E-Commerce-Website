// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authentication/reducer";
import accountReducer from "./account/reducer";
import productReducer from "./Product/reducer";
import supportReducer from "./Support/reducer";
import blogReducer from "./Blog/reducer";
import cartReducer from "./cart/reducer";
import orderReducer from "./order/reducer";
import couponReducer from "./coupon/reducer";
import reviewReducer from "./review/reducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
    support: supportReducer,
    product: productReducer,
    blog: blogReducer,
    cart: cartReducer,
    order: orderReducer,
    coupon: couponReducer,
    review: reviewReducer,
  },
});

export default store;
