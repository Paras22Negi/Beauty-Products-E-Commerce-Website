import mongoose from "mongoose";

const couponUsageSchema = new mongoose.Schema({
  code: { type: String, required: true }, // Store actual code used
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "orders",
    required: true,
  },
  discountAmount: {
    type: Number,
    required: true,
  },
  usedAt: {
    type: Date,
    default: Date.now,
  },
});

const CouponUsage = mongoose.model("couponUsage", couponUsageSchema);

export default CouponUsage;