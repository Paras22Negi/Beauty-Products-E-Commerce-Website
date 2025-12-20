import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../redux/order/action";
import { FaCheckCircle } from "react-icons/fa";
import Loader from "../../Components/Loader";

const OrderSuccessPage = ({ order: propOrder }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { order: reduxOrder, loading } = useSelector((state) => state.order);

  const [order, setOrder] = useState(
    propOrder || location.state?.order || null
  );

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (!order && orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [order, searchParams, dispatch]);

  useEffect(() => {
    if (!order && reduxOrder) {
      setOrder(reduxOrder);
    }
  }, [reduxOrder, order]);

  if (loading && !order) return <Loader />;
  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 italic">No order details found.</p>
      </div>
    );

  // Map backend fields to component fields
  const displayId = order._id || order.id || "N/A";
  const customerName = order.user
    ? `${order.user.firstName} ${order.user.lastName}`
    : order.customerName || "Customer";
  const email = order.user?.email || order.email || "";
  const address = order.shippingAddress
    ? `${order.shippingAddress.streetAddress}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}`
    : order.address || "";
  const paymentMethod =
    order.paymentDetails?.paymentMethod || order.paymentMethod || "N/A";
  const items = order.orderItems || order.items || [];
  const subtotal = order.totalPrice || order.subtotal || 0;
  const shipping = order.shipping || "Free";
  const tax = order.tax || 0;
  const total = order.totalDiscountedPrice || order.total || 0;

  return (
    <div className="w-full min-h-screen bg-white flex justify-center py-10 px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT SIDE */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Heading */}
          <div>
            <h1 className="text-2xl font-semibold">Checkout</h1>
            <div className="flex items-center gap-2 mt-3">
              <FaCheckCircle className="text-green-500 text-xl" />
              <span className="font-medium">Order #{displayId}</span>
            </div>

            <h2 className="text-2xl font-semibold mt-1">
              Thank you {customerName}!
            </h2>
          </div>

          {/* Order Updates Box */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">Order Updates</h3>
            <p className="text-gray-600 text-sm mt-1">
              You will receive order and shipping updates via email.
            </p>
          </div>

          {/* Google Map */}
          <iframe
            title="map"
            width="100%"
            height="250"
            loading="lazy"
            className="rounded-lg border"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(
              address
            )}&z=15&output=embed`}
          ></iframe>

          {/* Contact Details */}
          <div className="border rounded-lg p-4 flex flex-col gap-4">
            <div>
              <h4 className="text-gray-500 text-sm">Contact</h4>
              <p>{email}</p>
            </div>

            <div>
              <h4 className="text-gray-500 text-sm">Address</h4>
              <p>{customerName}</p>
              <p>{address}</p>
            </div>

            <div>
              <h4 className="text-gray-500 text-sm">Payment</h4>
              <p>{paymentMethod}</p>
            </div>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="py-3 px-5 bg-black text-white rounded-md w-fit"
          >
            Continue Shopping
          </button>
        </div>

        {/* RIGHT SIDE (Order Summary) */}
        <div className="border rounded-lg p-5 h-fit sticky top-10">
          <h3 className="text-lg font-semibold mb-4">Your Order</h3>

          <div className="flex flex-col gap-4">
            {items.map((item, idx) => (
              <div
                key={item._id || item.id || idx}
                className="flex gap-4 border-b pb-4"
              >
                <img
                  src={
                    item.product?.thumbnail ||
                    item.product?.imageUrl?.[0] ||
                    item.image ||
                    "https://via.placeholder.com/80"
                  }
                  alt={item.product?.title || item.title}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1">
                  <p className="font-medium">
                    {item.product?.title || item.title}
                  </p>
                  {(item.product?.color || item.color) && (
                    <p className="text-xs text-gray-500">
                      Color: {item.product?.color || item.color}
                    </p>
                  )}
                  <p className="text-sm mt-1">×{item.quantity || item.qty}</p>
                </div>

                <p className="font-medium">₹{item.price}</p>
              </div>
            ))}
          </div>

          {/* Cost Summary */}
          <div className="mt-4 text-sm">
            <div className="flex justify-between py-1">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between py-1">
              <span>Shipping</span>
              <span>{shipping}</span>
            </div>

            {order.usedSuperCoins > 0 && (
              <div className="flex justify-between py-1 text-yellow-600 font-medium">
                <span>Super Coins Redemeed</span>
                <span>-₹{order.usedSuperCoins}</span>
              </div>
            )}

            <div className="flex justify-between py-1 mb-2">
              <span>Tax</span>
              <span>₹{tax}</span>
            </div>

            <hr />

            <div className="flex justify-between font-semibold text-lg mt-2">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
