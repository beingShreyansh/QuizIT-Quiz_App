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
  EditQuiz,
} from "./pages";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Layout from "./pages/Layout.jsx";
import Chart from "./components/charts/chart.jsx";

import TopStudentsTable from "./components/Table/TopStudentsTable.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        { path: "", element: <Layout Children={UserHome} /> },
        {
          path: "/quiz/:id/:totalQuestions/:beginnerRatio/:intermediateRatio/:advancedRatio",
          element: <QuizPlayground />,
        },
        { path: "/quiz-result", element: <Results /> },
        {
          path: "/user-history/:id",
          element: <Layout Children={UserHistoryStats} />,
        },
      ],
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
      element: <ProtectedRoute adminOnly={true} />,
      children: [
        { path: "", element: <Layout Children={Chart} /> },
        { path: "add-quiz", element: <Layout Children={UploadQuiz} /> },
        { path: "editQuiz", element: <Layout Children={EditQuiz} /> },
        {
          path: "top-students",
          element: <Layout Children={TopStudentsTable} />,
        },
        {
          path: "user-history",
          element: <Layout Children={AdminUserHistory} />,
        },
      ],
    },
    { path: "*", element: <PageNotFound /> },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
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
    </div>
  );
}

export default App;
