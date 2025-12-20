import Cart from "../Models/cart.model.js";
import CartItem from "../Models/cartItem.Model.js";
import Product from "../Models/product.Model.js";
import Coupon from "../Models/coupon.Model.js";

// create new cart for user
export const createCart = async (user) => {
  const cart = new Cart({ user });
  const createdCart = await cart.save();
  return createdCart;
};

export const findUserCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await createCart(userId);
  }
  const cartItems = await CartItem.find({ cart: cart._id }).populate("product");

  // Convert to plain object to avoid Mongoose validation errors when assigning populated objects
  const cartObj = cart.toObject();
  cartObj.cartItems = cartItems;

  let totalPrice = 0;
  let totalDiscountedPrice = 0;
  let totalItem = 0;

  for (const cartItem of cartItems) {
    if (cartItem.product) {
      totalPrice += cartItem.product.price * cartItem.quantity;
      totalDiscountedPrice +=
        cartItem.product.discountedPrice * cartItem.quantity;
      totalItem += cartItem.quantity;
    }
  }

  cartObj.totalPrice = totalPrice;
  cartObj.totalItem = totalItem;
  cartObj.totalDiscountedPrice = totalDiscountedPrice;
  cartObj.totalPriceAfterDiscount = totalPrice - totalDiscountedPrice;
  return cartObj;
};

export const addCartItems = async (userId, req) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await createCart(userId);
  }

  const product = await Product.findById(req.productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const isPresent = await CartItem.findOne({
    cart: cart._id,
    product: product._id,
    userId,
    size: req.size,
  });

  if (!isPresent) {
    const cartItem = new CartItem({
      product: product._id,
      cart: cart._id,
      quantity: 1,
      userId,
      price: product.discountedPrice || product.price,
      size: req.size,
      discountedPrice: product.discountedPrice || product.price,
    });

    const createdCartItem = await cartItem.save();
    cart.cartItems.push(createdCartItem);
    await cart.save();
  } else {
    isPresent.quantity += 1;
    await isPresent.save();
  }
  return "Item added to cart";
};

// update applyCoupon() without orderId dependecy
export const applyCoupon = async (code, userId, cartId, cartTotal) => {
  const coupon = await Coupon.findOne({ code, isActive: true });
  if (!coupon) {
    throw new Error("Coupon not found");
  }
  if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
    throw new Error(
      `Minimum order amount of ₹${coupon.minOrderAmount} required`
    );
  }
  let discountAmount = 0;
  if (coupon.discountType === "flat") {
    discountAmount = coupon.discountValue;
  } else if (coupon.discountType === "percentage") {
    discountAmount = (coupon.discountValue / 100) * cartTotal;
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }
  }

  const finalPayableAmount = Math.floor(cartTotal - discountAmount);

  // Save Coupon to cart
  const cart = await Cart.findById(cartId);
  cart.couponCode = coupon.code;
  cart.couponDiscount = Math.floor(discountAmount);
  await cart.save();

  return {
    success: true,
    code: coupon.code,
    discountAmount: Math.floor(discountAmount),
    originalTotal: cartTotal,
    finalPayableAmount,
    difference: Math.floor(discountAmount),
    message: `Coupon "${code}" applied successfully`,
  };
};

export const allCoupon = async () => {
  const coupon = await Coupon.find().sort({ createdAt: -1 });
  return coupon;
};

export default {
  createCart,
  findUserCart,
  addCartItems,
  applyCoupon,
  allCoupon,
};
