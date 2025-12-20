import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updatePayment } from "../../redux/order/action";
import { clearCart } from "../../redux/cart/action";

const PaymentCallback = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing your payment...");

  useEffect(() => {
    const processPayment = async () => {
      try {
        const paymentId = searchParams.get("razorpay_payment_id");
        const paymentLinkStatus = searchParams.get(
          "razorpay_payment_link_status"
        );

        if (paymentLinkStatus === "paid" && paymentId) {
          // Update payment info on backend
          const result = await dispatch(
            updatePayment({
              payment_id: paymentId,
              order_id: orderId,
            })
          );

          if (result.success) {
            setStatus("success");
            setMessage("Payment successful! Your order has been placed.");
            // Clear cart after successful payment
            dispatch(clearCart());
            // Redirect to order success page after 2 seconds
            setTimeout(() => {
              navigate(`/OrderSuccessPage`, {
                state: { order: result.data.order },
              });
            }, 2000);
          } else {
            setStatus("error");
            setMessage(result.error || "Failed to process payment");
          }
        } else {
          setStatus("error");
          setMessage("Payment was not completed. Please try again.");
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "Something went wrong");
      }
    };

    processPayment();
  }, [orderId, searchParams, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === "processing" && (
          <>
            <div className="w-16 h-16 border-4 border-gray-300 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">{message}</h2>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-600 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-400 mt-4">
              Redirecting to your order...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate("/checkout")}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
