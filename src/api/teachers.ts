import { api } from "./api";

export interface TeacherDto {
  id?: number;
  uuid?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatarUrl?: string | null;
  subjectId?: number;
  subject?: string | { id: number; name: string; description?: string };
  subjectColor?: string;
  collabType?: "Contract" | "Freelance";
  dueDate?: string | null;
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

export const deleteTeacher = async (idOrUuid: string | number): Promise<void> => {
  await api.delete(`/api/teachers/${idOrUuid}`);
};