import express from "express";
const router = express.Router();
import * as AuthController from "../Controllers/auth.controller.js";


router.post("/signup", AuthController.registerUser);
router.post("/signin", AuthController.login);
router.post("/send-otp", AuthController.sendOtp);
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/send-reset-otp", AuthController.sendResetOtp);
router.post("/reset-password", AuthController.resetPassword);

export default router;