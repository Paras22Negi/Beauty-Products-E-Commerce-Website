import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../../redux/order/action";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

// Status mapping for stepper
const steps = [
  { key: "PENDING", label: "Pending" },
  { key: "PLACED", label: "Variable" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { order, _loading, error } = useSelector((store) => store.order);

  useEffect(() => {
    dispatch(getOrderById(orderId));
  }, [dispatch, orderId]);

  if (_loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!order)
    return (
      <p className="text-center mt-20 text-gray-600">
        Order Not Found or Loading...
      </p>
    );

  const activeStep = steps.findIndex((s) => s.key === order.orderStatus);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT SIDE */}
        <div className="col-span-2 space-y-6">
          {/* ORDER HEADER */}
          <div className="flex items-center gap-3">
            <IoCheckmarkCircleOutline className="text-3xl text-green-600" />
            <div>
              <p className="text-gray-700 text-sm">
                Order #{order._id.slice(-6).toUpperCase()}
              </p>
              <h2 className="text-xl font-bold">
                {order.orderStatus === "DELIVERED"
                  ? "Order Delivered!"
                  : `Order Status: ${order.orderStatus}`}
              </h2>
            </div>
          </div>

          {/* DELIVERY PROGRESS */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Delivery Status</h3>

            <div className="relative flex justify-between">
              {steps.map((step, i) => (
                <div
                  key={step.key}
                  className="flex-1 flex flex-col items-center"
                >
                  {/* Line Behind */}
                  {i !== 0 && (
                    <div
                      className={`absolute top-3 w-full left-0 -z-10 h-1 ${
                        i <= activeStep ? "bg-green-600" : "bg-gray-300"
                      }`}
                      style={{
                        left: "-50%",
                        width: "100%",
                        display: i === 0 ? "none" : "block",
                      }}
                    />
                  )}

                  {/* Circle */}
                  <div
                    className={`w-7 h-7 rounded-full z-10 flex items-center justify-center ${
                      i <= activeStep
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {i <= activeStep ? "✓" : i + 1}
                  </div>

                  <p className="text-xs mt-2 text-gray-700">{step.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CUSTOMER DETAILS */}
          <div className="bg-white border rounded-lg divide-y">
            <div className="p-4">
              <h4 className="font-semibold">Shipping Address</h4>
              <p className="text-gray-600">
                {order.shippingAddress?.firstName}{" "}
                {order.shippingAddress?.lastName}
              </p>
              <p className="text-gray-600">
                {order.shippingAddress?.streetAddress},{" "}
                {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
                {order.shippingAddress?.zipCode}
              </p>
              <p className="text-gray-600">
                Phone: {order.shippingAddress?.mobile}
              </p>
            </div>
            <div className="p-4">
              <h4 className="font-semibold">Payment Method</h4>
              <p className="text-gray-600">
                {order.paymentDetails?.paymentMethod || "N/A"}
              </p>
              <p className="text-gray-600">
                Status: {order.paymentDetails?.paymentStatus}
              </p>
            </div>
          </div>
          {/* Back Button */}
          <button
            onClick={() => navigate("/orders")}
            className="px-4 py-2 mb-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
          >
            ← Back to Orders
          </button>
        </div>

        {/* RIGHT SIDE — ORDER SUMMARY */}
        <div className="bg-white border rounded-lg p-5 h-fit">
          <h3 className="text-lg font-bold mb-4">Order Summary</h3>

          {order.orderItems.map((item) => (
            <div key={item._id} className="flex gap-4 py-4 border-b">
              <img
                src={
                  item.product?.imageUrl?.[0] ||
                  item.product?.thumbnail ||
                  "https://via.placeholder.com/150"
                }
                className="w-16 h-16 rounded-md object-cover"
                alt=""
              />
              <div className="flex-1">
                <h4 className="font-semibold">{item.product?.title}</h4>

                {item.size && (
                  <p className="text-sm text-gray-600">Size: {item.size}</p>
                )}

                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>

              <p className="font-semibold">
                ₹{(item.discountedPrice * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          {/* PRICE TABLE */}
          <div className="mt-4 text-sm text-gray-700 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">-₹{order.discounte || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>

            <div className="flex justify-between pt-3 border-t text-base font-bold">
              <span>Total</span>
              <span>₹{order.totalDiscountedPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
