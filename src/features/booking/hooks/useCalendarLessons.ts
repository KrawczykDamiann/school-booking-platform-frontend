import { format } from "date-fns";
import type { Lesson } from "../../../types/Lesson";

export function useCalendarLessons(
  lessons: Lesson[],
  availableHours: number[],
) {
  const lessonsMap = new Map();

  lessons.forEach((lesson) => {
    const start = new Date(lesson.startTime);

    const key = `${format(start, "yyyy-MM-dd")}-${start.getHours()}`;

    lessonsMap.set(key, lesson);
  });

  const getLesson = (day: Date, hour: number) => {
    const key = `${format(day, "yyyy-MM-dd")}-${hour}`;

    return lessonsMap.get(key);
  };

  const hasLessonsOnDay = (day: Date) => {
    const key = format(day, "yyyy-MM-dd");
    return availableHours.some((hour) => lessonsMap.has(`${key}-${hour}`));
  };

  return {
    getLesson,
    hasLessonsOnDay,
  };
}
