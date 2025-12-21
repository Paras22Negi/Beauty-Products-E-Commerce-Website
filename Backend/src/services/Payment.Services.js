import razorpay from "../config/razorpayClient.js";
import PaymentInformation from "../Models/payment.information.js";
import User from "../Models/user.Model.js";
import * as orderService from "./Order.Services.js";

const createPaymentLink = async (
  orderId,
  usedSuperCoins = 0,
  couponDiscount = 0
) => {
  try {
    console.log(
      "Debugging PaymentService: orderService keys:",
      Object.keys(orderService)
    );
    const order = await orderService.findOrderById(orderId);
    if (!order) throw new Error("Order not found");
    const existingPayment = await PaymentInformation.findOne({
      order: order._id,
    });
    if (existingPayment)
      throw new Error("Payment already exists for this order");
    const user = order.user;
    if (!user) throw new Error("User not found for this order");

    // Calculate final amount
    const discountFromCoins = usedSuperCoins * 1;
    const basePrice = order.totalDiscountedPrice || 0;
    const finalAmount = Math.max(
      basePrice - discountFromCoins - couponDiscount,
      0
    );

    // Debug logs
    console.log("🧾 Order Summary:");
    console.log("Base Price:", basePrice);
    console.log("Used Super Coins:", usedSuperCoins, "→ ₹", discountFromCoins);
    console.log("Coupon Discount:", couponDiscount);
    console.log("➡️ Final Payable Amount:", finalAmount);

    // Save to order
    order.usedSuperCoins = usedSuperCoins;
    order.couponDiscount = couponDiscount;
    await order.save();

    const paymentLinkRequest = {
      amount: finalAmount * 100,
      currency: "INR",
      customer: {
        name:
          ((user.firstName || "") + " " + (user.lastName || "")).trim() ||
          "Guest User",
        email: user.email,
        contact: order.shippingAddress?.mobile || user.mobile || "9876543210",
      },
      notify: { sms: true, email: true },
      reminder_enable: true,
      callback_url: `${
        process.env.FRONTEND_URL1?.replace(/\/$/, "") ||
        process.env.FRONTEND_URL2?.replace(/\/$/, "")
      }/payment/${orderId}`,
      // callback_url: `http://fluteon.com/payment/${orderId}`,
      callback_method: "get",
    };

    // Razorpay Request Preview
    console.log("Razorpay Payment Link Request:", paymentLinkRequest);
    const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);
    console.log("Razorpay Payment Link Created:", paymentLink.short_url);

    return {
      paymentLinkId: paymentLink.id,
      paymentLinkUrl: paymentLink.short_url,
    };
  } catch (error) {
    console.error("❌ Error creating payment link:", error);
    throw new Error(
      error.error?.description || error.message || "Razorpay Error"
    );
  }
};

// by gpt
const updatePaymentInformation = async (reqData) => {
  try {
    const paymentId = reqData.payment_id;
    const orderId = reqData.order_id;
    const order = await orderService.findOrderById(orderId);
    if (!order) throw new Error("Order not found");

    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status === "captured") {
      // check if payment already exists
      const existingPayment = await PaymentInformation.findOne({
        order: order._id,
      });
      if (existingPayment) {
        return {
          message: "Payment info already recorded",
          orderId: order._id,
          paymentId: existingPayment._id,
        };
      }

      // Deduct usedSuperCoins now
      const user = order.user;
      if (!user) throw new Error("User not found");

      if (order.usedSuperCoins && order.usedSuperCoins > 0) {
        if (user.superCoins < order.usedSuperCoins) {
          throw new Error("Not enough super coins");
        }
        user.superCoins -= order.usedSuperCoins;
        await user.save();
        console.log(
          `✅ Deducted ${order.usedSuperCoins} Super Coins from user ${user._id}`
        );
      }

      // saved payment info
      const paymentInfo = new PaymentInformation({
        user: user.id,
        userSnapshot: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          mobile: user.mobile,
        },
        order: order._id,
        paymentId,
        status: "COMPLETED",
        amount: payment.amount / 100,
        paidAt: new Date(),
      });
      await paymentInfo.save();

      user.paymentInformation.push(paymentInfo._id);
      await user.save();

      // update order status with payment details
      await orderService.placeOrder(orderId, {
        paymentId,
        method: payment.method,
        transactionId: payment.acquirer_data?.bank_transaction_id || "",
      });

      // Fetch updated order with populations
      const updatedOrder = await orderService.findOrderById(orderId);

      return {
        message: "order placed & payment recorded",
        order: updatedOrder,
        paymentId: paymentInfo._id,
      };
    } else {
      throw new Error("Payment not captured");
    }
  } catch (error) {
    console.error("Error in updatePaymentInformation:", error);
    throw new Error(error.message);
  }
};

const getUserPaymentInformation = async (userId, orderId = null) => {
  try {
    const query = { user: userId };
    if (orderId) query.order = orderId;
    const history = await PaymentInformation.find(query)
      .populate([
        {
          path: "order",
          model: "orders", // ✅ ensure this matches your Order model name
          populate: [
            {
              path: "user",
              model: "users", // ✅ ensure correct model name
            },
            {
              path: "orderItems",
              populate: {
                path: "product",
                model: "products", // ✅ ensure correct model name
              },
            },
          ],
        },
        {
          path: "user",
          model: "users",
        },
      ])
      .sort({ paidAt: -1 });

    return history;
  } catch (error) {
    console.error("Error in getUserPaymentInformation:", error);
    throw new Error(error.message);
  }
};

export {
  createPaymentLink,
  updatePaymentInformation,
  getUserPaymentInformation,
};
