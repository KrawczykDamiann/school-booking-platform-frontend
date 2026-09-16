import axios from "axios";
import { api } from "./api";

type LessonsPostData = {
  availabilitySlotUuid: string;
  teacherUuid: string;
  maxEnrolled: number;
};

export async function fetchLessonsBySubjectId(subjectId: number) {
  const currentDate = new Date();
  try {
    const response = await api.get("/api/lessons/search", {
      params: {
        from: currentDate,
        "subject.id": subjectId,
      },
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
      throw error;
    }

    throw new Error("Unexpected error", {
      cause: error,
    });
  }
}

export async function fetchBookedLessons() {
  try {
    const response = await api.get("/api/lessons/booked");

    return response.data.content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message, {
        cause: error,
      });
    }

    throw error;
  }
}
