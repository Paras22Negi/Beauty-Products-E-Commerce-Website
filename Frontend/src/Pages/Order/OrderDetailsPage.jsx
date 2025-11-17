import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockOrders } from "./MockOrder";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const steps = [
  { key: "placed", label: "Order Placed" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const order = mockOrders.find((o) => o.id.toString() === orderId);
  if (!order)
    return <p className="text-center mt-20 text-gray-600">Order Not Found</p>;

  const completedIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT SIDE */}
        <div className="col-span-2 space-y-6">
          {/* ORDER HEADER */}
          <div className="flex items-center gap-3">
            <IoCheckmarkCircleOutline className="text-3xl text-green-600" />
            <div>
              <p className="text-gray-700 text-sm">Order #{order.id}</p>
              <h2 className="text-xl font-bold">
                {order.status === "delivered"
                  ? "Order Delivered!"
                  : "Order in Progress"}
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
                      className={`h-1 w-full -mt-3 ${
                        i <= completedIndex ? "bg-green-600" : "bg-gray-300"
                      }`}
                    ></div>
                  )}

                  {/* Circle */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      i <= completedIndex
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {i <= completedIndex ? "✓" : i + 1}
                  </div>

                  <p className="text-xs mt-2 text-gray-700">{step.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CUSTOMER DETAILS */}
          <div className="bg-white border rounded-lg divide-y">
            <div className="p-4">
              <h4 className="font-semibold">Contact</h4>
              <p className="text-gray-600">{order.email}</p>
            </div>
            <div className="p-4">
              <h4 className="font-semibold">Address</h4>
              <p className="text-gray-600">{order.address}</p>
            </div>
            <div className="p-4">
              <h4 className="font-semibold">Payment Method</h4>
              <p className="text-gray-600">{order.paymentMethod}</p>
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

          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 py-4 border-b">
              <img src={item.image} className="w-16 h-16 rounded-md" alt="" />
              <div className="flex-1">
                <h4 className="font-semibold">{item.title}</h4>

                {item.color && (
                  <p className="text-sm text-gray-600">Color: {item.color}</p>
                )}
                {item.logo && (
                  <p className="text-sm text-gray-600">Logo: {item.logo}</p>
                )}

                <p className="text-sm text-gray-600">Qty: {item.qty}</p>
              </div>

              <p className="font-semibold">
                ₹{(item.price * item.qty).toFixed(2)}
              </p>
            </div>
          ))}

          {/* PRICE TABLE */}
          <div className="mt-4 text-sm text-gray-700 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{order.shipping}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{order.tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between pt-3 border-t text-base font-bold">
              <span>Total</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
