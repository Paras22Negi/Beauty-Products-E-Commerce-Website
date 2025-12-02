import Address from "../Models/Address.Model.js";
import Order from "../Models/Order.Model.js";
import OrderItem from "../Models/OrderItem.Model.js";
import cartService from "./Cart.Services.js";
import CartItem from "../Models/cartItem.Model.js";
import mongoose from "mongoose";
import sendOrderConfirmationEmail from "../config/mailer.js";
import User from "../Models/user.Model.js";
import Product from "../Models/Product.Model.js";


const createOrder = async (userId, req) => {
    let address;

    // Address setup
    if (shippAddress._id){
        address = await Address.findById(shippAddress._id);
    } else{
        address = new Address(shippAddress);
        address.user = user;
        await address.save();
        user.addresses.push(address);
        await user.save();
    }

    // Get cart & items
    const cart = await cartService.findUserCart(user._id);
    const orderItems = [];

    for (const item of cart.cartItems) {
        const orderItem = new OrderItem({
            price: item.price,
            product: item.product,
            quantity: item.quantity,
            size: item.size,
            userId: item.userId,
            discountedPrice: item.discountedPrice,
        });
        const createOrderItem = await orderItem.save();
        orderItems.push(createOrderItem);
    }

    // Super Coin Handling
    const dbUser = await User.findById(userId);
    if (!dbUser){
        throw new Error("User not found");
    }
    if (usedSuperCoins > 0) {
      if (dbUser.superCoins < usedSuperCoins) {
        throw new Error("Insufficient Super Coins");
      }
      dbUser.superCoins -= usedSuperCoins;
      await dbUser.save();
    }

    const discountFromCoins = usedSuperCoins * 1;

    // coupon handling
    const couponCode = cart?.couponCode || null;
    const couponDiscount = cart?.couponDiscount || 0;

    // Final price after all discounts
    const finalPriceAfterCoinsAndCoupon = Math.max(
      cart.totalDiscountedPrice - discountFromCoins - couponDiscount,
      0
    );

    // Create Order
    const createdOrder = new Order({
      user,
      orderItems,
      totalPrice: cart.totalPrice,
      totalDiscountedPrice: finalPriceAfterCoinsAndCoupon,
      discounte: cart.discounte,
      totalItem: cart.totalItem,
      shippingAddress: address,
      usedSuperCoins,
      couponCode,
      couponDiscount,
      orderDate: new Date(),
      orderStatus: "PENDING",
      paymentDetails: { paymentStatus: "PENDING" },
      createdAt: new Date(),
    });

    return await createdOrder.save();
}

const placedOrder = async(orderId, paymentMeta = {}) => {
    const order = await findOrderById(orderId);
    if (!order) throw new Error("Order not found");

    // ✅ Apply payment meta if provided
    if (paymentMeta.paymentId)
      order.paymentDetails.paymentId = paymentMeta.paymentId;
    if (paymentMeta.method)
      order.paymentDetails.paymentMethod = paymentMeta.method;
    if (paymentMeta.transactionId)
      order.paymentDetails.transactionId = paymentMeta.transactionId;

    order.paymentDetails.paymentStatus = "COMPLETED";
    order.statusUpdatedAt = new Date();
    order.orderStatus = "CONFIRMED";

    const updatedOrder = await order.save();

    // ✅ Clear cart items after payment success
    const productIds = order.orderItems.map((item) => item.product._id);
    await CartItem.deleteMany({
      userId: order.user._id,
      product: { $in: productIds },
    });

    // ✅ Send order confirmation email
    if (updatedOrder?.user?.email) {
      await sendOrderConfirmationEmail(updatedOrder.user.email, updatedOrder);
    }

    return updatedOrder;
}


const confirmedOrder = async (orderId) => {
    const order = await findOrderById(orderId);
    order.orderStatus = "CONFIRMED";
    order.statusUpdatedAt = new Date();
    return await order.save();
}

const shipOrder = async (orderId) => {
    const order = await findOrderById(orderId);
    order.orderStatus = "SHIPPED";
    order.statusUpdatedAt = new Date();
    return await order.save();
}

const outForDelivery = async (orderId) => {
    const order = await findOrderById(orderId);
    if (!order) throw new Error("Order not found");
    order.orderStatus = "OUT_FOR_DELIVERY";
    order.statusUpdatedAt = new Date();
    return await order.save();
}

