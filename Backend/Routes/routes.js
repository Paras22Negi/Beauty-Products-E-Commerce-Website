import express from 'express';
const Router = express.Router();
const {SendOtp, verifyOtp} = require('./controllers/otpController');

// Send OTP Route
Router.post('/send-otp', SendOtp);

// Verify OTP Route
Router.post('/verify-otp', verifyOtp);