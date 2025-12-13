import axios from "axios";
import {
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  GET_CART_FAILURE,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  REMOVE_FROM_CART_REQUEST,
  REMOVE_FROM_CART_SUCCESS,
  REMOVE_FROM_CART_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  APPLY_COUPON_REQUEST,
  APPLY_COUPON_SUCCESS,
  APPLY_COUPON_FAILURE,
  GET_COUPONS_REQUEST,
  GET_COUPONS_SUCCESS,
  GET_COUPONS_FAILURE,
  CLEAR_CART,
} from "./actionType";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get user's cart
export const getCart = () => async (dispatch) => {
  dispatch({ type: GET_CART_REQUEST });
  try {
    const res = await axios.get(`${API_URL}/api/cart`, {
      headers: getAuthHeader(),
    });
    dispatch({ type: GET_CART_SUCCESS, payload: res.data });
    return { success: true, data: res.data };
  } catch (error) {
    const errMsg = error.response?.data?.message || "Failed to fetch cart";
    dispatch({ type: GET_CART_FAILURE, payload: errMsg });
    return { success: false, error: errMsg };
  }
};

// Add item to cart
export const addToCart = (productId, size) => async (dispatch) => {
  dispatch({ type: ADD_TO_CART_REQUEST });
  try {
    const res = await axios.put(
      `${API_URL}/api/cart/add`,
      { productId, size },
      { headers: getAuthHeader() }
    );
    dispatch({ type: ADD_TO_CART_SUCCESS, payload: res.data });
    // Refresh cart after adding
    dispatch(getCart());
    return { success: true, message: res.data.message };
  } catch (error) {
    const errMsg =
      error.response?.data?.message || "Failed to add item to cart";
    dispatch({ type: ADD_TO_CART_FAILURE, payload: errMsg });
    return { success: false, error: errMsg };
  }
};

// Update cart item quantity
export const updateCartItem = (cartItemId, data) => async (dispatch) => {
  dispatch({ type: UPDATE_CART_ITEM_REQUEST });
  try {
    const res = await axios.put(
      `${API_URL}/api/cart-items/${cartItemId}`,
      data,
      { headers: getAuthHeader() }
    );
    dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: res.data });
    // Refresh cart after update
    dispatch(getCart());
    return { success: true, data: res.data };
  } catch (error) {
    const errMsg =
      error.response?.data?.message || "Failed to update cart item";
    dispatch({ type: UPDATE_CART_ITEM_FAILURE, payload: errMsg });
    return { success: false, error: errMsg };
  }
};

// Remove item from cart
export const removeFromCart = (cartItemId) => async (dispatch) => {
  dispatch({ type: REMOVE_FROM_CART_REQUEST });
  try {
    const res = await axios.delete(`${API_URL}/api/cart-items/${cartItemId}`, {
      headers: getAuthHeader(),
    });
    dispatch({ type: REMOVE_FROM_CART_SUCCESS, payload: cartItemId });
    // Refresh cart after removal
    dispatch(getCart());
    return { success: true, message: res.data.message };
  } catch (error) {
    const errMsg = error.response?.data?.message || "Failed to remove item";
    dispatch({ type: REMOVE_FROM_CART_FAILURE, payload: errMsg });
    return { success: false, error: errMsg };
  }
};

// Apply coupon to cart
export const applyCoupon =
  (code, cartId, cartTotal) => async (dispatch, getState) => {
    dispatch({ type: APPLY_COUPON_REQUEST });
    try {
      const userId = getState().account?.user?._id;
      const res = await axios.post(
        `${API_URL}/api/cart/apply-cart-coupon`,
        { code, userId, cartId, cartTotal },
        { headers: getAuthHeader() }
      );
      dispatch({ type: APPLY_COUPON_SUCCESS, payload: res.data });
      // Refresh cart after coupon applied
      dispatch(getCart());
      return { success: true, data: res.data };
    } catch (error) {
      const errMsg = error.response?.data?.error || "Failed to apply coupon";
      dispatch({ type: APPLY_COUPON_FAILURE, payload: errMsg });
      return { success: false, error: errMsg };
    }
  };

// Get all available coupons
export const getCoupons = () => async (dispatch) => {
  dispatch({ type: GET_COUPONS_REQUEST });
  try {
    const res = await axios.get(`${API_URL}/api/cart/all-coupon`, {
      headers: getAuthHeader(),
    });
    dispatch({ type: GET_COUPONS_SUCCESS, payload: res.data.coupons });
    return { success: true, data: res.data.coupons };
  } catch (error) {
    const errMsg = error.response?.data?.message || "Failed to fetch coupons";
    dispatch({ type: GET_COUPONS_FAILURE, payload: errMsg });
    return { success: false, error: errMsg };
  }
};

// Clear cart (local action)
export const clearCart = () => ({
  type: CLEAR_CART,
});

// Alias for backward compatibility
export const updateCartQuantity = updateCartItem;
