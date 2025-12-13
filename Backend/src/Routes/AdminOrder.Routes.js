import express from "express";
import authenticate from "../middleware/authenticat.js";
const router = express.Router();
import * as adminOrderController from "../Controllers/Admin.Order.Controller.js";

router.get("/", authenticate, adminOrderController.getAllOrders);
router.put(
  "/:orderId/confirmed",
  authenticate,
  adminOrderController.confirmedOrder
);
router.put("/:orderId/ship", authenticate, adminOrderController.shipOrder);
router.put(
  "/:orderId/deliver",
  authenticate,
  adminOrderController.deliverOrder
);
router.put(
  "/:orderId/cancel",
  authenticate,
  adminOrderController.cancelledOrder
);
router.delete(
  "/:orderId/delete",
  authenticate,
  adminOrderController.deleteOrder
);
router.put(
  "/:orderId/out-for-delivery",
  authenticate,
  adminOrderController.outForDelivery
);
router.put(
  "/:orderId/return/approve",
  authenticate,
  adminOrderController.approveReturnOrder
);

export default router;
