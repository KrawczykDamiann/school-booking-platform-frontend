import axios from "axios";
import { tokenService } from "../services/tokenService";

// In dev, requests stay relative so Vite's proxy (see vite.config.ts) forwards
// them to the backend same-origin, avoiding CORS. Production builds have no
// dev proxy, so they need the real backend origin from the env variable.
const baseURL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_SBP_BACKEND_BASE_URL || "http://localhost:8082";

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = tokenService.getToken();

  if (token) {
    // AxiosHeaders.set() is the version-safe way to attach a header (plain
    // property assignment isn't guaranteed to survive header normalization).
    config.headers.set("Authorization", `Bearer ${token}`);
  } else {
    config.headers.delete("Authorization");
  }

  return config;
});
