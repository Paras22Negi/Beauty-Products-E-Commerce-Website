import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  GET_ORDER_BY_ID_REQUEST,
  GET_ORDER_BY_ID_SUCCESS,
  GET_ORDER_BY_ID_FAILURE,
  GET_ORDER_HISTORY_REQUEST,
  GET_ORDER_HISTORY_SUCCESS,
  GET_ORDER_HISTORY_FAILURE,
  CREATE_PAYMENT_REQUEST,
  CREATE_PAYMENT_SUCCESS,
  CREATE_PAYMENT_FAILURE,
  UPDATE_PAYMENT_REQUEST,
  UPDATE_PAYMENT_SUCCESS,
  UPDATE_PAYMENT_FAILURE,
  CLEAR_ORDER_STATE,
} from "./actionType";

const initialState = {
  order: null,
  orders: [],
  paymentLink: null,
  loading: false,
  error: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    // Create Order
    case CREATE_ORDER_REQUEST:
      return { ...state, loading: true, error: null };
    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload,
        error: null,
      };
    case CREATE_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Get Order by ID
    case GET_ORDER_BY_ID_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_ORDER_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload,
        error: null,
      };
    case GET_ORDER_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Get Order History
    case GET_ORDER_HISTORY_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_ORDER_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload,
        error: null,
      };
    case GET_ORDER_HISTORY_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Create Payment
    case CREATE_PAYMENT_REQUEST:
      return { ...state, loading: true, error: null };
    case CREATE_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        paymentLink: action.payload,
        error: null,
      };
    case CREATE_PAYMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Update Payment
    case UPDATE_PAYMENT_REQUEST:
      return { ...state, loading: true, error: null };
    case UPDATE_PAYMENT_SUCCESS:
      return { ...state, loading: false, error: null };
    case UPDATE_PAYMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Clear State
    case CLEAR_ORDER_STATE:
      return initialState;

    default:
      return state;
  }
};

export default orderReducer;
