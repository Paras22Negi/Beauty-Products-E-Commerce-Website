import axios from "axios";
import { FETCH_BLOGS_REQUEST, FETCH_BLOGS_SUCCESS, FETCH_BLOGS_FAILURE, FETCH_BLOG_DETAIL_REQUEST, FETCH_BLOG_DETAIL_SUCCESS, FETCH_BLOG_DETAIL_FAILURE } from "./actionType";

export const fetchBlogs = () => async (dispatch) => {
  dispatch({ type: FETCH_BLOGS_REQUEST });
  try {
    const res = await axios.get("https://dummyjson.com/blogs");
    dispatch({ type: FETCH_BLOGS_SUCCESS, payload: res.data.blogs });
  } catch (error) {
    dispatch({ type: FETCH_BLOGS_FAILURE, payload: error.message });
  }
};

export const fetchBlogDetail = (id) => async (dispatch) => {
    dispatch({ type: FETCH_BLOG_DETAIL_REQUEST });
    try {
      const res = await axios.get(`https://dummyjson.com/blogs/${id}`);
      dispatch({ type: FETCH_BLOG_DETAIL_SUCCESS, payload: res.data });
    } catch (error) {
      dispatch({ type: FETCH_BLOG_DETAIL_FAILURE, payload: error.message });
    }
};