import * as OrderServices from "../services/Order.Services.js";

const createOrder = async (req, res) => {
  const user = req.user;
  const { shippingAddress, usedSuperCoins = 0 } = req.body;
  try {
    const createdOrder = await OrderServices.createOrder(
      user,
      shippingAddress,
      usedSuperCoins
    );
    return res.status(201).json(createdOrder);
  } catch (error) {
    console.error("❌ Error in createOrder:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

const findOrderById = async (req, res) => {
  const user = req.user;
  // console.log("userr ",user,req.body)
  try {
    let order = await OrderServices.findOrderById(req.params.id);

    return res.status(201).send(order);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const OrderHistory = async (req, res) => {
  const user = req.user;
  try {
    let order = await OrderServices.usersOrderHistory(user._id);
    return res.status(201).send(order);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export { createOrder, findOrderById, OrderHistory };
