import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { removeFromCart, updateCartQuantity } from "../redux/cart/action";

const CartSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((state) => state.cart);

  // ✅ Helper: format price for INR
  const formatPrice = (price) => {
    return price.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleRemove = (cartId) => {
    dispatch(removeFromCart(cartId));
  };

  const handleQuantityChange = (cartId, newQuantity) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(cartId));
    } else {
      dispatch(updateCartQuantity(cartId, newQuantity));
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/30 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-[130] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 text-2xl"
            >
              <IoClose />
            </button>
          </div>

          {/* Free Gift Banner */}
          {totalPrice > 0 && (
            <div className="px-6 py-4 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Product
                </span>
                <span className="text-sm font-medium text-gray-700">Total</span>
              </div>
              {totalPrice >= 999 ? (
                <p className="text-sm text-green-600 font-medium">
                  🎁 Free 15 Color Eyeshadow Palette worth ₹449 on orders above
                  ₹999
                </p>
              ) : (
                <div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-rose-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(totalPrice / 999) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">
                    Add {formatPrice(999 - totalPrice)} more to get free gift
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-6xl text-gray-300 mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Add some products to get started!
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.cartId}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition"
                  >
                    <img
                      src={item.thumbnail || item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-sm mb-1">
                            {item.title}
                          </h3>
                          {item.selectedShade && (
                            <p className="text-xs text-gray-600 mb-2">
                              Color: {item.selectedShade}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(item.cartId)}
                          className="text-red-500 hover:text-red-700 text-xs underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.cartId,
                                item.quantity - 1
                              )
                            }
                            className="px-3 py-1 hover:bg-gray-100 transition"
                          >
                            -
                          </button>
                          <span className="px-2 font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.cartId,
                                item.quantity + 1
                              )
                            }
                            className="px-3 py-1 hover:bg-gray-100 transition"
                          >
                            +
                          </button>
                        </div>

                        {/* ✅ Price formatted and right-aligned */}
                        <p className="font-bold text-gray-800 text-right min-w-[90px]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-gray-800">TOTAL</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Tax included. Shipping calculated at checkout.
              </p>
              <button
                onClick={handleCheckout}
                className="w-full bg-rose-600 text-white py-4 rounded-lg font-semibold hover:bg-rose-700 transition"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
