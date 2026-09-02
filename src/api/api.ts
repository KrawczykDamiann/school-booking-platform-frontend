import axios from "axios";
import { tokenService } from "../services/tokenService";

const rawBaseUrl = import.meta.env.VITE_SBP_BACKEND_BASE_URL || "";
// Strip any trailing slash from the baseURL
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, "");

export const api = axios.create({
  baseURL: cleanBaseUrl,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // If a baseURL with a path (e.g., /api) is provided, join the URL without stripping it via leading slashes
  if (cleanBaseUrl && config.url) {
    const cleanPath = config.url.replace(/^\/+/, "");
    // Prevent duplicate /api segments if baseURL already ends with /api and endpoint starts with api/
    if (cleanBaseUrl.endsWith("/api") && cleanPath.startsWith("api/")) {
      config.url = `${cleanBaseUrl}/${cleanPath.slice(4)}`;
    } else {
      config.url = `${cleanBaseUrl}/${cleanPath}`;
    }
  }

  if (config.url && config.url.includes("/api/auth")) {
    return config;
  }

  const token = tokenService.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});