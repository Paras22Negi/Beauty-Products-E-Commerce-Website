import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../Redux/Auth/Action";
import { Box, CircularProgress, Typography } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token && !user) {
      // Try to get user profile
      dispatch(getUser(token));
    }
    // Always stop checking after a short delay to prevent infinite loading
    const timer = setTimeout(() => {
      setChecking(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch, user]);

  // Stop checking when we have user data or error
  useEffect(() => {
    if (user || error) {
      setChecking(false);
    }
  }, [user, error]);

  const token = localStorage.getItem("jwt");

  // Show loading while checking auth (but only briefly)
  if (checking && !user && token) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a2542",
        }}
      >
        <CircularProgress sx={{ color: "#ec4899" }} />
        <Typography sx={{ color: "white", mt: 2 }}>Loading...</Typography>
      </Box>
    );
  }

  // Not logged in - redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User loaded but not admin
  if (!checking && (!user || user.role !== "admin")) {
    localStorage.removeItem("jwt");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is admin or still loading - allow access (token exists)
  return children;
};

export default ProtectedRoute;
