const express = require('express');
const Router = express.Router();
const {SendOtp, verifyOtp, getUserDetails, registerUser, loginUser, updateUserDetails, deleteUser, updateUserPassword, supportUser} = require('../Controllers/appControllers');

// Send OTP Route
Router.post('/send-otp', SendOtp);

// Verify OTP Route
Router.post('/verify-otp', verifyOtp);

// Register User Route
Router.post('/signup', registerUser);

// Login User Route
Router.post('/login', loginUser);

// Get User Details Route
Router.get('/user/:id', getUserDetails);

// Update User Details Route
Router.put('/updateUser/:id', updateUserDetails);

// Delete User Route
Router.delete('/deleteUser/:id', deleteUser);

// Update User Password Route
Router.put('/user/:id/password', updateUserPassword);

// Support User Route
Router.post('/support', supportUser);

module.exports = Router;