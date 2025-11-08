import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
} from "./actionType";

export const addToCart = (product, quantity = 1, selectedShade = null) => ({
  type: ADD_TO_CART,
  payload: {
    ...product,
    quantity,
    selectedShade,
    cartId: `${product.id}-${selectedShade || "default"}`, // unique cart item id
  },
});

export const removeFromCart = (cartId) => ({
  type: REMOVE_FROM_CART,
  payload: cartId,
});

export const updateCartQuantity = (cartId, quantity) => ({
  type: UPDATE_CART_QUANTITY,
  payload: { cartId, quantity },
});

export const clearCart = () => ({
  type: CLEAR_CART,
});
