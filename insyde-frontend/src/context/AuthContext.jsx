// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

// Create context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Configure axios with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Load user data on mount or token change
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get user data from API
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:3000"
          }/api/v1/users/me`
        );

        if (response.data.success) {
          setUser(response.data.data);
        } else {
          // Invalid token or other error
          handleLogout();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Only log out if it's an auth error
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]); // Add token as a dependency to refetch when it changes

  const handleLogin = async (username, password) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/v1/users/login`,
        { username, password }
      );

      const { token: newToken, user: userData } = response.data.data;

      // Save token to localStorage
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(userData);

      toast.success("Login successful!");
      navigate("/dashboard");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000"
        }/api/v1/users`,
        userData
      );

      toast.success("Registration successful! Please login.");
      navigate("/login");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    token,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
