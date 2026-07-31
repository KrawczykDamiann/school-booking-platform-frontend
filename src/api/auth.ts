import axios from "axios";
import { api } from "./api";

type LoginAdminPostBody = {
  email: string;
  password: string;
};

type RequestStudentOttBody = {
  email: string;
  zoneId: string;
}

type LoginStudentWithOttBody = {
  token: string;
}

export async function loginAdmin(data: LoginAdminPostBody) {
  try {
    const response = await api.post("/api/auth/login", data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }

    throw new Error("Unexpected error", {
      cause: error,
    });
  }
}

export async function requestStudentOtt(data: RequestStudentOttBody) {
  try {
    const response = await api.post("/api/auth/ott/generate", data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }

    throw new Error("Unexpected error", {
      cause: error,
    });
  }
}

export async function loginStudentWithOtt(data: LoginStudentWithOttBody) {
  try {
    const response = await api.post("/api/auth/ott", data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }

    throw new Error("Unexpected error", {
      cause: error,
    });
  }
}
