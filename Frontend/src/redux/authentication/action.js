// src/redux/authentication/action.js
import axios from "axios";
import {
  SEND_OTP_REQUEST,
  SEND_OTP_SUCCESS,
  SEND_OTP_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
  SET_EMAIL,
} from "./actionType";

// Set Email
export const setEmail = (email) => ({
  type: SET_EMAIL,
  payload: email,
});

// Send OTP
export const sendOtp = (email) => async (dispatch) => {
  dispatch({ type: SEND_OTP_REQUEST });
  try {
    const res = await axios.post("http://localhost:5000/api/send-otp", { email });
    dispatch({ type: SEND_OTP_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: SEND_OTP_FAILURE,
      payload: error.response?.data || "Failed to send OTP",
    });
  }
};

// Verify OTP
export const verifyOtp = (email, otp) => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });
  try {
    const res = await axios.post("http://localhost:5000/api/verify-otp", {
      email,
      otp,
    });
    dispatch({ type: VERIFY_OTP_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: VERIFY_OTP_FAILURE,
      payload: error.response?.data || "OTP verification failed",
    });
  }
};
