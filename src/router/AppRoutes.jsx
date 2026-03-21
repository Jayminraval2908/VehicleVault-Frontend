// import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
// import Home from "../pages/Home"
// import Login from "../pages/auth/Login";
// import Signup from "../pages/auth/SignUp";
// import About from "../pages/About";
// import Contact from "../pages/Contact";
// import ProtectedRoute from "../components/auth/ProtectedRoute";

// import MainLayout from "../components/layout/MainLayout";
// import AdminDashboard from "../pages/dashboard/AdminDashboard";
// import BuyerDashboard from "../pages/dashboard/BuyerDashboard";
// import SellerDashboard from "../pages/dashboard/SellerDashboard";

// import VehicleList from "../pages/vehicle/VehicleList";
// import VehicleDetails from "../pages/vehicle/VehicleDetails";
// import AddVehicle from "../pages/vehicle/AddVehicle";
// import EditVehicle from "../pages/vehicle/EditVehicle";

// import SendInquiry from "../pages/inquiry/SendInquiry";
// import MyInquiries from "../pages/inquiry/MyInquiries";
// import SendOffer from "../pages/offer/SendOffer";
// import MyOffers from "../pages/offer/MyOffers";
// import BookTestDrive from "../pages/testdrive/BookTestDrive";
// import MyBookings from "../pages/testdrive/MyBookings";
// import AddReport from "../pages/inspection/AddReport";
// import ReportsList from "../pages/inspection/ReportLists";



// const router = createBrowserRouter([
//   { path: "/", element: <Home /> },
//   { path: "/login", element: <Login /> },
//   { path:"/signup", element:<Signup/>},
//   { path:"/about", element:<About/>},
//   {path :"/contact", element:<Contact/>},

//   { path: "/vehicles", element: <VehicleList /> },
//   { path: "/vehicle/:id", element: <VehicleDetails /> },
//   { path: "/inspection/vehicle/:vehicleId", element: <ReportsList /> },


//   // Buyer Routes
//   {
//     path: "/buyer",
//     element: <MainLayout role="buyer" />,
//     children: [
//       {
//         path: "dashboard",
//         element: <BuyerDashboard />,
//       },
//       {
//         path:"inquiries",
//         element:<MyInquiries/>
//       },
//       {
//         path:"offers",
//         element:<MyOffers/>
//       },
//       {
//         path:"bookings",
//         element:<MyBookings/>
//       }
//     ],
//   },

//   { path: "/inquiry/send/:vehicleId", element: <SendInquiry /> },
//   { path: "/offer/send/:vehicleId", element: <SendOffer /> },
//   { path: "/testdrive/book/:vehicleId", element: <BookTestDrive /> },

//   // Seller Routes
//   {
//     path: "/seller",
//     element: <MainLayout role="seller" />,
//     children: [
//       { path: "dashboard", element: <SellerDashboard /> },
//       { path: "add-vehicle", element: <AddVehicle /> },
//       { path: "edit-vehicle/:id", element: <EditVehicle /> },
//       { path: "add-inspection/:vehicleId", element: <AddReport /> },
//     ],
//   },

//   // Admin Routes
//   {
//   path: "/admin",
//   element: (
//     <ProtectedRoute allowedRole="admin">
//       <MainLayout role="admin" />
//     </ProtectedRoute>
//   ),
//   children: [
//     { path: "dashboard", element: <AdminDashboard /> },
//   ],
// },

//   // Fallback
//   { path: "*", element: <Navigate to="/" replace /> },
// ]);

// const AppRoutes = () => {
//   return <RouterProvider router={router} />;
// };

// export default AppRoutes;



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

const router = createBrowserRouter([
  // --- Public Routes ---
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/vehicles", element: <VehicleList /> },
  { path: "/vehicle/:id", element: <VehicleDetails /> },
  { path: "/inspection/vehicle/:vehicleId", element: <ReportsList /> },

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
      // Moved these inside the layout so they feel part of the dashboard
      { path: "inquiry/send/:vehicleId", element: <SendInquiry /> },
      { path: "offer/send/:vehicleId", element: <SendOffer /> },
      { path: "testdrive/book/:vehicleId", element: <BookTestDrive /> },
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
    ],
  },

  // --- Fallback ---
  { path: "*", element: <Navigate to="/" replace /> },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;