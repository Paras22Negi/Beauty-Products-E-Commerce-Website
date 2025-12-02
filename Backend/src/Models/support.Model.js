import mongoose from "mongoose";
import dotenv from "dotenv";
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
    ref: 'user',
  }
});

const SupportUser = mongoose.model('supportUser', supportUserSchema);

export default SupportUser;