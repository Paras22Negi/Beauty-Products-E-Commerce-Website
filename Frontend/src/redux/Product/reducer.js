import {
  FETCH_PRODUCT_DETAIL_FAILURE,
  FETCH_PRODUCT_DETAIL_REQUEST,
  FETCH_PRODUCT_DETAIL_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCT_FAILURE,
  SEARCH_PRODUCT_SUCCESS,
  SEARCH_PRODUCT_REQUEST,
} from "./actionType";

// this is like a schema for storage
const initialState = {
  loading: false, // typo fixed: loding → loading
  product: [],
  error: "",
  productDetail: {},
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
    case SEARCH_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_PRODUCTS_SUCCESS:
    case SEARCH_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        product: Array.isArray(action.payload)
          ? action.payload
          : action.payload.products || [], // ✅ always extract .products if object
      };

    case FETCH_PRODUCTS_FAILURE:
    case SEARCH_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case FETCH_PRODUCT_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        productDetail: action.payload,
      };

    case FETCH_PRODUCT_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state; // 👈 must always return state if no action matches
  }
};

export default productReducer