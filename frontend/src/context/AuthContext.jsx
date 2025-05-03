import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

// Use VITE_API_URL from env, fallback to '/api' for local dev
const API_URL =
  import.meta.env.MODE === "development"
    ? "/api"
    : import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/me`, {
          withCredentials: true,
        });
        setUser(res.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData, {
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

  const login = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData, {
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

  const logout = async () => {
    try {
      await axios.get(`${API_URL}/auth/logout`, { withCredentials: true });
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Logout failed");
    }
  };

  const toggleFavorite = async (countryCode) => {
    try {
      const res = await axios.put(
        `${API_URL}/auth/favorites`,
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

  const refreshToken = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/refresh`, {
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
