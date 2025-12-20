import express from "express";
const router = express.Router();
import * as ProductControllers from "../Controllers/Product.Controller.js";
import upload from "../middleware/upload.js";
import SizeChart from "../Models/sizechart.model.js";

router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 4 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  ProductControllers.createProduct
);
router.post("/creates", ProductControllers.createMultipleProduct);
router.delete("/:id", ProductControllers.deleteProduct);
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 4 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  ProductControllers.updateProduct
);
router.get("/:category", async (req, res) => {
  try {
    const chart = await SizeChart.findOne({ category: req.params.category });
    if (!chart) return res.status(404).json({ message: "No size chart found" });
    res.json(chart);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

export default router;
