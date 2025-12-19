import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Customers from "./Pages/Customers";
import Blogs from "./Pages/Blogs";
import AdminAddProduct from "./Pages/AdminAddProduct";
import UpdateProduct from "./Pages/UpdateProduct";
import OrdersTable from "./Orders/OrdersTable";
import Coupan from "./Coupan/Coupan";
import VideoUpload from "./Components/Video/VideoUpload";
import Queries from "./Pages/Queries";
import AdminLogin from "./Pages/AdminLogin";
import ProtectedRoute from "./Components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* Public route - Login */}
      <Route path="/login" element={<AdminLogin />} />

      {/* Protected Admin layout wrapper */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/add-product" element={<AdminAddProduct />} />
        <Route path="/admin/update-product" element={<UpdateProduct />} />
        <Route path="orders" element={<OrdersTable />} />
        <Route path="create-coupon" element={<Coupan />} />
        <Route path="/upload-video" element={<VideoUpload />} />
        <Route path="/queries" element={<Queries />} />
      </Route>
    </Routes>
  );
};

export default App;
