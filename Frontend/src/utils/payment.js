/**
 * Payment utility functions for Razorpay integration
 */

/**
 * Redirect user to Razorpay payment page
 * @param {string} paymentUrl - The Razorpay short URL from backend
 */
export const redirectToPayment = (paymentUrl) => {
  if (paymentUrl) {
    window.location.href = paymentUrl;
  } else {
    throw new Error("Payment URL is missing");
  }
};

/**
 * Extract payment info from URL query params (after callback)
 * @returns {Object} Payment info from URL
 */
export const getPaymentInfoFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    razorpay_payment_id: params.get("razorpay_payment_id"),
    razorpay_payment_link_id: params.get("razorpay_payment_link_id"),
    razorpay_payment_link_reference_id: params.get(
      "razorpay_payment_link_reference_id"
    ),
    razorpay_payment_link_status: params.get("razorpay_payment_link_status"),
    razorpay_signature: params.get("razorpay_signature"),
  };
};

/**
 * Check if payment was successful based on URL params
 * @returns {boolean}
 */
export const isPaymentSuccessful = () => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("razorpay_payment_link_status");
  return status === "paid";
};
