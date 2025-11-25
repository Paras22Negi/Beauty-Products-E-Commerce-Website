import axios from "axios";
import {
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  FETCH_USER_DETAILS,
  FETCH_USER_DETAILS_SUCCESS,
  FETCH_USER_DETAILS_FAILURE,
  LOGOUT,
} from "./actionType";
const API_URL = import.meta.env.VITE_BACKEND_URL;


export const signup = (userData) => async (dispatch) => {
    dispatch({ type: SIGNUP_REQUEST });
    try {
        const res = await axios.post(
          `${API_URL}/signup`,
          userData
        );
        dispatch({ type: SIGNUP_SUCCESS, payload: res.data });
    } catch (error) {
        dispatch({
            type: SIGNUP_FAILURE,
            payload: error.response?.data || "Failed to signup",
        });
    }
};

export const login = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const res = await axios.post(`${API_URL}/login`, credentials);
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    console.log(res.data)
    // Store token in localStorage (if not already in reducer)
    localStorage.setItem("token", res.data.token);

    return res.data; // return data for component to act on
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data || "Failed to login",
    });
    throw error; // throw error so component knows login failed
  }
};

export const fetchUserDetails = (token) => async (dispatch) => {
    dispatch({ type: FETCH_USER_DETAILS });
    try {
        const res = await axios.get(`${API_URL}/user-details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch({ type: FETCH_USER_DETAILS_SUCCESS, payload: res.data });
    } catch (error) {
        dispatch({
            type: FETCH_USER_DETAILS_FAILURE,
            payload: error.response?.data || "Failed to fetch user details",
        });
    }
};

export const logout = () => ({ type: LOGOUT });