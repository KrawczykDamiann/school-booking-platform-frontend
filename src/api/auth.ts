import axios from "axios";
import { api } from "./api";

type LoginPostBody = {
  email: string;
  password: string;
};

export async function login(data: LoginPostBody) {
  try {
    const response = await api.post("/api/auth/login", data);

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
