const express = require('express');
const Router = express.Router();
const {SendOtp, verifyOtp, getUserDetails, registerUser, loginUser} = require('../Controllers/appControllers');

// Send OTP Route
Router.post('/send-otp', SendOtp);

// Verify OTP Route
Router.post('/verify-otp', verifyOtp);

// Register User Route
Router.post('/signup', registerUser);

// Login User Route
Router.post('/login', loginUser);

// Get User Details Route
Router.get('/user', getUserDetails);

module.exports = Router;