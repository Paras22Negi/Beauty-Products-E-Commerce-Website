import express from "express";
import authenticate from "../middleware/authenticat.js";
const router = express.Router();
import * as cartItemController from "../Controllers/cart-Item-controller.js";

router.put("/:id", authenticate, cartItemController.updateCartItem);
router.delete("/:id", authenticate, cartItemController.removeCartItem);

export default router;
