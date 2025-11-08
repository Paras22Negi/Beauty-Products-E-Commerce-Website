import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
} from "./actionType";

const initialState = {
  items: [], // Array of cart items
  totalItems: 0,
  totalPrice: 0,
};

const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  return { totalItems, totalPrice };
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const existingItemIndex = state.items.findIndex(
        (item) => item.cartId === action.payload.cartId
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // New item, add to cart
        newItems = [...state.items, action.payload];
      }

      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case REMOVE_FROM_CART: {
      const newItems = state.items.filter(
        (item) => item.cartId !== action.payload
      );
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case UPDATE_CART_QUANTITY: {
      const newItems = state.items.map((item) =>
        item.cartId === action.payload.cartId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const totals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case CLEAR_CART:
      return initialState;

    default:
      return state;
  }
};

export default cartReducer;
