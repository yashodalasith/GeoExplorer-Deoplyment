import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        setUser(res.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post("/api/auth/register", formData, {
        withCredentials: true,
      });
      setUser(res.data.data);
      toast.success("Registration successful!");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed");
      throw error;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post("/api/auth/login", formData, {
        withCredentials: true,
      });
      setUser(res.data.data);
      toast.success("Login successful!");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.get("/api/auth/logout", { withCredentials: true });
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Logout failed");
    }
  };

  // Toggle favorite country
  const toggleFavorite = async (countryCode) => {
    try {
      const res = await axios.put(
        "/api/auth/favorites",
        { countryCode },
        { withCredentials: true }
      );
      setUser((prev) => ({
        ...prev,
        favoriteCountries: res.data.data,
      }));
      return res.data.data;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update favorites");
      throw error;
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const res = await axios.get("/api/auth/refresh", {
        withCredentials: true,
      });
      return res.data.data;
    } catch (error) {
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        toggleFavorite,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
