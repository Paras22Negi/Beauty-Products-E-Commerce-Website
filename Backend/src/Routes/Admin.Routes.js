import express from "express";
import * as adminController from "../Controllers/Admin.Controller.js";
import authenticate from "../middleware/authenticat.js";

const router = express.Router();

// Public - Admin login
router.post("/login", adminController.adminLogin);

// Protected - Get admin profile
router.get("/profile", authenticate, adminController.getAdminProfile);

export default router;
