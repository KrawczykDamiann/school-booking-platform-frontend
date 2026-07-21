import axios from "axios";
import { api } from "./api";

export async function fetchLessons() {
  try {
    const response = await api.get("/api/lessons");

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || "Log in failed", {
        cause: error,
      });
    }

    throw error;
  }
}