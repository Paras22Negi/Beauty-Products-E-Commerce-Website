import express from "express";
const Router = express.Router();
import * as productController from "../Controllers/Product.Controller.js";

Router.get("/", productController.getAllProducts);
Router.get("/id/:id", productController.findProductById);
Router.get("/search", productController.searchProducts);
Router.get("/category/:category", productController.findProductByCategory);

export default Router;
