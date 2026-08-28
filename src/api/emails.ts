import axios from "axios";
import { api } from "./api";

export async function fetchEmails(page = 0, size = 200) {
  try {
    const response = await api.get("/api/emails", {
      params: { page, size },
    });

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
