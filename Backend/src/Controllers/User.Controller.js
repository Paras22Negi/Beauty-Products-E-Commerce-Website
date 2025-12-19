// controllers/auth.controller.js

import * as userServices from "../services/User.Services.js";

const register = async (req, res) => {
  try {
    const userData = req.body;
    const { user, token } = await userServices.registerUser(userData);
    return res
      .status(201)
      .json({ user, token, message: "Registered successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    console.log("req data :", req.body);
    const { email, password } = req.body;
    const { user, token } = await userServices.login({ email, password });
    return res.status(200).json({ user, token, message: "Login successful" });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

const requestVerifyOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const result = await userServices.sendVerifyOtpService(email);
    return res
      .status(200)
      .json({ message: result.message, email: result.email });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const confirmVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ error: "Email and otp are required" });

    const result = await userServices.confirmOtpService(email, otp);
    return res
      .status(200)
      .json({ message: result.message, email: result.email });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const requestResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const result = await userServices.sendResetOtpService(email);
    return res
      .status(200)
      .json({ message: result.message, email: result.email });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res
        .status(400)
        .json({ error: "email, otp and newPassword are required" });

    // confirm OTP first
    await userServices.confirmOtpService(email, otp);

    // reset password
    const result = await userServices.resetPasswordService(email, newPassword);
    return res.status(200).json({ message: result.message });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const jwt = req.headers.authorization?.split(" ")[1];

    if (!jwt) {
      return res.status(404).send({ error: "token not found" });
    }
    const user = await userServices.getUserProfileByToken(jwt);

    return res.status(200).send(user);
  } catch (error) {
    console.log("error from controller - ", error);
    return res.status(500).send({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { pageNumber, pageSize } = req.query;

    const result = await userServices.getAllUsers({ pageNumber, pageSize });

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const { firstName, lastName, mobile } = req.body;

    const updatedUser = await userServices.updateUserProfile(user._id, {
      firstName,
      lastName,
      mobile,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("error updating profile:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// Add address for user
const addAddress = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const addressData = req.body;

    const address = await userServices.addUserAddress(user._id, addressData);

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    console.log("error adding address:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// Get user addresses
const getAddresses = async (req, res) => {
  try {
    const user = req.user; // from auth middleware

    const addresses = await userServices.getUserAddresses(user._id);

    return res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.log("error getting addresses:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export {
  getUserProfile,
  getAllUsers,
  register,
  login,
  requestVerifyOtp,
  confirmVerifyOtp,
  requestResetOtp,
  resetPassword,
  updateProfile,
  addAddress,
  getAddresses,
};
