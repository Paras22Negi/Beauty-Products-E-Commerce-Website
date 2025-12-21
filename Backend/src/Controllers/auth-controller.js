import * as userServices from "../services/User.Services.js";
import * as jwtProvider from "../config/jwtProvider.js";
import bcrypt from "bcrypt";
import CartServices from "../services/Cart.Service.js";

const registerUser = async (req, res) => {
  try {
    const user = await userServices.createUser(req.body);
    const jwt = jwtProvider.generateToken(user.username, user._id, user.email);
    await CartServices.createCart(user);
    return res.status(201).json({ jwt, message: "register success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userServices.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found", email });
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const jwt = jwtProvider.generateToken(user.username, user._id, user.email);
    return res.status(200).json({ jwt, message: "login success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendOtp = async (req, res) => {
  try {
    const response = await userServices.verifyEmailService(req.body.email);
    res.json(response);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await userServices.confirmOtpService(email, otp);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const sendResetOtp = async (req, res) => {
  try {
    const response = await userServices.sendResetOtpService(req.body.email);
    res.json(response);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const response = await userServices.resetPasswordService(
      email,
      newPassword
    );
    res.json(response);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export { registerUser, login, sendOtp, verifyOtp, sendResetOtp, resetPassword };
