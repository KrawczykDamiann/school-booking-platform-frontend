import { api } from "./api";

export interface TimeRangeDto {
  startTime: string;
  endTime: string;
}

export interface TeacherAvailabilityDto {
  monday?: TimeRangeDto | null;
  tuesday?: TimeRangeDto | null;
  wednesday?: TimeRangeDto | null;
  thursday?: TimeRangeDto | null;
  friday?: TimeRangeDto | null;
  saturday?: TimeRangeDto | null;
  sunday?: TimeRangeDto | null;
  lunchBreak?: TimeRangeDto | null;
}

export interface TeacherDto {
  id?: number;
  uuid?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatarUrl?: string | null;
  color?: string;
  subjectColor?: string;
  subjectId?: number;
  subject?: string | { id: number; name: string; color?: string; description?: string };
  collabType?: "Contract" | "Freelance";
  dueDate?: string | null;
  availability?: TeacherAvailabilityDto;
}

export const getTeachers = async (): Promise<TeacherDto[]> => {
  const response = await api.get<TeacherDto[]>("/api/teachers");
  return response.data;
};

export const getTeacherByUuid = async (uuid: string): Promise<TeacherDto> => {
  const response = await api.get<TeacherDto>(`/api/teachers/${uuid}`);
  return response.data;
};

export const createTeacher = async (teacher: Partial<TeacherDto>): Promise<TeacherDto> => {
  const response = await api.post<TeacherDto>("/api/teachers", teacher);
  return response.data;
};

export const updateTeacher = async (
  uuid: string,
  teacher: Partial<TeacherDto>
): Promise<TeacherDto> => {
  const response = await api.put<TeacherDto>(`/api/teachers/${uuid}`, teacher);
  return response.data;
};

export const updateTeacherAvatar = async (
  uuid: string,
  avatarUrl: string
): Promise<void> => {
  await api.put(`/api/teachers/${uuid}/avatar`, { avatarUrl });
};

export const getTeacherAvailability = async (
  uuid: string
): Promise<TeacherAvailabilityDto> => {
  const response = await api.get<TeacherAvailabilityDto>(
    `/api/teachers/${uuid}/availability`
  );
  return response.data;
};

export const updateTeacherAvailability = async (
  uuid: string,
  availability: TeacherAvailabilityDto
): Promise<void> => {
  await api.put(`/api/teachers/${uuid}/availability`, availability);
};

export const deleteTeacher = async (idOrUuid: string | number): Promise<void> => {
  await api.delete(`/api/teachers/${idOrUuid}`);
};
