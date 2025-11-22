import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./user.Model.js";
dotenv.config();

const supportUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

const SupportUser = mongoose.model('SupportUser', supportUserSchema);

export default SupportUser;