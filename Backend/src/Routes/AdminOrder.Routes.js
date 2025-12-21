import express from "express";
import authenticate from "../middleware/authenticat.js";
const router = express.Router();
import * as adminOrderController from "../Controllers/admin-order-controller.js";

// Dashboard Overview
router.get(
  "/overview",
  authenticate,
  adminOrderController.getAdminDashboardOverview
);

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

router.put("/:orderId/return", authenticate, adminOrderController.returnOrder);

export default router;
