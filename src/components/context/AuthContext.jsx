import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth State on Load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // Login Function
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.clear(); // Added to ensure everything is wiped
    // Use navigate from react-router-dom in your component, 
    // or uncomment the line below if you want a hard refresh:
    // window.location.href = "/login"; 
  };

  // Helper: Check if user has a specific role
  const hasRole = (role) => {
    return user?.role?.toLowerCase() === role.toLowerCase();
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        login, 
        logout, 
        isLoggedIn: !!user, 
        loading,
        hasRole 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};