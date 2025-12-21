import express from "express";
import authenticate from "../middleware/authenticat.js";
const router = express.Router();
import * as ratingController from "../Controllers/rating-controller.js";

router.post("/create", authenticate, ratingController.createRating);
router.get("/product/:productId", ratingController.getProductsRating);

export default router;
