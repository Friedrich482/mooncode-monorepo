import { RouterProvider, createBrowserRouter } from "react-router";
import { authRouteLoader, protectedRouteLoader } from "./utils/authLoader";
import App from "./App.tsx";
import DashboardPage from "./components/dashboard-page/Dashboard";
import Layout from "./components/layout/Layout";
import LoginForm from "./components/login-page/LoginForm";
import NotFoundPage from "./components/not-found-page/NotFoundPage.tsx";
import React from "react";
import RegisterForm from "./components/register-page/RegisterForm.tsx";
import RootPage from "./components/root-page/Root";
import { createRoot } from "react-dom/client";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <RootPage />,
          },
          {
            path: "login",
            element: <LoginForm />,
            loader: authRouteLoader,
          },
          {
            path: "register",
            element: <RegisterForm />,
            loader: authRouteLoader,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
            loader: protectedRouteLoader,
          },
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
