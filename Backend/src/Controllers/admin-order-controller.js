import * as OrderService from "../services/Order.Services.js";
import cloudinary from "../config/cloudinary.js";

const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status;
    const sort = req.query.sort;
    const orders = await OrderService.getAllOrders(
      page,
      pageSize,
      status,
      sort
    );
    res.status(200).json(orders);
  } catch (error) {
    console.error("Admin Order Fetch Error:", error.message);
    res.status(500).send({ error: "Something went wrong" });
  }
};

const confirmedOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const Order = await OrderService.confirmedOrder(orderId);
    res.status(200).json(Order);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const shipOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const Order = await OrderService.shipOrder(orderId);
    res.status(200).json(Order);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const outForDelivery = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const Order = await OrderService.outForDelivery(orderId);
    res.status(200).json(Order);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const deliverOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const Order = await OrderService.deliveredOrder(orderId);
    res.status(200).json(Order);
  } catch (error) {
    console.error("Deliver Order Error:", error.message);
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong" });
  }
};

const cancelledOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const Order = await OrderService.cancelledOrder(orderId);
    res.status(200).json(Order);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const Order = await OrderService.deleteOrder(orderId);
    res
      .status(202)
      .json({ message: "Order Deleted Successfully", success: true });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const returnOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { reason, description } = req.body || {};
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((files) =>
        cloudinary.uploader.upload_stream(
          {
            folder: "returns",
            resource_type: "image",
          },
          (error, result) => {
            if (error) throw error;
            return result.secure_url;
          }
        )
      );

      // or use 'upload' with 'file.buffer'
      const results = await Promise.all(
        req.files.map((file) =>
          cloudinary.uploader.upload_stream_promise
            ? cloudinary.uploader.upload_stream_promise(
                { folder: "returns" },
                file.buffer
              )
            : cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString(
                  "base64"
                )}`,
                {
                  folder: "returns",
                }
              )
        )
      );
      imageUrls = results.map((result) => result.secure_url);
    }
    const Order = await OrderService.returnOrder(
      orderId,
      reason,
      description,
      imageUrls
    );
    res.status(200).json(Order);
  } catch (error) {
    console.error("Return Order Error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const approveReturnOrder = async (req, res) => {
  try {
    const { status, adminNote, rejectionMessage, returnTime } = req.body;
    const orderId = req.params.orderId;
    const updatedOrder = await OrderService.approveReturnByAdmin(
      orderId,
      status,
      adminNote,
      rejectionMessage,
      returnTime
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Approve Return Order Error:", error.message);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};

const getAdminDashboardOverview = async (req, res) => {
  try {
    const overview = await OrderService.getAdminDashboardOverview();
    return res.status(200).json({ success: true, data: overview });
  } catch (error) {
    console.error("📉 Error getting dashboard overview:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getAllOrders,
  confirmedOrder,
  shipOrder,
  deliverOrder,
  cancelledOrder,
  deleteOrder,
  getAdminDashboardOverview,
  returnOrder,
  approveReturnOrder,
  outForDelivery,
};
