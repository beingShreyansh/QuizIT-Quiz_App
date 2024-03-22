// ProtectedRoute.js
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import { isAuthenticated, loggedInRole } from "./store";

const ProtectedRoute = ({ adminOnly }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (isAuthenticated()) setIsLoggedIn(true);
    else toast.error("User not logged in!");
  }, [isLoggedIn]);

  const role = loggedInRole(); // Get the logged-in user's role

  return isAuthenticated() ? (
    adminOnly && role !== "admin" ? ( // Check if admin role is required and user is not admin
      <Navigate to="/" replace /> // Redirect to home if user is not admin
    ) : (
      <Outlet />
    )
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
