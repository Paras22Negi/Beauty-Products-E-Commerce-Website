import mongoose from "mongoose";

const userQuerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "responded", "closed"],
      default: "pending",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

const UserQuery = mongoose.model("userQuery", userQuerySchema);

export default UserQuery;
