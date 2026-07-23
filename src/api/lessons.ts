import axios from "axios";
import { api } from "./api";

type LessonsPostData = {
  availabilitySlotUuid: string;
  teacherUuid: string;
  maxEnrolled: number;
}

export async function fetchLessons() {
  try {
    const response = await api.get("/api/lessons");

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

export async function createLesson(data: LessonsPostData) {
  try {
    const response = await api.post("/api/lessons", data);

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

export async function bookLesson(lessonUuid: string) {
  try {
    const response = await api.post(`/api/lessons/${lessonUuid}/booking`);

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