import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import OtpModel from '../Models/otp.Model.js';
import userModel from '../Models/user.Model.js';
import jwt from 'jsonwebtoken';
import supportUserModel from '../Models/support.Model-temp.js';
import * as UserServices from '../services/User.Services.js';
import e from 'cors';
const JWT_SECRET = process.env.JWT_SECRET;
const saltrounds = 10;

const SendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
          return res.status(400).json({ message: "Email is required" });
        }
        const result = await UserServices.verifyEmailServices(email);
        return res.status(200).json({ message: "OTP sent successfully", email:result.email});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
          return res
            .status(400)
            .json({ message: "Email and OTP are required" });
        }

        const result = await UserServices.verifyOtpServices(email, otp);
        return res.status(200).json({ message: result.message, email: result.email});
    } catch (err) {
        return res.status(400).json({ error:err.message });
    }
};

//signup user
const registerUser = async (req, res) => {
    try {
        const userData = req.body;
        const { user, Token} = await UserServices.registerUserServices(userData);
        return res.status(201).json({ message: "User registered successfully", user, Token});
    }catch (error) {
        return res.status(400).json({ error });
    }
};

// login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await UserServices.loginUserServices(email, password);
        return res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

// get user details
const getUserDetails = async (req, res) => {
    try {
         const jwt = req.headers.authorization?.split(" ")[1];
         if (!jwt) {
           return res.status(404).send({ error: "token not found" });
         }
         const user = await UserServices.getUserProfileByToken(jwt);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error in getUserDetails:', error);
        res.status(500).json({ message: "Server error", error });
    }
};

// update user details
const updateUserDetails = async (req, res) => {
    const userId = req.params.id;
    const { username, email } = req.body;
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error in updateUserDetails:', error);
        res.status(500).json({ message: "Server error", error });
    }
};

// delete user
const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        await userModel.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(500).json({ message: "Server error", error });
    }
};

// update user password
const updateUserPassword = async (req, res) => {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await userModel.findById(userId);
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, saltrounds);
        user.password = hashedNewPassword;
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error('Error in updateUserPassword:', error);
        res.status(500).json({ message: "Server error", error });
    }
};

// support user
const supportUser = async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        const SupportUser = new supportUserModel({ name, email, subject, message });
        await SupportUser.save();
        res.status(200).json({ message: "Support request submitted successfully" });
    } catch (error) {
        console.error('Error in supportUser:', error);
        res.status(500).json({ message: "Server error", error });
    }
};

const getAllUsers = async (req, res) => {
  try {
    const { pageNumber, pageSize } = req.query;

    const result = await UserServices.getAllUsers({ pageNumber, pageSize });

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const requestResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const result = await UserServices.sendResetOtpService(email);
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
    await UserServices.verifyOtpServices(email, otp);

    // reset password
    const result = await UserServices.resetPasswordService(email, newPassword);
    return res.status(200).json({ message: result.message });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export {
    SendOtp,
    verifyOtp,
    registerUser,
    loginUser,
    getUserDetails,
    updateUserDetails,
    deleteUser,
    updateUserPassword,
    supportUser,
    getAllUsers,
    requestResetOtp,
    resetPassword,
};