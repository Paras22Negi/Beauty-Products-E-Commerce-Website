import * as PaymentServices from "../services/payment.Service.js";
import PaymentInformation from "../models/paymentInformation.model.js";

const createPaymentLink = async (req, res) => {
    try {
      const paymentLink = await PaymentServices.createPaymentLink(req.params.id);
      return res.status(200).json(paymentLink);
    } catch (error) {
      return res.status(500).json({message:error.message});
    }
}

const updatePaymentInformation = async (req, res) => {
    try {
      await PaymentServices.updatePaymentInformation(req.query);
      return res
        .status(200)
        .json({ message: "payment information updated", status: true });
    } catch (error) {
      return res.status(500).json({message:error.message});
    }
}

const getUserPaymentHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orderId = req.query.orderId;
        const history = await PaymentServices.getUserPaymentHistory(userId, orderId);
        return res.status(200).json(history);
    } catch (error) {
        console.error("Payment history controller error:", error);
        return res.status(500).json({ message: error.message });
    }
};

export {
    createPaymentLink,
    updatePaymentInformation,
    getUserPaymentHistory,
}
