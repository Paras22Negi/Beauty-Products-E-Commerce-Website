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
});

const SupportUser = mongoose.model('SupportUser', supportUserSchema);

export default SupportUser;