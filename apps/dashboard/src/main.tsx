import { RouterProvider, createBrowserRouter } from "react-router";
import { loginPageRouteLoader, protectedRouteLoader } from "./utils/authLoader";
import App from "./App.tsx";
import DashboardPage from "./components/dashboard-page/Dashboard";
import Layout from "./components/layout/Layout";
import LoginPage from "./components/login-page/LoginForm";
import React from "react";
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
            element: <LoginPage />,
            loader: loginPageRouteLoader,
          },
        ],
      },
      {
        element: <Layout />,
        loader: protectedRouteLoader,

        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
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
