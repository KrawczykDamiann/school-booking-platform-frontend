export interface Lesson {
  uuid: string;
  startTime: Date;
  subjectId: number;
  teacherUuid: string;
  maxEnrolled: number;
  enrolled: number;
  closingTime: Date;
}