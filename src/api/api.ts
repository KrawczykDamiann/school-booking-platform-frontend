import axios from "axios";
import { tokenService } from "../services/tokenService";

const rawBaseUrl = import.meta.env.VITE_SBP_BACKEND_BASE_URL || "";
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, "");

if (!cleanBaseUrl) {
  // Loud failure: without this the interceptor would silently target the app's own origin.
  console.error(
    "[api] VITE_SBP_BACKEND_BASE_URL is not set - it was empty at build time. " +
      "All API requests will fail until the frontend is rebuilt with this variable defined.",
  );
}

export const api = axios.create({
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (!cleanBaseUrl) {
    // Refuse to send the request rather than silently hitting the frontend's own origin/root.
    return Promise.reject(
      new Error(
        "API request blocked: VITE_SBP_BACKEND_BASE_URL is not configured (empty at build time).",
      ),
    );
  }

  // Build the complete URL manually so Axios cannot strip any subpath
  if (config.url) {
    const cleanPath = config.url.replace(/^\/+/, "");

    if (cleanBaseUrl.endsWith("/api") && cleanPath.startsWith("api/")) {
      config.url = `${cleanBaseUrl}/${cleanPath.slice(4)}`;
    } else {
      config.url = `${cleanBaseUrl}/${cleanPath}`;
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
