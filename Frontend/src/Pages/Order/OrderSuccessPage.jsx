import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const OrderSuccessPage = ({ order }) => {
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
              <span className="font-medium">Order #{order.id}</span>
            </div>

            <h2 className="text-2xl font-semibold mt-1">
              Thank you {order.customerName}!
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
              order.address
            )}&z=15&output=embed`}
          ></iframe>

          {/* Contact Details */}
          <div className="border rounded-lg p-4 flex flex-col gap-4">
            <div>
              <h4 className="text-gray-500 text-sm">Contact</h4>
              <p>{order.email}</p>
            </div>

            <div>
              <h4 className="text-gray-500 text-sm">Address</h4>
              <p>{order.customerName}</p>
              <p>{order.address}</p>
            </div>

            <div>
              <h4 className="text-gray-500 text-sm">Payment</h4>
              <p>{order.paymentMethod}</p>
            </div>
          </div>

          <button className="py-3 px-5 bg-black text-white rounded-md w-fit">
            Continue Shopping
          </button>
        </div>

        {/* RIGHT SIDE (Order Summary) */}
        <div className="border rounded-lg p-5 h-fit sticky top-10">
          <h3 className="text-lg font-semibold mb-4">Your Order</h3>

          <div className="flex flex-col gap-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  {item.color && (
                    <p className="text-xs text-gray-500">Color: {item.color}</p>
                  )}
                  {item.logo && (
                    <p className="text-xs text-gray-500">Logo: {item.logo}</p>
                  )}
                  <p className="text-sm mt-1">×{item.qty}</p>
                </div>

                <p className="font-medium">${item.price}</p>
              </div>
            ))}
          </div>

          {/* Cost Summary */}
          <div className="mt-4 text-sm">
            <div className="flex justify-between py-1">
              <span>Subtotal</span>
              <span>${order.subtotal}</span>
            </div>

            <div className="flex justify-between py-1">
              <span>Shipping</span>
              <span>{order.shipping}</span>
            </div>

            <div className="flex justify-between py-1 mb-2">
              <span>Tax</span>
              <span>${order.tax}</span>
            </div>

            <hr />

            <div className="flex justify-between font-semibold text-lg mt-2">
              <span>Total</span>
              <span>${order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;