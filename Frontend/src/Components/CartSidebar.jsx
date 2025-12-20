import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { removeFromCart, updateCartQuantity } from "../redux/cart/action";
import { fetchProduct } from "../redux/Product/action";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const orderData = {
  id: 625,
  customerName: "James",
  email: "test@iconicwp.com",
  paymentMethod: "Check payments",
  address: "7513 N Bray Rd, Mount Morris, MI 48458",

  items: [
    {
      id: 1,
      title: "Hoodie",
      color: "Red",
      logo: "Yes",
      qty: 1,
      price: 49.52,
      image: "https://via.placeholder.com/80",
    },
    {
      id: 2,
      title: "T-Shirt",
      qty: 1,
      price: 17.14,
      image: "https://via.placeholder.com/80",
    },
  ],

  subtotal: 66.67,
  shipping: "Flat rate US",
  tax: 3.33,
  total: 70.0,
};

const CartSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems: items = [], totalPrice = 0 } = useSelector(
    (state) => state.cart
  );
  const { product: products = [] } = useSelector((state) => state.product);

  React.useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProduct());
    }
  }, [dispatch, products.length]);

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
      dispatch(updateCartQuantity(cartId, { quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout", {
      state: {
        order: orderData,
      },
    });
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
                    key={item._id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition"
                  >
                    <img
                      src={
                        item.product?.thumbnail || item.product?.imageUrl?.[0]
                      }
                      alt={item.product?.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-sm mb-1">
                            {item.product?.title}
                          </h3>
                          {item.size && (
                            <p className="text-xs text-gray-600 mb-2">
                              Shade/Size: {item.size}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer text-xs underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                            className="px-3 py-1 hover:bg-gray-100 cursor-pointer transition"
                          >
                            -
                          </button>
                          <span className="px-2 font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                            className="px-3 py-1 hover:bg-gray-100 cursor-pointer transition"
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

            {/* Recommended Products */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  You may also like
                </h3>

                {/* Carousel Container */}
                <div className="relative">
                  {/* Left Arrow */}
                  <button
                    onClick={() => {
                      document.getElementById("rec-carousel").scrollBy({
                        left: -200,
                        behavior: "smooth",
                      });
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
                  >
                    <IoChevronBackOutline className="text-xl" />
                  </button>

                  {/* Right Arrow */}
                  <button
                    onClick={() => {
                      document.getElementById("rec-carousel").scrollBy({
                        left: 200,
                        behavior: "smooth",
                      });
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
                  >
                    <IoChevronForwardOutline className="text-xl" />
                  </button>

                  {/* Scrollable Row */}
                  <div
                    id="rec-carousel"
                    className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar py-1"
                  >
                    {products.slice(0, 10).map((product) => (
                      <div
                        key={product._id}
                        className="min-w-[150px] bg-gray-50 p-3 rounded-lg flex flex-col items-center shadow-sm h-[220px] cursor-pointer"
                        onClick={() => {
                          onClose();
                          navigate(`/productDetails/${product._id}`);
                        }}
                      >
                        <img
                          src={
                            product.imageUrl?.[0] ||
                            "https://via.placeholder.com/150"
                          }
                          alt={product.title}
                          className="w-24 h-24 object-cover mb-2 rounded-lg"
                        />

                        <h4 className="text-sm font-medium text-gray-800 text-center line-clamp-2">
                          {product.title}
                        </h4>

                        <div className="flex items-center gap-2 text-xs mt-1">
                          {product.discountedPrice < product.price && (
                            <span className="line-through text-gray-400">
                              Rs. {product.price}
                            </span>
                          )}
                          <span className="font-bold text-gray-800">
                            Rs. {product.discountedPrice || product.price}
                          </span>
                          {product.discountPersent > 0 && (
                            <span className="text-green-600">
                              {product.discountPersent}% OFF
                            </span>
                          )}
                        </div>

                        {/* Push button to bottom */}
                        <div className="mt-auto w-full">
                          <button
                            className={`w-full py-1 text-sm rounded ${
                              product.sizes?.length > 0
                                ? "bg-black text-white hover:bg-gray-800"
                                : "bg-rose-600 text-white hover:bg-rose-700"
                            } transition cursor-pointer`}
                          >
                            {product.sizes?.length > 0
                              ? "Select Shades"
                              : "View Details"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
