import { useState, Suspense, lazy, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCart } from "./redux/cart/action";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Loader from "./Components/Loader";
import ProtectedRoute from "./Components/ProtectedRoute";
import ScrollToTop from "./Components/ScrollToTop";

// Lazy load all page components
const Home = lazy(() => import("./Pages/Home/Home"));
const Blog = lazy(() => import("./Pages/Blog/BlogListPage.jsx"));
const AboutUs = lazy(() => import("./Pages/AboutUs/aboutUs"));
const Support = lazy(() => import("./Pages/Support/support"));
const StoreLocator = lazy(() => import("./Pages/StoreLocator/storeLocator"));
const Profile = lazy(() => import("./Pages/account/Profile.jsx"));
const Login = lazy(() => import("./Pages/account/login"));
const Signup = lazy(() => import("./Pages/account/signup"));
const ProductDetails = lazy(() => import("./Pages/productDetails.jsx"));
const ProductsPage = lazy(() => import("./Pages/ProductsPage.jsx"));
const BlogDetailPage = lazy(() => import("./Pages/Blog/BlogDetailPage.jsx"));
const CheckoutPage = lazy(() => import("./Pages/Checkout.jsx"));
const OrderSuccessPage = lazy(() =>
  import("./Pages/Order/OrderSuccessPage.jsx")
);
const OrderDetailsPage = lazy(() =>
  import("./Pages/Order/OrderDetailsPage.jsx")
);
const OrderListPage = lazy(() => import("./Pages/Order/OrderListPage.jsx"));
const PaymentCallback = lazy(() =>
  import("./Pages/Payment/PaymentCallback.jsx")
);

const App = () => {
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getCart());
    }
  }, [dispatch]);

  return (
    <Suspense fallback={<Loader />}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/support" element={<Support />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/storeLocator" element={<StoreLocator />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Login />} />
        <Route path="/productDetails/:id" element={<ProductDetails />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/:lavelOne/:lavelTwo" element={<ProductsPage />} />
        <Route path="/products/:category" element={<ProductsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment/:orderId" element={<PaymentCallback />} />
        <Route path="/OrderSuccessPage" element={<OrderSuccessPage />} />
        <Route path="/order/:orderId" element={<OrderDetailsPage />} />
        <Route path="/orders" element={<OrderListPage />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </Suspense>
  );
};

export default App;
