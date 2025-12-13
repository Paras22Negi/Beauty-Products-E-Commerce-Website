import express from "express";
import upload from "../middleware/upload.js";
import * as BlogController from "../Controllers/blog.Controller.js";

const Router = express.Router();

// Create a new blog (with image upload - max 4 images)
Router.post("/create", upload.array("images", 4), BlogController.createBlog);

// Get all blogs (with pagination and search)
Router.get("/all", BlogController.getAllBlogs);

// Get a single blog by ID
Router.get("/:id", BlogController.getBlogById);

// Update a blog by ID (with image upload)
Router.put("/update/:id", upload.array("images", 4), BlogController.updateBlog);

// Delete a blog by ID
Router.delete("/delete/:id", BlogController.deleteBlog);

export default Router;
