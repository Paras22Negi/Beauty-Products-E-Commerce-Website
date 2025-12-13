import express from "express";
import * as couponController from "../controllers/coupon.controller.js";
const router = express.Router();

// User: Apply a coupon (during checkout)
router.post("/apply", couponController.applyCoupon);

// Admin: Get all usage logs
router.get("/usages", couponController.getCouponUsage);
router.post("/create", couponController.createCoupon);
router.get("/all_coupon", couponController.getAllCoupons);
router.delete("/delete/:id", couponController.deleteCoupon);
router.put("/update/:id", couponController.updateCoupon);

export default router;