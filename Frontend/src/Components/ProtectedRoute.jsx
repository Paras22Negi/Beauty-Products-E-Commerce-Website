// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // check for your auth token

  if (!token) {
    return <Navigate to="/login" replace />; // redirect to login if no token
  }

  return children; // render the protected component if token exists
};

export default ProtectedRoute;
