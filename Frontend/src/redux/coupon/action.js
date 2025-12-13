import axios from "axios";
import {
  GET_COUPONS_REQUEST,
  GET_COUPONS_SUCCESS,
  GET_COUPONS_FAILURE,
  APPLY_COUPON_REQUEST,
  APPLY_COUPON_SUCCESS,
  APPLY_COUPON_FAILURE,
  VALIDATE_COUPON_REQUEST,
  VALIDATE_COUPON_SUCCESS,
  VALIDATE_COUPON_FAILURE,
  CLEAR_COUPON,
  CLEAR_COUPON_ERROR,
} from "./actionType";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all available coupons
export const getCoupons = () => async (dispatch) => {
  dispatch({ type: GET_COUPONS_REQUEST });
  try {
    const res = await axios.get(`${API_URL}/api/coupons/all_coupon`, {
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

// Apply coupon to cart (using cart route - already integrated)
export const applyCouponToCart =
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
      return { success: true, data: res.data };
    } catch (error) {
      const errMsg = error.response?.data?.error || "Failed to apply coupon";
      dispatch({ type: APPLY_COUPON_FAILURE, payload: errMsg });
      return { success: false, error: errMsg };
    }
  };

// Apply coupon to order (using coupon route)
export const applyCouponToOrder =
  (code, userId, orderId) => async (dispatch) => {
    dispatch({ type: APPLY_COUPON_REQUEST });
    try {
      const res = await axios.post(
        `${API_URL}/api/coupons/apply`,
        { code, userId, orderId },
        { headers: getAuthHeader() }
      );
      dispatch({ type: APPLY_COUPON_SUCCESS, payload: res.data });
      return { success: true, data: res.data };
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to apply coupon";
      dispatch({ type: APPLY_COUPON_FAILURE, payload: errMsg });
      return { success: false, error: errMsg };
    }
  };

// Validate coupon (check if valid without applying)
export const validateCoupon = (code, cartTotal) => async (dispatch) => {
  dispatch({ type: VALIDATE_COUPON_REQUEST });
  try {
    // Use getCoupons and find the matching coupon
    const res = await axios.get(`${API_URL}/api/coupons/all_coupon`, {
      headers: getAuthHeader(),
    });

    const coupon = res.data.coupons?.find(
      (c) => c.code.toLowerCase() === code.toLowerCase() && c.isActive
    );

    if (!coupon) {
      throw new Error("Invalid or expired coupon");
    }

    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      throw new Error(
        `Minimum order amount of ₹${coupon.minOrderAmount} required`
      );
    }

    // Calculate discount preview
    let discountAmount = 0;
    if (coupon.discountType === "flat") {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === "percentage") {
      discountAmount = (coupon.discountValue / 100) * cartTotal;
      if (
        coupon.maxDiscountAmount &&
        discountAmount > coupon.maxDiscountAmount
      ) {
        discountAmount = coupon.maxDiscountAmount;
      }
    }

    const validatedData = {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: Math.floor(discountAmount),
      finalAmount: Math.floor(cartTotal - discountAmount),
    };

    dispatch({ type: VALIDATE_COUPON_SUCCESS, payload: validatedData });
    return { success: true, data: validatedData };
  } catch (error) {
    const errMsg = error.message || "Failed to validate coupon";
    dispatch({ type: VALIDATE_COUPON_FAILURE, payload: errMsg });
    return { success: false, error: errMsg };
  }
};

// Clear applied coupon
export const clearCoupon = () => ({
  type: CLEAR_COUPON,
});

// Clear coupon error
export const clearCouponError = () => ({
  type: CLEAR_COUPON_ERROR,
});
