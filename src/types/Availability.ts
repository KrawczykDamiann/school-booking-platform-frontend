export interface TimeRange {
  startTime: string;
  endTime: string;
}

export interface Availability {
  teacherUuid: string;
  monday: TimeRange | null;
  tuesday: TimeRange | null;
  wednesday: TimeRange | null;
  thursday: TimeRange | null;
  friday: TimeRange | null;
  lunchBreak: TimeRange | null;
}
