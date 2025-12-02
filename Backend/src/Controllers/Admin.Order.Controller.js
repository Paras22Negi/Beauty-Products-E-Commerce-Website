import * as OrderService from "../services/Order.Services.js";

const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error in getAllOrders:', error);
        res.status(500).json({ message: "Server error", error });
    }
};

const confirmedOrder = async (req, res) => {
    try {
        const { orderId } = req.params.orderId;
        const Order = await OrderService.confirmedOrder(orderId);
        res.status(200).json(Order);
    } catch (error) {
        console.error('Error in confirmedOrder:', error);
        res.status(500).json({ message: "Server error", error });
    }
};

const shipOrder = async (req, res) => {
    try {
        const { orderId } = req.params.orderId;
        const Order = await OrderService.shipOrder(orderId);
        res.status(200).json(Order);
    } catch (error) {
        console.error('Error in shipOrder:', error);
        res.status(500).json({ message: "Server error", error });
    }
};

const deliverOrder = async (req, res) => {
    try {
        const { orderId } = req.params.orderId;
        const Order = await OrderService.deliveredOrder(orderId);
        res.status(200).json(Order);
    } catch (error) {
        console.error('Error in deliveredOrder:', error);
        res.status(500).json({ message: "Server error", error });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params.orderId;
        const Order = await OrderService.cancelOrder(orderId);
        res.status(200).json(Order);
    } catch (error) {
        console.error('Error in cancelOrder:', error);
        res.status(500).json({ message: "Server error", error });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params.orderId;
        const Order = await OrderService.deleteOrder(orderId);
        res.status(200).json(Order);
    } catch (error) {
        console.error('Error in deleteOrder:', error);
        res.status(500).json({ message: "Server error", error });
    }
};

export { getAllOrders, confirmedOrder, shipOrder, deliverOrder, cancelOrder, deleteOrder };