import axios from "axios";
import {
  GET_REVIEWS_REQUEST,
  GET_REVIEWS_SUCCESS,
  GET_REVIEWS_FAILURE,
  CREATE_REVIEW_REQUEST,
  CREATE_REVIEW_SUCCESS,
  CREATE_REVIEW_FAILURE,
  GET_RATINGS_REQUEST,
  GET_RATINGS_SUCCESS,
  GET_RATINGS_FAILURE,
  CREATE_RATING_REQUEST,
  CREATE_RATING_SUCCESS,
  CREATE_RATING_FAILURE,
  CLEAR_REVIEW_STATE,
} from "./actionType";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ============ REVIEWS ============

// Get all reviews for a product
export const getProductReviews = (productId) => async (dispatch) => {
  dispatch({ type: GET_REVIEWS_REQUEST });
  try {
    const res = await axios.get(`${API_URL}/api/reviews/product/${productId}`);
    dispatch({ type: GET_REVIEWS_SUCCESS, payload: res.data });
    return { success: true, data: res.data };
  } catch (error) {
    const errMsg = error.response?.data?.error || "Failed to fetch reviews";
    dispatch({ type: GET_REVIEWS_FAILURE, payload: errMsg });
    return { success: false, error: errMsg };
  }
};

// Create a new review
export const createReview = (productId, review) => async (dispatch) => {
  dispatch({ type: CREATE_REVIEW_REQUEST });
  try {
    const res = await axios.post(
      `${API_URL}/api/reviews/create`,
      { productId, review },
      { headers: getAuthHeader() }
    );
    dispatch({ type: CREATE_REVIEW_SUCCESS, payload: res.data });
    // Refresh reviews after creating
    dispatch(getProductReviews(productId));
    return { success: true, data: res.data };
  } catch (error) {
    const errMsg = error.response?.data?.error || "Failed to create review";
    dispatch({ type: CREATE_REVIEW_FAILURE, payload: errMsg });
    return { success: false, error: errMsg };
  }
};

// ============ RATINGS ============

// Get all ratings for a product
export const getProductRatings = (productId) => async (dispatch) => {
  dispatch({ type: GET_RATINGS_REQUEST });
  try {
    const res = await axios.get(`${API_URL}/api/ratings/product/${productId}`);
    dispatch({ type: GET_RATINGS_SUCCESS, payload: res.data });
    return { success: true, data: res.data };
  } catch (error) {
    const errMsg = error.response?.data?.error || "Failed to fetch ratings";
    dispatch({ type: GET_RATINGS_FAILURE, payload: errMsg });
    return { success: false, error: errMsg };
  }
};

// Create a new rating
export const createRating = (productId, rating) => async (dispatch) => {
  dispatch({ type: CREATE_RATING_REQUEST });
  try {
    const res = await axios.post(
      `${API_URL}/api/ratings/create`,
      { productId, rating },
      { headers: getAuthHeader() }
    );
    dispatch({ type: CREATE_RATING_SUCCESS, payload: res.data });
    // Refresh ratings after creating
    dispatch(getProductRatings(productId));
    return { success: true, data: res.data };
  } catch (error) {
    const errMsg = error.response?.data?.error || "Failed to create rating";
    dispatch({ type: CREATE_RATING_FAILURE, payload: errMsg });
    return { success: false, error: errMsg };
  }
};

// ============ COMBINED ============

// Get both reviews and ratings for a product
export const getProductFeedback = (productId) => async (dispatch) => {
  await Promise.all([
    dispatch(getProductReviews(productId)),
    dispatch(getProductRatings(productId)),
  ]);
};

// Submit review with rating
export const submitReviewWithRating =
  (productId, review, rating) => async (dispatch) => {
    const [reviewResult, ratingResult] = await Promise.all([
      dispatch(createReview(productId, review)),
      dispatch(createRating(productId, rating)),
    ]);

    return {
      success: reviewResult.success && ratingResult.success,
      review: reviewResult,
      rating: ratingResult,
    };
  };

// Clear review state
export const clearReviewState = () => ({
  type: CLEAR_REVIEW_STATE,
});
