import * as BlogService from "../services/Blog.Service.js";

// Create a new blog
const createBlog = async (req, res) => {
  try {
    const { title, summary, content, author } = req.body;
    const files = req.files || [];

    const blog = await BlogService.createBlog({
      title,
      summary,
      content,
      author,
      files,
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Create Blog Controller Error:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to create blog",
    });
  }
};

// Get all blogs with pagination and search
const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const result = await BlogService.getAllBlogs({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
    });

    return res.status(200).json({
      success: true,
      data: result.items,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error("Get All Blogs Controller Error:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to fetch blogs",
    });
  }
};

// Get a single blog by ID
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await BlogService.getBlogById(id);

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Get Blog By ID Controller Error:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to fetch blog",
    });
  }
};

// Update a blog by ID
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, content, author, existingImages } = req.body;
    const files = req.files || [];

    // Parse existingImages if it's a string
    let parsedExistingImages = existingImages;
    if (typeof existingImages === "string") {
      try {
        parsedExistingImages = JSON.parse(existingImages);
      } catch {
        parsedExistingImages = existingImages ? [existingImages] : [];
      }
    }

    const blog = await BlogService.updateBlog(id, {
      title,
      summary,
      content,
      author,
      files,
      existingImages: parsedExistingImages,
    });

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Update Blog Controller Error:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to update blog",
    });
  }
};

// Delete a blog by ID
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await BlogService.deleteBlog(id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Delete Blog Controller Error:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to delete blog",
    });
  }
};

export { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
