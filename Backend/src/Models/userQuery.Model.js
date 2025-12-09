import mongoose from "mongoose";

const userQuerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const UserQuery = mongoose.model("userQuery", userQuerySchema)

export default UserQuery