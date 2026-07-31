export interface Lesson {
  lessonUuid: string;
  subject: string;
  teacherUuid: string;
  startTime: string;
  endTime: string;
  maxEnrolled: number;
  enrolled: number;
  closingTime: string;
}