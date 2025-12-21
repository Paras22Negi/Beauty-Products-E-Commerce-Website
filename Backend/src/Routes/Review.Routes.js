import express from "express";
import authenticate from "../middleware/authenticat.js";
const router = express.Router();
import * as reviewController from "../Controllers/review-controller.js";

router.post("/create", authenticate, reviewController.createReview);
router.get("/product/:productId", reviewController.getAllReview);
router.get(
  "/eligibility/:productId",
  authenticate,
  reviewController.checkReviewEligibility
);

export default router;
