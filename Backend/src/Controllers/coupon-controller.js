import * as CouponServices from "../services/Coupon-Services.js";

const createCoupon = async (req, res) => {
    try{
        const created = await CouponServices.createCoupon(req.body);
        res.status(200).json({
            success:true,
            message:"Coupon created",
            coupon: created,
        });
    } catch(err) {
        res.status(400).json({success: false, message: err.message});
    }
}

const getAllCoupons = async (req, res) => {
    try{
        const allCoupons = await CouponServices.getAllCoupons();
        res.status(200).json({success:true, coupons: allCoupons});
    }catch(err){
        res.status(500).json({success: false, message: err.message});
    }
}

const getCouponUsage = async (req, res) => {
    try{
        const usages = await CouponServices.getAllCouponUsage();
        res.status(200).json({success:true, usageHistory: usages})
    }catch(err){
        res.status(500).json({success:false, message: err.message});
    }
};

const applyCoupon = async (req, res) => {
    const {code, userId, orderId} = req.body;
    try{
        const result = await CouponServices.applyCoupon(code, userId, orderId);
        res.status(200).json({success:true, ...result});
    }catch(err){
        res.status(500).json({success:false, message: err.message});
    }
}

const deleteCoupon = async (req, res) => {
    const { id } = req.body;
    try {
      const deletedCoupon = await CouponServices.deleteCoupon(id);
      res.status(200).json({
        success: true,
        message: "Coupon deleted successfully",
        deletedCoupon,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
}

const updateCoupon = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      const result = await CouponServices.updateCoupon(updatedData, id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
}

export {
    createCoupon,
    getAllCoupons,
    getCouponUsage,
    applyCoupon,
    deleteCoupon,
    updateCoupon
}
