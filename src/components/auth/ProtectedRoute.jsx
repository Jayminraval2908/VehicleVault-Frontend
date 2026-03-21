import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Point to your context file
import Loader from "../common/Loader"

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, isLoggedIn, loading } = useAuth();

  // 1. Wait for AuthContext to finish checking localStorage
  if (loading) {
    return <Loader fullScreen />; 
  }

  // 2. If no user is logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 3. If a specific role is required and user doesn't have it
  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // 4. Everything is good, render the dashboard
  return children;
};

export default ProtectedRoute;