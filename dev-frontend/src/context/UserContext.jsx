import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

//create context with default value
const UserContext = createContext();

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
// Provider component that wraps your app
export const UserProvider = ({ children }) => {
  // State variables
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Function to fetch user data from the backend
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    // If no token, user is not logged in
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:3000/api/auth/check-auth",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update state with user data
      setUserData(response.data.user);
      setError(null);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data");

      // If token is invalid (401), clear it
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setError(null);
  };

  // Refresh user data function
  const refreshUser = () => {
    setLoading(true);
    fetchUserData();
  };

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  // Create the value object to pass to context
  const value = {
    userData,
    loading,
    error,
    logout,
    refreshUser,
    fetchUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
