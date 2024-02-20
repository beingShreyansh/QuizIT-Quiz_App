// ProtectedRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import { isAuthenticated, loggedInRole } from "./store";

const ProtectedRoute = () => {
  try {
    if (isAuthenticated()) {
      const userRole = loggedInRole();
      if (userRole === "admin") {
        return <Navigate to="/admin" replace />;
      } else {
        return <Outlet />;
      }
    } else {
      toast.error("User not logged in!");
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
    toast.error("Failed to check authentication");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
