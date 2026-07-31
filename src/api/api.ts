import axios from "axios";
import { tokenService } from "../services/tokenService";

export const api = axios.create({
  baseURL: import.meta.env.VITE_SBP_BACKEND_BASE_URL || "http://localhost:8082",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = tokenService.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
