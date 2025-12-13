import CartItem from "../Models/cartItem.Model.js";
import * as userService from "./User.Services.js";

// Create a new cart item
const createCartItem = async (cartItemData) => {
  const cartItem = new CartItem(cartItemData);
  cartItem.quantity = 1;
  cartItem.price = cartItem.product.price * cartItem.quantity;
  cartItem.discountedPrice =
    cartItem.product.discountedPrice * cartItem.quantity;

  const createdCartItem = await cartItem.save();
  return createdCartItem;
};

// Update a cart item
const updateCartItem = async (userId, cartItemId, cartItemData) => {
  const item = await CartItem.findById(cartItemId);
  if (!item) {
    throw new Error("Cart item not found:", cartItemId);
  }
  const user = await userService.findUser(item.userId);
  if (!user) {
    throw new Error("User not found:", item.userId);
  }
  if (user.id === userId) {
    item.quantity = cartItemData.quantity;
    item.price = item.product.price * item.quantity;
    item.discountedPrice = item.product.discountedPrice * item.quantity;

    const updatedCartItem = await item.save();
    return updatedCartItem;
  } else {
    throw new Error("You can't update another user's cart item");
  }
};

// Check if a cart item is already present in the user's cart
const isCartItemExist = async (cart, product, size, userId) => {
  const cartItem = await CartItem.findOne({ cart, product, size, userId });
  return cartItem;
};

// remove a cart item
const removeCartItem = async (userId, cartItemId) => {
  // console.log(`userId - ${userId}, cartItemId - ${cartItemId}`);

  const cartItem = await findCartItemById(cartItemId);
  const user = await userService.findUserById(cartItem.userId);
  const reqUser = await userService.findUserById(userId);

  if (user.id === reqUser.id) {
    await CartItem.findByIdAndDelete(cartItem.id);
  } else {
    throw new UserException("You can't remove another user's item");
  }
};

// find a cart item by its ID
const findCartItemById = async (cartItemId) => {
  const cartItem = await CartItem.findById(cartItemId).populate("product");
  if (cartItem) {
    return cartItem;
  } else {
    throw new CartItemException(`CartItem not found with id: ${cartItemId}`);
  }
};

export {
  createCartItem,
  updateCartItem,
  isCartItemExist,
  removeCartItem,
  findCartItemById,
};
