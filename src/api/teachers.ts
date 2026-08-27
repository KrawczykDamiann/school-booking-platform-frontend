import axios from "axios";
import { api } from "./api";

export type CreateTeacherBody = {
  email: string;
  firstName: string;
  lastName: string;
  zoneId?: string;
  subjectId: number;
};

export type UpdateTeacherBody = CreateTeacherBody;

export type TimeRangeBody = {
  startTime: string;
  endTime: string;
} | null;

export type UpdateAvailabilityBody = {
  monday: TimeRangeBody;
  tuesday: TimeRangeBody;
  wednesday: TimeRangeBody;
  thursday: TimeRangeBody;
  friday: TimeRangeBody;
  lunchBreak: TimeRangeBody;
};

export async function fetchTeachers(page = 0, size = 100) {
  try {
    const response = await api.get("/api/teachers", {
      params: { page, size },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message, {
        cause: error,
      });
    }

    throw error;
  }
}

export async function fetchPublicTeachers(page = 0, size = 100) {
  try {
    const response = await api.get("/api/teachers/uuids", {
      params: { page, size },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message, {
        cause: error,
      });
    }

    throw error;
  }
}

export async function fetchTeacher(uuid: string) {
  try {
    const response = await api.get(`/api/teachers/${uuid}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message, {
        cause: error,
      });
    }

    throw error;
  }
}

export async function createTeacher(data: CreateTeacherBody) {
  try {
    const response = await api.post("/api/teachers", data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message, {
        cause: error,
      });
    }

    throw error;
  }
}

export async function updateTeacher(uuid: string, data: UpdateTeacherBody) {
  try {
    const response = await api.put(`/api/teachers/${uuid}`, data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message, {
        cause: error,
      });
    }

    throw error;
  }
}

export async function deleteTeacher(uuid: string) {
  try {
    const response = await api.delete(`/api/teachers/${uuid}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message, {
        cause: error,
      });
    }

    throw error;
  }
}

export async function fetchTeacherAvailability(uuid: string) {
  try {
    const response = await api.get(`/api/teachers/${uuid}/availability`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message, {
        cause: error,
      });
    }

    throw error;
  }
}

export async function updateTeacherAvailability(
  uuid: string,
  data: UpdateAvailabilityBody,
) {
  try {
    const response = await api.put(`/api/teachers/${uuid}/availability`, data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message, {
        cause: error,
      });
    }

    throw error;
  }
}