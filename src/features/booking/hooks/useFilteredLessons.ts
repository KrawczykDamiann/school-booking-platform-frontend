import type { Lesson } from "../../../types/Lesson";
import type { TimePeriod } from "../constants/timePeriods";

const START_HOUR = 8;
const END_HOUR = 20;

export function useFilteredLessons(
  lessons: Lesson[],
  selectedTimePeriod: TimePeriod | null,
) {
  const availableLessons = lessons.filter(
    (lesson) => lesson.enrolled < lesson.maxEnrolled,
  );

  const filterLessonsByTime = availableLessons.filter((lesson) => {
    const startTime = new Date(lesson.startTime).getHours();
    const endTime = new Date(lesson.closingTime).getHours();

    return startTime >= START_HOUR && endTime <= END_HOUR;
  });

  const filteredByTimePeriod = filterLessonsByTime.filter((lesson) => {
    const startTime = new Date(lesson.startTime).getHours();

    if (selectedTimePeriod) {
      switch (selectedTimePeriod) {
        case "morning":
          return startTime >= START_HOUR && startTime < 12;
        case "afternoon":
          return startTime >= 12 && startTime < 17;
        case "evening":
          return startTime >= 17;
      }
    } else {
      return 1;
    }
  });

  return {
    filteredLessons: filteredByTimePeriod,
  };
}
