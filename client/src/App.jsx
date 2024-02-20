import React from "react";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AdminDashboard, Login, PageNotFound, Register, Results, UploadQuiz, UserHome, AdminUserHistory, UserHistory } from "./pages";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element:<UserHome/>,
      errorElement: <PageNotFound />,
    },
    {
      path: "/quiz-result",
      element:<Results/>,
    },
    {
      path: "/user-history/:id",
      element:<UserHistory/>,
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
      element: <AdminDashboard/>,
    },
    {
      path: "/admin/add-quiz",
      element: <UploadQuiz/>,
    },
    {
      path: "/admin/user-history",
      element: <AdminUserHistory/>,
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