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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Set Email
export const setEmail = (email) => ({
  type: SET_EMAIL,
  payload: email,
});

// Send OTP
export const sendOtp = (email) => async (dispatch) => {
  dispatch({ type: SEND_OTP_REQUEST });
  try {
    const res = await axios.post(`${BACKEND_URL}/api/request-verify-otp`, {
      email,
    });
    dispatch({ type: SEND_OTP_SUCCESS, payload: res.data });

    // 🔑 Log OTP to browser console (Render nodemailer workaround)
    if (res.data?.otp) {
      console.log(
        `%c🔑 Your OTP: ${res.data.otp}`,
        "color: #5c4dff; font-size: 20px; font-weight: bold;",
      );
    }

    // ✅ Return response so component can handle message
    return { success: true, payload: res.data };
  } catch (error) {
    const errMsg =
      error.response?.data?.message || "Failed to send OTP. Please try again.";
    console.log(error);
    dispatch({ type: SEND_OTP_FAILURE, payload: errMsg });

    // ✅ Return error so frontend can read and show it
    return { success: false, payload: { message: errMsg } };
  }
};

// Verify OTP
export const verifyOtp = (email, otp) => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });
  try {
    const res = await axios.post(`${BACKEND_URL}/api/confirm-verify-otp`, {
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
