import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/SignUp";
import About from "../pages/About";
import Contact from "../pages/Contact";
import ProtectedRoute from "../components/auth/ProtectedRoute";

import MainLayout from "../components/layout/MainLayout";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import BuyerDashboard from "../pages/dashboard/BuyerDashboard";
import SellerDashboard from "../pages/dashboard/SellerDashboard";

import VehicleList from "../pages/vehicle/VehicleList";
import VehicleDetails from "../pages/vehicle/VehicleDetails";
import AddVehicle from "../pages/vehicle/AddVehicle";
import EditVehicle from "../pages/vehicle/EditVehicle";

import SendInquiry from "../pages/inquiry/SendInquiry";
import MyInquiries from "../pages/inquiry/MyInquiries";
import SendOffer from "../pages/offer/SendOffer";
import MyOffers from "../pages/offer/MyOffers";
import BookTestDrive from "../pages/testdrive/BookTestDrive";
import MyBookings from "../pages/testdrive/MyBookings";
import AddReport from "../pages/inspection/AddReport";
import ReportsList from "../pages/inspection/ReportLists";
import TestDriveDetails from "../pages/testdrive/TestDriveDetails";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import AdminUsers from "../pages/dashboard/AdminUsers";
import SellerInquiries from "../pages/inquiry/SellerInquiries";
import SellerOffers from "../pages/offer/SellerOffers";
import SellerTestDrives from "../pages/testdrive/SellerTestDrive";

const router = createBrowserRouter([
  // --- Public Routes ---
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/forgotpassword", element: <ForgotPassword /> },
  { path: "/resetpassword/:token", element: <ResetPassword /> },
  { path: "/vehicles", element: <VehicleList /> },
  { path: "/vehicle/:id", element: <VehicleDetails /> },
  { path: "/inspection/vehicle/:vehicleId", element: <ReportsList /> },

  {
    path: "/inquiry/:vehicleId",
    element: (
      <ProtectedRoute>
        <SendInquiry />
      </ProtectedRoute>
    )
  },

  {
    path: "/offer/send/:vehicleId",
    element: (
      <ProtectedRoute>
        <SendOffer />
      </ProtectedRoute>
    )
  },

  {
    path: "/testdrive/book/:vehicleId",
    element: (
      <ProtectedRoute>
        <BookTestDrive />
      </ProtectedRoute>
    )
  },

  // --- Protected Buyer Routes ---
  {
    path: "/buyer",
    element: (
      <ProtectedRoute allowedRole="buyer">
        <MainLayout role="buyer" />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <BuyerDashboard /> },
      { path: "inquiries", element: <MyInquiries /> },
      { path: "offers", element: <MyOffers /> },
      { path: "bookings", element: <MyBookings /> },
      { path: "bookings/:id", element: <TestDriveDetails /> }

    ],
  },

  // --- Protected Seller Routes ---
  {
    path: "/seller",
    element: (
      <ProtectedRoute allowedRole="seller">
        <MainLayout role="seller" />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <SellerDashboard /> },
      { path: "add-vehicle", element: <AddVehicle /> },
      { path: "edit-vehicle/:id", element: <EditVehicle /> },
      { path: "add-inspection/:vehicleId", element: <AddReport /> },
      { path: "inquiries", element:<SellerInquiries/>},
      { path: "offers", element:<SellerOffers/>},
      { path: "test-drives", element : <SellerTestDrives/>}
    ],
  },

  // --- Protected Admin Routes ---
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRole="admin">
        <MainLayout role="admin" />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <AdminUsers /> }
    ],
  },

  // --- Fallback ---
  { path: "*", element: <Navigate to="/" replace /> },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;