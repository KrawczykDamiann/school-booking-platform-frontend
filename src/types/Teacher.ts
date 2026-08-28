import type { Subject } from './Subject';

export interface Teacher {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  zoneId?: string;
  color: string;
  subject: Subject;
}

export interface PublicTeacher {
  uuid: string;
  firstName: string;
  lastName: string;
  color?: string;
  subject?: Subject;
}

export interface CreateTeacherPayload {
  firstName: string;
  lastName: string;
  email: string;
  zoneId: string;
  subjectId: number;
}