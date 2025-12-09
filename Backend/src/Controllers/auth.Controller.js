import userServices from "../services/User.Services.js";
import jwtProvider from "../config/jwtProvider.js";
import bcrypt from "bcrypt";
import CartServices from "../services/Cart.Service.js";

const registerUser = async (req, res) => {
  try {
    const user = await userServices.createUser(req.body);
    const jwt = jwtProvider.generateToken(user._id);
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
    const jwt = jwtProvider.generateToken(user._id);
    return res.status(200).json({ jwt, message: "login success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { registerUser, login };
