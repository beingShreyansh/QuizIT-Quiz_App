import React from "react";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AdminDashboard, Login, PageNotFound, Register, UserDashboard } from "./pages";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element:<UserDashboard/>,
      errorElement: <PageNotFound />,
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