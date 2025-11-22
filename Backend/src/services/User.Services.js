import bycrypt from 'bcrypt';
import user from "../Models/user.Model.js"
import Otp from "../Models/otp.Model.js"
import * as jwtProvider from '../config/jwtProvider.js';
import dotenv from 'dotenv';
dotenv.config();

const SALT_ROUNDS = 10;
const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 3;
const OTP_BLOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour

const generateOtp = () => {
  const firstDigit = Math.floor(Math.random() * 9) + 1; // 1-9
  const remaining = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0"); // 0000-9999
  return `${firstDigit}${remaining}`; // string of length 5
};

const getOtpHtmlTemplate = (otp, purpose = "verification") => {
  const appName = process.env.APP_NAME || "My App";
  const minutes = OTP_EXPIRY_MINUTES;
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; line-height:1.4; color:#111;">
      <h2 style="margin:0 0 8px 0;">${appName} — ${
    purpose === "reset" ? "Password Reset" : "Email Verification"
  }</h2>
      <p style="margin:0 0 16px 0;">Use the OTP below to ${
        purpose === "reset" ? "reset your password" : "verify your email"
      }. This code expires in ${minutes} minutes.</p>
      <div style="font-size:28px; font-weight:700; letter-spacing:2px; margin:12px 0; background:#f2f2f2; display:inline-block; padding:12px 18px; border-radius:6px;">
        ${otp}
      </div>
      <p style="margin-top:18px; color:#555; font-size:13px;">If you did not request this, please ignore this email.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:18px 0;">
      <small style="color:#888">${appName} • ${
    process.env.APP_URL || ""
  }</small>
    </div>
  `;
};


const sendOtpEmail = async (toEmail, otp, purpose = "verification") => {
  const from = process.env.EMAIL_USER || process.env.SMTP_USER;
  const subject =
    purpose === "reset"
      ? `${process.env.APP_NAME || "App"} — Password Reset OTP`
      : `${process.env.APP_NAME || "App"} — Email Verification OTP`;
  const html = getOtpHtmlTemplate(otp, purpose);

  const mailOptions = {
    from,
    to: toEmail,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

const verifyEmailServices = async (email) => {
  try {
    const normalizedEmail = String(email).toLowerCase();

    // Check if email already exists
    const existingUser = await user.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new Error("User exists with this email");
    }

    const now = new Date();
    const existingOtpRecord = await Otp.findOne({ email: normalizedEmail });
    
    // Check for blocking due to too many failed attempts
    if (existingOtpRecord && existingOtpRecord.blockedUntil && existingOtpRecord.blockedUntil > now) {
      throw new Error("Too many failed attempts. Please try again later.");
    }

    if (existingOtpRecord && existingOtpRecord.attempts >= OTP_MAX_ATTEMPTS) {
      const minutesSinceLast = (now - existingOtp.createdAt) / 1000 / 60;
      if (minutesSinceLast < 60) {
        existingOtp.blockedUntil = new Date(now.getTime() + OTP_BLOCK_DURATION_MS);
        await existingOtp.save();
        throw new Error("Too many OTP requests. Try again later.");
      }
    }
    const otp = generateOtp();
    const otpString = String(otp);
    const upsertObj = {
      otp: otpString,
      createdAt: now,
      attempts: (existingOtpRecord ? existingOtpRecord.attempts + 1 : 1),
      blockedUntil: null,
    };

    await Otp.findOneAndUpdate(
      { email: normalizedEmail },
      upsertObj,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send OTP email
    await sendOtpEmail(normalizedEmail, otpString, "verification");
    return { message: "OTP sent successfully", email: normalizedEmail };
  } catch (error) {
    throw new Error(error.message);
  }
};

const verifyOtpServices = async (email, otp) => {
  try {
    const normalizedEmail = String(email).toLowerCase();
    const otpEntry = await Otp.findOne({ email: normalizedEmail })

    if (!otpEntry) {
      throw new Error("No OTP record found for this email");
    }

    const now = new Date();
    const expiryTime = new Date(otpEntry.createdAt.getTime() + OTP_EXPIRY_MINUTES * 60000);

    if (now > expiryTime) {
      await Otp.deleteOne({ email: normalizedEmail });
      throw new Error("OTP has expired, please request a new one");
    }

    if (otpEntry.otp !== String(otp)) {
      otpEntry.attempts = (otpEntry.attempts || 0) + 1;
      if (otpEntry.attempts >= OTP_MAX_ATTEMPTS) {
        otpEntry.blockedUntil = new Date(now.getTime() + OTP_BLOCK_DURATION_MS);
      }
      await otpEntry.save();
      throw new Error("Invalid OTP, please try again.");
    }
    
    //success remove otp entry
    await Otp.deleteOne({ email: normalizedEmail });
    return { success: true, message: "Email verified successfully", email: normalizedEmail };
  } catch (error) {
    throw new Error(error.message);
  }
};

const registerUserServices = async (userData) => {
  try {
    const { username, email, password, role } = userData;

    if (!email || !password) {
      throw new Error("Email and password re required");
    }

    const normalizedEmail = String(email).toLowerCase();
    const existingUser = await user.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new Error("User exists with this email");
    }

    const hashedPassword = await bycrypt.hash(password, SALT_ROUNDS);
    const User = new user.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    const Token = jwtProvider.generateToken({ id: User._id });
    const userToReturn = user.toObject();
    delete userToReturn.password;

    return { user: userToReturn, Token };
  } catch (err) {
    throw new Error(err.message);
  }
};

const loginUserServices = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("Email and password required");
    }

    const normalizedEmail = String(email).toLowerCase();
    const User = await user.findOne({ email: normalizedEmail });
    if (!User) {
      throw new Error("User not found with this email");
    }

    const isPasswordValid = await bycrypt.compare(password, User.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const Token = jwtProvider.generateToken({ id: User._id });
    const userToReturn = User.toObject();
    delete userToReturn.password;

    return { user: userToReturn, Token };
  } catch (err) {
    throw new Error(err.message);
  }
};

export { verifyEmailServices, verifyOtpServices, registerUserServices, loginUserServices };