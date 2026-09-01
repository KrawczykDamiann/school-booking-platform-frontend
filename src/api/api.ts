import axios from "axios";
import { tokenService } from "../services/tokenService";

export const api = axios.create({
  baseURL: import.meta.env.VITE_SBP_BACKEND_BASE_URL || "http://localhost:8080",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (config.url && config.url.includes("/api/auth")) {
    return config;
  }

  const token = tokenService.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});