import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const OtpSchema = new mongoose.Schema({
  // Add any configuration fields if needed
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // OTP expires in 5 minutes
});

const Otp = mongoose.model("otp", OtpSchema);

export default Otp;