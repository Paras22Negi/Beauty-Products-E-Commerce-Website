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
    const res = await axios.post("http://localhost:5000/api/send-otp", {
      email,
    });
    dispatch({ type: SEND_OTP_SUCCESS, payload: res.data });

    // ✅ Return response so component can handle message
    return { success: true, payload: res.data };
  } catch (error) {
    const errMsg =
      error.response?.data?.message || "Failed to send OTP. Please try again.";
    dispatch({ type: SEND_OTP_FAILURE, payload: errMsg });

    // ✅ Return error so frontend can read and show it
    return { success: false, payload: { message: errMsg } };
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

    return { success: true, payload: res.data };
  } catch (error) {
    const errMsg =
      error.response?.data?.message || "OTP verification failed. Try again.";
    dispatch({ type: VERIFY_OTP_FAILURE, payload: errMsg });

    return { success: false, payload: { message: errMsg } };
  }
};
