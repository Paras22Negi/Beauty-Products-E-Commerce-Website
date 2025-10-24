const express = require('express');
const nodemailer = require('nodemailer');
require("dotenv").config();
const bcrypt = require('bcrypt');
const saltrounds = 10;
const OtpModel = require('../Models/otp');
const userModel = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;


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


module.exports = { SendOtp, verifyOtp, registerUser, loginUser, getUserDetails };

