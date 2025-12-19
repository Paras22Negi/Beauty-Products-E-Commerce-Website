import express from "express";
import * as videoController from "../Controllers/Video.Controller.js";
import upload from "../middleware/upload.js"; // Assuming you have a multer middleware configuration

const router = express.Router();

router.get("/", videoController.getAllVideos); // Changed from /api/videos to / because it will be mounted at /api/videos
router.post("/", upload.single("video"), videoController.uploadVideo);
router.delete("/:id", videoController.deleteVideo);
router.put("/:id", videoController.updateVideoDetails);

export default router;
