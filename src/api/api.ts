import axios from "axios";
import { tokenService } from "../services/tokenService";

const rawBaseUrl = import.meta.env.VITE_SBP_BACKEND_BASE_URL || "";
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, "");

export const api = axios.create({
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // Build the complete URL manually so Axios cannot strip any subpath
  if (config.url) {
    if (cleanBaseUrl) {
      const cleanPath = config.url.replace(/^\/+/, "");

      if (cleanBaseUrl.endsWith("/api") && cleanPath.startsWith("api/")) {
        config.url = `${cleanBaseUrl}/${cleanPath.slice(4)}`;
      } else {
        config.url = `${cleanBaseUrl}/${cleanPath}`;
      }
    }

    // Clear baseURL to prevent Axios internal URL resolver from overriding the joined path
    config.baseURL = "";
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
