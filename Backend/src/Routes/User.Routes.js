import express from 'express';
const Router = express.Router();
import * as UserControllers from '../Controllers/User.Controllers.js';

// Send OTP Route
Router.post('/send-otp', UserControllers.SendOtp);

// Verify OTP Route
Router.post('/verify-otp', UserControllers.verifyOtp);

// Register User Route
Router.post('/signup', UserControllers.registerUser);

// Login User Route
Router.post('/login', UserControllers.loginUser);

// Get User Details Route
Router.get('/user/:id', UserControllers.getUserDetails);

// Update User Details Route
Router.put('/updateUser/:id', UserControllers.updateUserDetails);

// Delete User Route
Router.delete('/deleteUser/:id', UserControllers.deleteUser);

// Update User Password Route
Router.put('/user/:id/password', UserControllers.updateUserPassword);

// Support User Route
Router.post('/support', UserControllers.supportUser);

// Request Reset OTP Route
Router.post("/request-reset-otp", UserControllers.requestResetOtp);

// Reset Password Route
Router.post("/reset-password", UserControllers.resetPassword);

export default Router;