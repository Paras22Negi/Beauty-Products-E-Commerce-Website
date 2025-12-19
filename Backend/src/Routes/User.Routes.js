// routes/auth.routes.js

import express from "express";
import * as authController from "../Controllers/auth.Controller.js";
import * as userController from "../Controllers/User.Controller.js";
import authenticate from "../middleware/authenticat.js";

const router = express.Router();

// Auth routes
router.post("/register", authController.registerUser);
router.post("/login", authController.login);

// OTP verification routes
router.post("/request-verify-otp", authController.sendOtp);
router.post("/confirm-verify-otp", authController.verifyOtp);

// Password reset via OTP
router.post("/request-reset-otp", authController.sendResetOtp);
router.post("/reset-password", authController.resetPassword);

router.get("/users", authenticate, userController.getAllUsers);
router.get("/users/profile", authenticate, userController.getUserProfile);

// Profile & Address management (requires authentication)
router.put("/profile", authenticate, userController.updateProfile);
router.post("/addresses", authenticate, userController.addAddress);
router.get("/addresses", authenticate, userController.getAddresses);

export default router;
