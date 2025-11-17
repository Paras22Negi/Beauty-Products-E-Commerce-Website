import React from "react";
import { useNavigate } from "react-router-dom";
import { mockOrders } from "./MockOrder";
import {
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaShoppingBag,
} from "react-icons/fa";


// Better status mapping
const STATUS_MAP = {
  placed: {
    label: "Order Placed",
    color: "bg-gray-200 text-gray-700",
    icon: <FaClock />,
  },
  packed: {
    label: "Packed",
    color: "bg-yellow-200 text-yellow-700",
    icon: <FaBox />,
  },
  shipped: {
    label: "Shipped",
    color: "bg-blue-200 text-blue-700",
    icon: <FaTruck />,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-purple-200 text-purple-700",
    icon: <FaShoppingBag />,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-200 text-green-700",
    icon: <FaCheckCircle />,
  },
};

const getStatus = (status) => {
  const s = STATUS_MAP[status];

  if (!s) return <span className="text-gray-400">Unknown</span>;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${s.color}`}
    >
      {s.icon} {s.label}
    </div>
  );
};

const OrderListPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gray-100 pt-24 pb-12 px-4 md:px-10">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 mb-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
      >
        ← Back to Home
      </button>
      <h1 className="text-3xl font-semibold mb-6">My Orders</h1>

      <div className="space-y-4">
        {mockOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-lg transition"
          >
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <img
                src={order.thumbnail}
                alt="product"
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h2 className="font-semibold text-lg">Order #{order.id}</h2>
                <p className="text-sm text-gray-500">Placed on: {order.date}</p>
                <p className="text-sm text-gray-700">
                  Items: {order.itemsCount}
                </p>
              </div>
            </div>

            {/* Center Status */}
            <div className="md:text-center">{getStatus(order.status)}</div>

            {/* Right Section */}
            <div className="text-right">
              <p className="font-semibold text-lg">₹{order.total}</p>
              <button
                onClick={() => navigate(`/order/${order.id}`)}
                className="mt-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderListPage;
