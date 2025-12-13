import express from "express";
import * as userQueryController from "../Controllers/userQuery.Controller.js";
import authenticate from "../middleware/authenticat.js";
const router = express.Router();

router.post("/user-query", authenticate, userQueryController.createUserQuery);

export default router;
