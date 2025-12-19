import * as adminService from "../services/Admin.Service.js";

/**
 * Admin Login Controller
 */
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await adminService.adminLogin(email, password);

    return res.status(200).json({
      success: true,
      jwt: result.jwt,
      user: result.user,
      message: result.message,
    });
  } catch (error) {
    console.error("Admin login error:", error.message);
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Admin Profile Controller
 */
const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user._id;
    const profile = await adminService.getAdminProfile(adminId);

    return res.status(200).json({
      success: true,
      ...profile,
    });
  } catch (error) {
    console.error("Get admin profile error:", error.message);
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export { adminLogin, getAdminProfile };
