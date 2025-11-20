import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import OtpModel from '../Models/otp.Model.js';
import userModel from '../Models/user.Model.js';
import jwt from 'jsonwebtoken';
import supportUserModel from '../Models/Support.Model.js';
const JWT_SECRET = process.env.JWT_SECRET;
const saltrounds = 10;

const SendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        // Send OTP email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code for MARS cosmetics is ${otp}`,
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({ message: "Failed to send OTP" });
            }
            const hashedOtp = bcrypt
              .hashSync(otp, saltrounds);
            // In a real application, store the OTP in a database or cache with an expiration time
            const newOtp = new OtpModel({ email, otp: hashedOtp });
            newOtp.save();
            return res.status(200).json({ message: "OTP sent successfully" });
        });
    } catch (error) {
        console.error('Error in SendOtp:', error);
        return res.status(500).json({ message: "Server error: ", error });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }
    try {
        const record = await OtpModel.findOne({ email }).sort({ createdAt: -1 });
        if (!record) {
            return res.status(400).json({ message: "No OTP record found for this email" });
        }
        const isOtpValid = await bcrypt.compare(otp.toString(), record.otp);
        if (!isOtpValid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        await OtpModel.findOneAndDelete({ email }).catch((err) => {
            console.error('Error deleting OTP record:', err);
        });
        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error('Error in verifyOtp:', error);
        return res.status(500).json({ message: "Server error", error });
    }
};

//signup user
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const hashPassword = await bcrypt.hash(password, saltrounds);
        const newUser = new userModel({ username, email, password: hashPassword });
        await newUser.save();
        console.log("signup success")
        return res.status(201).json({ message: "User registered successfully" });
    }catch (error) {
        console.error('Error in registerUser:', error);
        return res.status(500).json({ message: "Server error", error });
    }
};

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user._id, username: user.username, email: user.email}, JWT_SECRET, { expiresIn: '1h' });
        return res
          .status(200)
          .json({ message: "Login successful", token });
    } catch (error) {
        console.error('Error in loginUser:', error);
        return res.status(500).json({ message: "Server error", error });
    }
};

// get user details
const getUserDetails = async (req, res) => {
    const userId = req.params;
    try {
        const user = await userModel.findById(userId).select('-password');
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

export {
    SendOtp,
    verifyOtp,
    registerUser,
    loginUser,
    getUserDetails,
    updateUserDetails,
    deleteUser,
    updateUserPassword,
    supportUser
};