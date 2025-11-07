import {
  FETCH_BLOGS_REQUEST,
  FETCH_BLOGS_SUCCESS,
  FETCH_BLOGS_FAILURE,
  FETCH_BLOG_DETAIL_FAILURE,
  FETCH_BLOG_DETAIL_REQUEST,
  FETCH_BLOG_DETAIL_SUCCESS,
} from "./actionType";

const initialState = {
  loading: false,
  blogs: [],
  error: "",
  blogDetail: {},
};

const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BLOGS_REQUEST:
        return {
        ...state,
        loading: true,
      };

    case FETCH_BLOGS_SUCCESS:
      return {
        ...state,
        loading: false,
        blogs: action.payload,
      };

    case FETCH_BLOGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case FETCH_BLOG_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_BLOG_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        blogDetail: action.payload,
      };
    
    case FETCH_BLOG_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default blogReducer;