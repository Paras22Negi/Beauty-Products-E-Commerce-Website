import {
  GET_COUPONS_REQUEST,
  GET_COUPONS_SUCCESS,
  GET_COUPONS_FAILURE,
  APPLY_COUPON_REQUEST,
  APPLY_COUPON_SUCCESS,
  APPLY_COUPON_FAILURE,
  VALIDATE_COUPON_REQUEST,
  VALIDATE_COUPON_SUCCESS,
  VALIDATE_COUPON_FAILURE,
  CLEAR_COUPON,
  CLEAR_COUPON_ERROR,
} from "./actionType";

const initialState = {
  coupons: [],
  appliedCoupon: null,
  validatedCoupon: null,
  discountAmount: 0,
  loading: false,
  error: null,
};

const couponReducer = (state = initialState, action) => {
  switch (action.type) {
    // Get Coupons
    case GET_COUPONS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_COUPONS_SUCCESS:
      return {
        ...state,
        loading: false,
        coupons: action.payload,
        error: null,
      };
    case GET_COUPONS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Apply Coupon
    case APPLY_COUPON_REQUEST:
      return { ...state, loading: true, error: null };
    case APPLY_COUPON_SUCCESS:
      return {
        ...state,
        loading: false,
        appliedCoupon: action.payload,
        discountAmount: action.payload.discountAmount || 0,
        error: null,
      };
    case APPLY_COUPON_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Validate Coupon
    case VALIDATE_COUPON_REQUEST:
      return { ...state, loading: true, error: null };
    case VALIDATE_COUPON_SUCCESS:
      return {
        ...state,
        loading: false,
        validatedCoupon: action.payload,
        error: null,
      };
    case VALIDATE_COUPON_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        validatedCoupon: null,
      };

    // Clear Coupon
    case CLEAR_COUPON:
      return {
        ...state,
        appliedCoupon: null,
        validatedCoupon: null,
        discountAmount: 0,
      };

    // Clear Error
    case CLEAR_COUPON_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

export default couponReducer;
