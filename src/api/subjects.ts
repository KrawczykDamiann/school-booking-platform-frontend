import axios from "axios";
import { api } from "./api";

export async function fetchSubjects() {
  try {
    const response = await api.get("/api/subjects");

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message, {
        cause: error,
      });
    }

    throw error;
  }
}