import React from "react";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AdminDashboard, Login, PageNotFound, Register, Results, UploadQuiz, UserDashboard, UserHistory } from "./pages";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element:<UserDashboard/>,
      errorElement: <PageNotFound />,
    },
    {
      path: "/quiz-result",
      element:<Results/>,
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
      element: <UserHistory/>,
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