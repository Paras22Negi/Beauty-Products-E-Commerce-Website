import { useLocation } from "react-router-dom";
import OrderSuccessPage from "./Order/OrderSuccessPage.jsx";

const CheckoutPage = () => {
  const location = useLocation();
  const orderData = location.state?.order;

  if (!orderData) return <p>No order found.</p>;

  return <OrderSuccessPage order={orderData} />;
};

export default CheckoutPage;