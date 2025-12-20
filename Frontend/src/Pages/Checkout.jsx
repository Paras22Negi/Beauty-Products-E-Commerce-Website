import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { IoArrowBack, IoAdd } from "react-icons/io5";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import { createOrder, createOrderAndPay } from "../redux/order/action";
import { getCart } from "../redux/cart/action";
import { fetchUserDetails } from "../redux/account/action";
import AddAddressModal from "../Components/AddAddressModal";
import Loader from "../Components/Loader";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    cartItems: items = [],
    totalPrice = 0,
    totalDiscountedPrice = 0,
    couponDiscount = 0,
  } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.account);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("online"); // 'online' or 'cod'
  const [useSuperCoins, setUseSuperCoins] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    dispatch(getCart());
    dispatch(fetchUserDetails(token));

    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setAddresses(res.data.addresses);
          if (res.data.addresses.length > 0) {
            setSelectedAddress(res.data.addresses[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
        toast.error("Failed to load addresses");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [token, dispatch, navigate]);

  const handleAddAddress = (newAddress) => {
    setAddresses([...addresses, newAddress]);
    setSelectedAddress(newAddress);
  };

  const coinsToUse = useSuperCoins
    ? Math.min(user?.superCoins || 0, totalDiscountedPrice - couponDiscount)
    : 0;
  const finalTotal = Math.max(
    totalDiscountedPrice - couponDiscount - coinsToUse,
    0
  );

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    setIsPlacingOrder(true);
    try {
      if (paymentMethod === "online") {
        const res = await dispatch(
          createOrderAndPay(selectedAddress, coinsToUse)
        );
        if (res.success && res.redirecting) {
          // Window will redirect to payment link
          return;
        } else if (!res.success) {
          toast.error(res.error || "Payment initiation failed");
        }
      } else {
        // COD Flow
        const res = await dispatch(
          createOrder(selectedAddress, coinsToUse, "COD")
        );
        if (res.success) {
          toast.success("Order placed successfully!");
          navigate("/OrderSuccessPage", { state: { order: res.data } });
        } else {
          toast.error(res.error || "Failed to place order");
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong during checkout");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition"
          >
            <IoArrowBack size={20} />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-xl font-bold">Checkout</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">
                    1
                  </span>
                  Shipping Address
                </h2>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-rose-600 font-semibold flex items-center gap-1 hover:text-rose-700 transition"
                >
                  <IoAdd size={20} /> Add New
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-gray-500 mb-4">No saved addresses found</p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="bg-black text-white px-6 py-2 rounded-lg"
                  >
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddress?._id === addr._id
                          ? "border-black bg-gray-50"
                          : "border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      {selectedAddress?._id === addr._id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                      <p className="font-bold mb-1">
                        {addr.firstName} {addr.lastName}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {addr.streetAddress},<br />
                        {addr.city}, {addr.state} - {addr.zipCode}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        📞 {addr.mobile}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Super Coins Section */}
            {user?.superCoins > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">
                    2
                  </span>
                  Super Coins
                </h2>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 shadow-inner">
                      🪙
                    </div>
                    <div>
                      <p className="font-bold text-yellow-900">
                        Redeem Super Coins
                      </p>
                      <p className="text-xs text-yellow-700">
                        You have {user.superCoins} coins. 1 Coin = ₹1
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUseSuperCoins(!useSuperCoins)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      useSuperCoins ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        useSuperCoins ? "translate-x-6" : "translate-x-0"
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
            )}

            {/* Payment Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">
                  {user?.superCoins > 0 ? "3" : "2"}
                </span>
                Payment Method
              </h2>

              <div className="space-y-4">
                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "online"
                      ? "border-black bg-gray-50"
                      : "border-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="hidden"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                  />
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "online"
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                  >
                    {paymentMethod === "online" && (
                      <div className="w-3 h-3 bg-black rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="font-bold">Pay Online</p>
                      <p className="text-sm text-gray-500 font-medium">
                        Razorpay / UPI / Cards / NetBanking
                      </p>
                    </div>
                    <FaCreditCard className="text-2xl text-gray-400" />
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-black bg-gray-50"
                      : "border-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="hidden"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "cod"
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                  >
                    {paymentMethod === "cod" && (
                      <div className="w-3 h-3 bg-black rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="font-bold">Cash on Delivery</p>
                      <p className="text-sm text-gray-500 font-medium">
                        Pay when your product arrives
                      </p>
                    </div>
                    <FaMoneyBillWave className="text-2xl text-gray-400" />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold mb-6">Order Summary</h2>

              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <img
                      src={
                        item.product?.thumbnail ||
                        item.product?.imageUrl?.[0] ||
                        "https://via.placeholder.com/80"
                      }
                      alt={item.product?.title}
                      className="w-16 h-16 object-cover rounded-lg bg-gray-50"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold line-clamp-1">
                        {item.product?.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity} | {item.size}
                      </p>
                      <p className="text-sm font-bold mt-1">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                {totalDiscountedPrice < totalPrice && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{totalPrice - totalDiscountedPrice}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Coupon</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                {coinsToUse > 0 && (
                  <div className="flex justify-between text-yellow-600 font-medium">
                    <span>Redeemed Coins</span>
                    <span>-₹{coinsToUse}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold uppercase text-xs">
                    Free
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t mt-2">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || items.length === 0}
                className={`w-full py-4 rounded-xl font-bold mt-8 shadow-lg shadow-rose-100 transition-all ${
                  isPlacingOrder || items.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-rose-600 text-white hover:bg-rose-700 active:scale-95"
                }`}
              >
                {isPlacingOrder ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Placing Order...
                  </div>
                ) : paymentMethod === "online" ? (
                  "PAY & PLACE ORDER"
                ) : (
                  "CONFIRM COD ORDER"
                )}
              </button>

              <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-widest font-medium">
                Secure Checkout Powered by Mars
              </p>
            </div>
          </div>
        </div>
      </div>

      {showAddressModal && (
        <AddAddressModal
          onClose={() => setShowAddressModal(false)}
          onAdd={handleAddAddress}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
