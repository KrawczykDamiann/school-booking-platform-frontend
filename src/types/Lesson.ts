export type BookingType = "ACCEPTED" | "REQUESTED";

export interface Lesson {
  uuid: string;
  startTime: Date;
  subjectId: number;
  teacherUuid: string;
  maxEnrolled: number;
  enrolled: number;
  closingTime: Date;
  type?: BookingType;
}

export interface BookingDto {
  id?: number;
  uuid?: string;
  lessonUuid?: string;
  studentEmail?: string;
  type: BookingType;
}