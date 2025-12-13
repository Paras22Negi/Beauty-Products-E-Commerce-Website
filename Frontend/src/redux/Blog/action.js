import axios from "axios";
import {
  FETCH_BLOGS_REQUEST,
  FETCH_BLOGS_SUCCESS,
  FETCH_BLOGS_FAILURE,
  FETCH_BLOG_DETAIL_REQUEST,
  FETCH_BLOG_DETAIL_SUCCESS,
  FETCH_BLOG_DETAIL_FAILURE,
  SEARCH_BLOGS_REQUEST,
  SEARCH_BLOGS_SUCCESS,
  SEARCH_BLOGS_FAILURE,
  CLEAR_BLOG_DETAIL,
} from "./actionType";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Fetch all blogs with pagination
export const fetchBlogs =
  (page = 1, limit = 10) =>
  async (dispatch) => {
    dispatch({ type: FETCH_BLOGS_REQUEST });
    try {
      const res = await axios.get(
        `${API_URL}/api/blogs/all?page=${page}&limit=${limit}`
      );
      dispatch({
        type: FETCH_BLOGS_SUCCESS,
        payload: {
          blogs: res.data.data,
          pagination: res.data.pagination,
        },
      });
      return { success: true, data: res.data };
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to fetch blogs";
      dispatch({ type: FETCH_BLOGS_FAILURE, payload: errMsg });
      return { success: false, error: errMsg };
    }
  };

// Fetch single blog by ID
export const fetchBlogDetail = (id) => async (dispatch) => {
  dispatch({ type: FETCH_BLOG_DETAIL_REQUEST });
  try {
    const res = await axios.get(`${API_URL}/api/blogs/${id}`);
    dispatch({ type: FETCH_BLOG_DETAIL_SUCCESS, payload: res.data.data });
    return { success: true, data: res.data.data };
  } catch (error) {
    const errMsg = error.response?.data?.message || "Failed to fetch blog";
    dispatch({ type: FETCH_BLOG_DETAIL_FAILURE, payload: errMsg });
    return { success: false, error: errMsg };
  }
};

// Search blogs
export const searchBlogs =
  (query, page = 1, limit = 10) =>
  async (dispatch) => {
    dispatch({ type: SEARCH_BLOGS_REQUEST });
    try {
      const res = await axios.get(
        `${API_URL}/api/blogs/all?search=${encodeURIComponent(
          query
        )}&page=${page}&limit=${limit}`
      );
      dispatch({
        type: SEARCH_BLOGS_SUCCESS,
        payload: {
          blogs: res.data.data,
          pagination: res.data.pagination,
        },
      });
      return { success: true, data: res.data };
    } catch (error) {
      const errMsg = error.response?.data?.message || "Failed to search blogs";
      dispatch({ type: SEARCH_BLOGS_FAILURE, payload: errMsg });
      return { success: false, error: errMsg };
    }
  };

// Clear blog detail
export const clearBlogDetail = () => ({
  type: CLEAR_BLOG_DETAIL,
});
