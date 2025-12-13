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

const initialState = {
  reviews: [],
  ratings: [],
  averageRating: 0,
  totalRatings: 0,
  loading: false,
  submitting: false,
  error: null,
};

// Helper to calculate average rating
const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + (r.rating || 0), 0);
  return (sum / ratings.length).toFixed(1);
};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    // Get Reviews
    case GET_REVIEWS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_REVIEWS_SUCCESS:
      return {
        ...state,
        loading: false,
        reviews: action.payload,
        error: null,
      };
    case GET_REVIEWS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Create Review
    case CREATE_REVIEW_REQUEST:
      return { ...state, submitting: true, error: null };
    case CREATE_REVIEW_SUCCESS:
      return {
        ...state,
        submitting: false,
        error: null,
      };
    case CREATE_REVIEW_FAILURE:
      return { ...state, submitting: false, error: action.payload };

    // Get Ratings
    case GET_RATINGS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_RATINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        ratings: action.payload,
        averageRating: calculateAverageRating(action.payload),
        totalRatings: action.payload?.length || 0,
        error: null,
      };
    case GET_RATINGS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Create Rating
    case CREATE_RATING_REQUEST:
      return { ...state, submitting: true, error: null };
    case CREATE_RATING_SUCCESS:
      return {
        ...state,
        submitting: false,
        error: null,
      };
    case CREATE_RATING_FAILURE:
      return { ...state, submitting: false, error: action.payload };

    // Clear State
    case CLEAR_REVIEW_STATE:
      return initialState;

    default:
      return state;
  }
};

export default reviewReducer;
