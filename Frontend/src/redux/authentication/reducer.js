// src/redux/authentication/reducer.js
import {
  SEND_OTP_REQUEST,
  SEND_OTP_SUCCESS,
  SEND_OTP_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
  SET_EMAIL,
} from "./actionType";

const initialState = {
  email: "",
  showOtp: false,
  isVerified: false,
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EMAIL:
      return { ...state, email: action.payload };

    case SEND_OTP_REQUEST:
    case VERIFY_OTP_REQUEST:
      return { ...state, loading: true, error: null };

    case SEND_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        showOtp: action.payload.success || false,
        error: null,
      };

    case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        isVerified: action.payload.success || false,
        error: null,
      };

    case SEND_OTP_FAILURE:
    case VERIFY_OTP_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default authReducer;
