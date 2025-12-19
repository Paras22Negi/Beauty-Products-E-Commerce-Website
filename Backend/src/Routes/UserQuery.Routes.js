import express from "express";
import * as userQueryController from "../Controllers/userQuery.Controller.js";
import authenticate from "../middleware/authenticat.js";

const router = express.Router();

// Public route - anyone can submit a contact form
router.post("/", userQueryController.createUserQuery);

// Admin routes - protected
router.get("/", authenticate, userQueryController.getAllQueries);
router.patch(
  "/:id/status",
  authenticate,
  userQueryController.updateQueryStatus
);
router.delete("/:id", authenticate, userQueryController.deleteQuery);

export default router;
