// App.js
import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  Login,
  PageNotFound,
  Register,
  Results,
  UploadQuiz,
  UserHome,
  AdminUserHistory,
  UserHistoryStats,
  QuizPlayground,
} from "./pages";
import ProtectedRoute from './ProtectedRoute.jsx'
import AdminDashboard from "./pages/adminDashboard/AdminDashboard.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/", // Root path
      element: <ProtectedRoute />,
      children: [
        { path: "", element: <UserHome /> },
      ],
      errorElement: <PageNotFound />,
    },
    {
      path: "/quiz/:id",
      element:<QuizPlayground/>,
    },
    {
      path: "/quiz-result",
      element: <Results />,
    },
    {
      path: "/user-history/:id",
      element: <UserHistoryStats />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/admin",
      element: <ProtectedRoute adminOnly={true} />, // Wrap admin routes with ProtectedRoute and specify adminOnly prop
      children: [
        { path: "", element: <AdminDashboard /> }, // Admin Home route
        { path: "add-quiz", element: <UploadQuiz /> }, // Add Quiz route
        { path: "user-history", element: <AdminUserHistory /> }, // User History route
      ],
    },
  ]);

  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            theme: {
              primary: "#4aed88",
            },
          },
          error: {
            theme: {
              primary: "red",
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
