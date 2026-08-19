import type { Lesson } from "../../../types/Lesson";
import type { TimePeriod } from "../constants/timePeriods";

export function useFilteredLessons(
  lessons: Lesson[],
  selectedSubjectId: number,
  selectedTimePeriod: TimePeriod | null,
) {
  const availableLessons = lessons.filter(
    (lesson) => lesson.enrolled < lesson.maxEnrolled,
  );

  const filteredBySubject = availableLessons.filter(
    (lesson) => lesson.subjectId === selectedSubjectId,
  );

  const filteredByTimePeriod = filteredBySubject.filter((lesson) => {
    const startTime = new Date(lesson.startTime).getHours();

    if (selectedTimePeriod) {
      switch (selectedTimePeriod) {
        case "morning":
          return startTime >= 8 && startTime < 12;
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