const deliveredOrder = async (orderId) => {
    const order = await findOrderById(orderId);
    if (!order) throw new Error("Order not found");
    order.orderStatus = "DELIVERED";
    order.statusUpdatedAt = new Date();
    await order.save();

    // Reward Super Coins after delivery
    console.log("Reward Super Coins to:", order.user?._id, order.user?.email);

    try{
        await rewardeSuperCoins(order.user._id, order._id);
    }catch(error){
        console.error("⚠️ Failed to reward Super Coins:", error.message);
    }
    const lowStockAlerts = [];

    for (const item of order.orderItems){
        const product = await Product.findById(item.product._id);
        if (!product) continue;
        
        const sizeToUpdate = product.sizes.find((size) => size.name === item.size);
        if (!sizeToUpdate) {
            sizeToUpdate.quantity -= item.quantity;
            if (sizeToUpdate.quantity < 0) sizeToUpdate.quantity = 0;

            if (sizeToUpdate.quantity < 2) {
              lowStockAlerts.push({
                productId: product._id,
                title: product.title,
                size: sizeToUpdate.name,
                remaining: sizeToUpdate.quantity,
              });
            }
        }
        await product.save();
    }
    return {
      message: "Order marked as delivered and super coins rewarded",
      lowStockAlerts,
    };
}

const cancelledOrder = async (orderId) => {
  const order = await findOrderById(orderId);
  order.orderStatus = "CANCELLED";
  order.statusUpdatedAt = new Date();
  return await order.save();
};

const returnOrder = async (orderId, reason = "", description = "", imageUrls = []) => {
  const order = await findOrderById(orderId);
  if (!order) throw new Error("Order not found with ID: " + orderId);

  if (order.orderStatus !== "DELIVERED") {
    throw new Error("Only delivered orders can be returned.");
  }

  order.orderStatus = "RETURNED_REQUESTED";
  order.statusUpdatedAt = new Date();
  order.returnRequestedAt = new Date();

  if (reason) order.returnReason = reason;
  if (description) order.returnDescription = description;
  if (imageUrls.length > 0) order.returnImages = imageUrls;

  const updatedOrder = await order.save();
  return updatedOrder;
};

const approveReturnByAdmin = async (orderId, status, adminNote, rejectionMessage, returnTime) => {
    const order = await findOrderById(orderId);
    if (!order) throw new Error("Order not found with ID: " + orderId);

    if (order.orderStatus !== "RETURNED_REQUESTED") {
      throw new Error("Only orders with return request can be approved.");
    }
    if (status === "RETURNED_APPROVED") {
      order.orderStatus = "RETURNED";
      order.returnApprovedAt = new Date();
      order.returnTime = returnTime;
    }else if (status === "RETURNED_REJECTED") {
      order.orderStatus = "RETURNED_REJECTED";
      order.returnRejectedAt = new Date();
      order.rejectionMessage = rejectionMessage || "";
    }else {
      throw new Error("Invalid return status.");
    }

    order.statusUpdatedAt = new Date();
    // save this field
    order.adminNote = adminNote;
    order.statusUpdatedAt = new Date();

    const updatedOrder = await order.save();
    return updatedOrder;
};

const findOrderById = async (orderId) => {
    console.log("🔍 [findOrderById] Searching for Order with ID:", orderId);

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.log("❌ Invalid orderId format:", orderId);
      return null;
    }
    try{
        const order = await Order.findById(orderId)
          .populate("user")
          .populate({ path: "orderItems", populate: { path: "product" } })
          .populate("shippingAddress");

        if (!order) {
            console.log("❌ Order not found with ID:", orderId);
        }else{
            console.log("✅ Order found:", order._id);
        }
        return order;
    }catch(error){
        console.error("🔥 Error in findOrderById:", error.message);
        throw error;
    }
}

const usersOrderHistory = async (userId) => {
    const order = await Order.find({ user:userId, "paymentDetails.paymentStatus":"COMPLETED"})
    .populate({ path: "orderItems", populate: { path: "product" },})
    .sort({ createdAt: -1 })
    .lean();
    return order;
}

const getAllOrders = async (
  page = 1,
  pageSize = 10,
  status = "",
  sort = "Newest"
) => {
  const skip = (page - 1) * pageSize;

  const filter = { "paymentDetails.paymentStatus": "COMPLETED" };
  if (status) filter.orderStatus = status;

  const sortOption = sort === "Oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const query = Order.find(filter)
    .populate("user")
    .populate("shippingAddress")
    .populate({
      path: "orderItems",
      populate: { path: "product" },
    })
    .sort(sortOption);

  const totalOrders = await Order.countDocuments(filter);
  const totalPages = Math.ceil(totalOrders / pageSize);

  const orders = await query.skip(skip).limit(pageSize).lean();

  return {
    content: orders,
    currentPage: page,
    totalPages,
    totalOrders,
  };
};

const deleteOrder = async (orderId) => {
    const order = await findOrderById(orderId);
    if (!order) throw new Error("order not found with id " + orderId);

    await Order.findByIdAndDelete(orderId);
}



export {
    createOrder,
    findOrderById,
    usersOrderHistory,
    getAllOrders,
    placedOrder,
    confirmedOrder,
    shipOrder,
    outForDelivery,
    deliveredOrder,
    cancelledOrder,
    returnOrder,
    approveReturnByAdmin,
    deleteOrder,
}