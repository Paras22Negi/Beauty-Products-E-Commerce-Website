import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getOrderHistory } from "../../redux/order/action";
import {
  FaBox,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaShoppingBag,
} from "react-icons/fa";

// Better status mapping
const STATUS_MAP = {
  PENDING: {
    label: "Pending",
    color: "bg-gray-200 text-gray-700",
    icon: <FaClock />,
  },
  PLACED: {
    label: "Order Placed",
    color: "bg-blue-100 text-blue-700",
    icon: <FaCheckCircle />,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-green-100 text-green-700",
    icon: <FaCheckCircle />,
  },
  SHIPPED: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-700",
    icon: <FaTruck />,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-200 text-green-800",
    icon: <FaBox />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: <FaClock />,
  },
};

const getStatus = (status) => {
  const s = STATUS_MAP[status] || STATUS_MAP["PENDING"];

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
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((store) => store.order);

  useEffect(() => {
    dispatch(getOrderHistory());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-red-500">
          Failed to load orders
        </h2>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

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

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-lg transition"
            >
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <img
                  src={
                    order.orderItems[0]?.product?.imageUrl?.[0] ||
                    order.orderItems[0]?.product?.thumbnail ||
                    "https://via.placeholder.com/150"
                  }
                  alt="product"
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h2 className="font-semibold text-lg">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700">
                    Items: {order.orderItems.length}
                  </p>
                </div>
              </div>

              {/* Center Status */}
              <div className="md:text-center">
                {getStatus(order.orderStatus)}
              </div>

              {/* Right Section */}
              <div className="text-right">
                <p className="font-semibold text-lg">₹{order.totalPrice}</p>
                <button
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="mt-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-10 rounded-xl shadow-md text-center">
          <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            No orders found
          </h2>
          <p className="text-gray-500">
            Looks like you haven't placed any orders yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderListPage;
