import Admin from "../Models/admin.Model.js";
import User from "../Models/user.Model.js";
import bcrypt from "bcrypt";
import * as jwtProvider from "../config/jwtProvider.js";

/**
 * Admin Login Service
 *
 * Flow:
 * 1. Check if any admin exists in Admin collection
 * 2. If no admin exists:
 *    - Check Users collection for a user with role "admin" matching the email
 *    - If found and password matches, copy that admin to Admin collection
 * 3. If admin exists in Admin collection:
 *    - Validate against Admin collection credentials
 */
const adminLogin = async (email, password) => {
  // Check if any admin exists in the Admin collection
  const adminCount = await Admin.countDocuments();

  if (adminCount === 0) {
    // No admin in Admin collection - check Users collection for admin role user
    console.log(
      "No admin in Admin collection, checking Users for admin role..."
    );

    const adminUser = await User.findOne({ email, role: "admin" });

    if (!adminUser) {
      throw new Error("Access denied. Only administrators can login here.");
    }

    // Verify password against User collection
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // First admin login - save to Admin collection
    const newAdmin = await Admin.create({
      email: adminUser.email,
      password: adminUser.password, // Already hashed
      name:
        `${adminUser.firstName || ""} ${adminUser.lastName || ""}`.trim() ||
        adminUser.username,
      userId: adminUser._id,
      lastLogin: new Date(),
    });

    console.log("First admin saved to Admin collection:", newAdmin.email);

    // Generate JWT
    const jwt = jwtProvider.generateToken(
      adminUser.username,
      adminUser._id,
      adminUser.email
    );

    return {
      jwt,
      user: {
        _id: adminUser._id,
        email: adminUser.email,
        name: newAdmin.name,
        role: "admin",
      },
      message: "Admin login successful - credentials saved",
    };
  }

  // Admin exists in Admin collection - validate against it
  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new Error("Access denied. This email is not registered as an admin.");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  // Update last login
  admin.lastLogin = new Date();
  await admin.save();

  // Generate JWT
  const jwt = jwtProvider.generateToken(admin.name, admin.userId, admin.email);

  return {
    jwt,
    user: {
      _id: admin.userId,
      email: admin.email,
      name: admin.name,
      role: "admin",
    },
    message: "Admin login successful",
  };
};

/**
 * Get admin profile
 */
const getAdminProfile = async (adminId) => {
  const admin = await Admin.findOne({ userId: adminId });
  if (!admin) {
    throw new Error("Admin not found");
  }
  return {
    _id: admin.userId,
    email: admin.email,
    name: admin.name,
    role: "admin",
    lastLogin: admin.lastLogin,
  };
};

export { adminLogin, getAdminProfile };
