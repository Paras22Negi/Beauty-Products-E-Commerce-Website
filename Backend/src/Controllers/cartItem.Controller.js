import * as CartItemServices from "../services/cartItem.Services.js";

const updateCartItem = async (req, res) => {
  const user = req.user;
  console.log(
    "updateCartItem Controller - userId:",
    user._id,
    "cartItemId:",
    req.params.id
  );
  try {
    const updatedCartItem = await CartItemServices.updateCartItem(
      user._id,
      req.params.id,
      req.body
    );
    return res.status(200).send(updatedCartItem);
  } catch (err) {
    console.log("error in updateCartItem Controller:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

const removeCartItem = async (req, res) => {
  const user = req.user;
  console.log(user._id, "userId");
  try {
    await CartItemServices.removeCartItem(user._id, req.params.id);
    return res.status(200).send({ message: "item removed", status: true });
  } catch (err) {
    console.log("error", err.message);
    return res.status(500).json({ error: err.message });
  }
};

export { updateCartItem, removeCartItem };
