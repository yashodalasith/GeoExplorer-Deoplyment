import api from "./api";

export const registerService = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginService = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const logoutService = async () => {
  const response = await api.get("/auth/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data.data;
};

export const toggleFavorite = async (countryCode) => {
  const response = await api.put("/auth/favorites", { countryCode });
  return response.data;
};
