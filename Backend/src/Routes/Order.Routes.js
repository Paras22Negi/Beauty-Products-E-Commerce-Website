import express from "express";
import authenticate from "../middleware/authenticat.js";
const router = express.Router();
import * as orderController from "../Controllers/order-controller.js";

router.post("/", authenticate, orderController.createOrder);
router.get("/user", authenticate, orderController.OrderHistory);
router.get("/:id", authenticate, orderController.findOrderById);

export default router;
