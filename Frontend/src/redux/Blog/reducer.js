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

const initialState = {
  loading: false,
  blogs: [],
  blogDetail: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  error: null,
};

const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch Blogs
    case FETCH_BLOGS_REQUEST:
    case SEARCH_BLOGS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_BLOGS_SUCCESS:
    case SEARCH_BLOGS_SUCCESS:
      return {
        ...state,
        loading: false,
        blogs: action.payload.blogs,
        pagination: action.payload.pagination,
        error: null,
      };

    case FETCH_BLOGS_FAILURE:
    case SEARCH_BLOGS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Fetch Blog Detail
    case FETCH_BLOG_DETAIL_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_BLOG_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        blogDetail: action.payload,
        error: null,
      };

    case FETCH_BLOG_DETAIL_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Clear Blog Detail
    case CLEAR_BLOG_DETAIL:
      return { ...state, blogDetail: null };

    default:
      return state;
  }
};

export default blogReducer;
