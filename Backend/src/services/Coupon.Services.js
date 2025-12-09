import Coupon from "../Models/coupon.Model.js";
import couponModel from "../Models/coupon.Model.js";
import CouponUsage from "../Models/coupon.Usage.Model.js";
import Order from "../Models/Order.Model.js";

const createCoupon = async (couponData) => {
    const existing = await couponModel.findOne({ code: couponData.code });
    if (existing) throw new Error("Coupon code already exists");

    const newCoupon = new couponModel(couponData);
    await newCoupon.save();
    return newCoupon;
};

const getAllCoupons = async () => {
    return await couponModel.find().sort({createdAt: -1});
};

const getAllCouponUsage = async () => {
    return await CouponUsage.find()
      .populate("user")
      .populate("order")
      .sort({ createdAt: -1 });
};

const applyCoupon = async (code, userId, orderId) => {
    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) throw new Error("Invalid coupon code");

    const currentDate = new Date();
    if (coupon.expiresAt && coupon.expiresAt < currentDate){
        throw new Error("Coupon has expired");
    }
    if (coupon.usageLimit && coupon.usedBy.length >= coupon.usageLimit) {
      throw new Error("Coupon usage limit reached");
    }
    if (coupon.usedBy.includes(userId)) {
      throw new Error("You have already used this coupon");
    }
    
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");
    
    if (coupon.minOrderAmount && order.totalDiscountedPrice < coupon.minOrderAmount){
        throw new Error(
          `Minimum order amount of ₹${coupon.minOrderAmount} required`
        );
    }
    let discountAmount = 0;
    if (coupon.discountType === "flat") {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === "percentage") {
      discountAmount = (coupon.discountValue / 100) * order.totalDiscountedPrice;
       if (
         coupon.maxDiscountAmount &&
         discountAmount > coupon.maxDiscountAmount
       ) {
         discountAmount = coupon.maxDiscountAmount;
       }
    }

    coupon.usedBy.push(userId);
    await coupon.save();

    const usage = new CouponUsage({
      code: coupon.code,
      user: userId,
      order: orderId,
      discountAmount,
    });
    await usage.save();

    return {
      success: true,
      discountAmount,
      message: `Coupon "${code}" applied successfully`,
    };
};

const deleteCoupon = async (Id) => {
    try{
        const deletedCoupon = await Coupon.findByIdAndDelete(Id);
        if (!deletedCoupon) throw new Error("Coupon deleted or not found");
        return { success: true, message: "Coupon deleted successfully" , deletedCoupon};
    }catch(error){
        throw new Error("Failed to delete coupon",error.message);
    }
};

const updateCoupon = async (updatedData, id) => {
  const existing = await Coupon.findById(id);
  if (!existing) throw new Error("Coupon not found");

  Object.assign(existing, updatedData);
  await existing.save();

  return {
    success: true,
    message: "Coupon updated successfully",
    updatedCoupon: existing,
  };
};

export {
    createCoupon,
    getAllCoupons,
    getAllCouponUsage,
    applyCoupon,
    deleteCoupon,
    updateCoupon,
};