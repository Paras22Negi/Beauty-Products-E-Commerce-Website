import {
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  GET_CART_FAILURE,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  REMOVE_FROM_CART_REQUEST,
  REMOVE_FROM_CART_SUCCESS,
  REMOVE_FROM_CART_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  APPLY_COUPON_REQUEST,
  APPLY_COUPON_SUCCESS,
  APPLY_COUPON_FAILURE,
  GET_COUPONS_REQUEST,
  GET_COUPONS_SUCCESS,
  GET_COUPONS_FAILURE,
  CLEAR_CART,
} from "./actionType";

const initialState = {
  cart: null,
  cartItems: [],
  totalPrice: 0,
  totalItem: 0,
  totalDiscountedPrice: 0,
  couponCode: null,
  couponDiscount: 0,
  coupons: [],
  loading: false,
  error: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    // Get Cart
    case GET_CART_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        cart: action.payload,
        cartItems: action.payload.cartItems || [],
        totalPrice: action.payload.totalPrice || 0,
        totalItem: action.payload.totalItem || 0,
        totalDiscountedPrice: action.payload.totalDiscountedPrice || 0,
        couponCode: action.payload.couponCode || null,
        couponDiscount: action.payload.couponDiscount || 0,
        error: null,
      };
    case GET_CART_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Add to Cart
    case ADD_TO_CART_REQUEST:
      return { ...state, loading: true, error: null };
    case ADD_TO_CART_SUCCESS:
      return { ...state, loading: false, error: null };
    case ADD_TO_CART_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Update Cart Item
    case UPDATE_CART_ITEM_REQUEST:
      return { ...state, loading: true, error: null };
    case UPDATE_CART_ITEM_SUCCESS:
      return { ...state, loading: false, error: null };
    case UPDATE_CART_ITEM_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Remove from Cart
    case REMOVE_FROM_CART_REQUEST:
      return { ...state, loading: true, error: null };
    case REMOVE_FROM_CART_SUCCESS:
      return { ...state, loading: false, error: null };
    case REMOVE_FROM_CART_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Apply Coupon
    case APPLY_COUPON_REQUEST:
      return { ...state, loading: true, error: null };
    case APPLY_COUPON_SUCCESS:
      return {
        ...state,
        loading: false,
        couponCode: action.payload.code,
        couponDiscount: action.payload.discountAmount,
        error: null,
      };
    case APPLY_COUPON_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Get Coupons
    case GET_COUPONS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_COUPONS_SUCCESS:
      return { ...state, loading: false, coupons: action.payload, error: null };
    case GET_COUPONS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Clear Cart
    case CLEAR_CART:
      return initialState;

    default:
      return state;
  }
};

export default cartReducer;
