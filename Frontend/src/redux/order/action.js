import axios from "axios";
import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  GET_ORDER_BY_ID_REQUEST,
  GET_ORDER_BY_ID_SUCCESS,
  GET_ORDER_BY_ID_FAILURE,
  GET_ORDER_HISTORY_REQUEST,
  GET_ORDER_HISTORY_SUCCESS,
  GET_ORDER_HISTORY_FAILURE,
  CREATE_PAYMENT_REQUEST,
  CREATE_PAYMENT_SUCCESS,
  CREATE_PAYMENT_FAILURE,
  UPDATE_PAYMENT_REQUEST,
  UPDATE_PAYMENT_SUCCESS,
  UPDATE_PAYMENT_FAILURE,
  CLEAR_ORDER_STATE,
} from "./actionType";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create a new order
export const createOrder =
  (shippingAddress, usedSuperCoins = 0) =>
  async (dispatch) => {
    dispatch({ type: CREATE_ORDER_REQUEST });
    try {
      const res = await axios.post(
        `${API_URL}/api/orders`,
        { shippingAddress, usedSuperCoins },
        { headers: getAuthHeader() }
      );
      dispatch({ type: CREATE_ORDER_SUCCESS, payload: res.data });
      return { success: true, data: res.data };
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to create order";
      dispatch({ type: CREATE_ORDER_FAILURE, payload: errMsg });
      return { success: false, error: errMsg };
    }
  };

// Get order by ID
export const getOrderById = (orderId) => async (dispatch) => {
  dispatch({ type: GET_ORDER_BY_ID_REQUEST });
  try {
    const res = await axios.get(`${API_URL}/api/orders/${orderId}`, {
      headers: getAuthHeader(),
    });
    dispatch({ type: GET_ORDER_BY_ID_SUCCESS, payload: res.data });
    return { success: true, data: res.data };
  } catch (error) {
    const errMsg = error.response?.data?.message || "Failed to fetch order";
    dispatch({ type: GET_ORDER_BY_ID_FAILURE, payload: errMsg });
    return { success: false, error: errMsg };
  }
};

// Get user's order history
export const getOrderHistory = () => async (dispatch) => {
  dispatch({ type: GET_ORDER_HISTORY_REQUEST });
  try {
    const res = await axios.get(`${API_URL}/api/orders/user`, {
      headers: getAuthHeader(),
    });
    dispatch({ type: GET_ORDER_HISTORY_SUCCESS, payload: res.data });
    return { success: true, data: res.data };
  } catch (error) {
    const errMsg =
      error.response?.data?.message || "Failed to fetch order history";
    dispatch({ type: GET_ORDER_HISTORY_FAILURE, payload: errMsg });
    return { success: false, error: errMsg };
  }
};

// Create payment link for an order
export const createPayment = (orderId) => async (dispatch) => {
  dispatch({ type: CREATE_PAYMENT_REQUEST });
  try {
    const res = await axios.post(
      `${API_URL}/api/payments/${orderId}`,
      {},
      { headers: getAuthHeader() }
    );
    dispatch({ type: CREATE_PAYMENT_SUCCESS, payload: res.data });
    return { success: true, data: res.data };
  } catch (error) {
    const errMsg = error.response?.data?.message || "Failed to create payment";
    dispatch({ type: CREATE_PAYMENT_FAILURE, payload: errMsg });
    return { success: false, error: errMsg };
  }
};

// Update payment information (callback after payment)
export const updatePayment = (paymentInfo) => async (dispatch) => {
  dispatch({ type: UPDATE_PAYMENT_REQUEST });
  try {
    const queryString = new URLSearchParams(paymentInfo).toString();
    const res = await axios.get(`${API_URL}/api/payments?${queryString}`, {
      headers: getAuthHeader(),
    });
    dispatch({ type: UPDATE_PAYMENT_SUCCESS, payload: res.data });
    return { success: true, data: res.data };
  } catch (error) {
    const errMsg = error.response?.data?.message || "Failed to update payment";
    dispatch({ type: UPDATE_PAYMENT_FAILURE, payload: errMsg });
    return { success: false, error: errMsg };
  }
};

// Combined: Create order and initiate payment in one step
export const createOrderAndPay =
  (shippingAddress, usedSuperCoins = 0) =>
  async (dispatch) => {
    try {
      // Step 1: Create order
      const orderResult = await dispatch(
        createOrder(shippingAddress, usedSuperCoins)
      );
      if (!orderResult.success) {
        return { success: false, error: orderResult.error };
      }

      const orderId = orderResult.data._id;

      // Step 2: Create payment link
      const paymentResult = await dispatch(createPayment(orderId));
      if (!paymentResult.success) {
        return { success: false, error: paymentResult.error, orderId };
      }

      // Step 3: Redirect to payment
      const paymentUrl = paymentResult.data.paymentLinkUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
        return { success: true, redirecting: true };
      }

      return { success: false, error: "Payment URL not received" };
    } catch (error) {
      return { success: false, error: error.message || "Checkout failed" };
    }
  };

// Clear order state
export const clearOrderState = () => ({
  type: CLEAR_ORDER_STATE,
});
