import axios from "axios";
import {
  ADD_SUPORT_REQUEST,
  ADD_SUPORT_SUCCESS,
  ADD_SUPORT_FAILURE,
} from "./actionType";
import env from "react-dotenv";

export const addSupportRequest = (supportData) => async (dispatch) => {
  dispatch({ type: ADD_SUPORT_REQUEST });
  try {
    const res = await axios.post(
      `${env.BACKEND_URL}/support`,
      supportData
    );
    dispatch({ type: ADD_SUPORT_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({
      type: ADD_SUPORT_FAILURE,
      payload: error.response?.data || "Failed to add support request",
    });
  }
};