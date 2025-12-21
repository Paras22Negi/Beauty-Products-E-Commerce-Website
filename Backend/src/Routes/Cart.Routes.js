import express from "express";
import authenticate from "../middleware/authenticat.js";
import * as cartController from "../Controllers/cart-Controller.js";
const router = express.Router();

// GET: /api/cart
router.get("/", authenticate, cartController.findUserCart);

// PUT: /api/cart/add
router.put("/add", authenticate, cartController.addItemToCart);
router.post(
  "/apply-cart-coupon",
  authenticate,
  cartController.applyCouponToCart
);
router.get("/all-coupon", authenticate, cartController.allCoupon);

export default router;
