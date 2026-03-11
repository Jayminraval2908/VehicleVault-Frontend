import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/SignUp";
import MainLayout from "../components/layout/MainLayout";

import AdminDashboard from "../pages/dashboard/AdminDashboard";
import BuyerDashboard from "../pages/dashboard/BuyerDashboard";
import SellerDashboard from "../pages/dashboard/SellerDashboard";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> },

  // Buyer Routes
  {
    path: "/buyer",
    element: <MainLayout role="buyer" />,
    children: [
      {
        path: "dashboard",
        element: <BuyerDashboard />,
      },
    ],
  },

  // Seller Routes
  {
    path: "/seller",
    element: <MainLayout role="seller" />,
    children: [
      {
        path: "dashboard",
        element: <SellerDashboard />,
      },
    ],
  },

  // Admin Routes
  {
    path: "/admin",
    element: <MainLayout role="admin" />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;