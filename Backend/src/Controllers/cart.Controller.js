import * as CartServices from "../services/Cart.Service.js";

const findUserCart = async (req, res) => {
  try {
    const user = req.user;
    const cart = await CartServices.findUserCart(user.id);
    return res.status(200).json(cart);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to get user cart.", error: error.message });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const user = req.user;
    await CartServices.addCartItems(user.id.toString(), req.body);
    return res
      .status(200)
      .json({ message: "Item added to cart successfully", status: true });
  } catch (error) {
    //Handle error here and send appropriate response
    return res
      .status(500)
      .json({ message: "Failed to add item to cart.", error: error.message });
  }
};

const applyCouponToCart = async (req, res) => {
  try {
    const { code, userId, cartId, cartTotal } = req.body;

    const result = await CartServices.applyCoupon(
      code,
      userId,
      cartId,
      cartTotal
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to apply coupon" });
  }
};

const allCoupon = async (req, res) => {
  try {
    const allCoupons = await CartServices.allCoupon(); // 👈 call the function
    res.status(200).json({
      success: true,
      message: "Coupons fetched successfully",
      coupons: allCoupons,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { findUserCart, addItemToCart, applyCouponToCart, allCoupon };
