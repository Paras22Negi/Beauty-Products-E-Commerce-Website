import * as userQueryServices from "../services/UserQuery.Service.js";

// Create a new contact query (no auth required)
const createUserQuery = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (name, email, subject, message)",
      });
    }

    // Get user ID if authenticated (optional)
    const userId = req.user ? req.user._id : null;

    const query = await userQueryServices.saveUserQuery({
      name,
      email,
      subject,
      message,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
      data: query,
    });
  } catch (err) {
    console.error("Error creating user query:", err);
    res.status(500).json({
      success: false,
      message:
        "Something went wrong while submitting your query. Please try again.",
    });
  }
};

// Get all queries (admin only)
const getAllQueries = async (req, res) => {
  try {
    const queries = await userQueryServices.getAllQueries();
    res.status(200).json({
      success: true,
      data: queries,
    });
  } catch (err) {
    console.error("Error fetching queries:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch queries.",
    });
  }
};

// Update query status (admin only)
const updateQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "responded", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: pending, responded, or closed",
      });
    }

    const query = await userQueryServices.updateQueryStatus(id, status);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Query status updated successfully",
      data: query,
    });
  } catch (err) {
    console.error("Error updating query status:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update query status.",
    });
  }
};

// Delete a query (admin only)
const deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;

    const query = await userQueryServices.deleteQuery(id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Query deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting query:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete query.",
    });
  }
};

export { createUserQuery, getAllQueries, updateQueryStatus, deleteQuery };
