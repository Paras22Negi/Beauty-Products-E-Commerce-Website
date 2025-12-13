import express from "express";
import authenticate from "../middleware/authenticat.js";
const router = express.Router();
import * as paymentController from "../controllers/payment.controller.js";

router.post("/:id", authenticate, paymentController.createPaymentLink);
router.get("/", authenticate, paymentController.updatePaymentInformation);
router.get("/payment-history/:userId", paymentController.getUserPaymentHistory);

export default router;