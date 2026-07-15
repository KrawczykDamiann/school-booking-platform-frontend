import { useContext, useMemo, useState } from "react";
import styles from "./BookingFeature.module.scss";
import { BookingCalendar } from "./components/BookingCalendar/BookingCalendar";
import { LessonPreview } from "./components/LessonPreview/LessonPreview";
import { SubjectFilter } from "./components/SubjectFilter/SubjectFilter";
import { addDays, format, isBefore, isSameDay, startOfDay, subDays } from "date-fns";
import { LessonPreviewContext } from "../../context/LessonPreviewContext";
import { mockLessons } from "./mocks/lessons";

export const BookingFeature: React.FC = () => {
  const [startDate, setStartDate] = useState(new Date());

  const { selectedLesson } = useContext(LessonPreviewContext);

  const handleNextDate = () => {
    setStartDate((prev) => addDays(prev, 1));
  };

  const handlePrevDate = () => {
    const previousDate = subDays(startDate, 1);
    const today = startOfDay(new Date());

    setStartDate(
      isBefore(startOfDay(previousDate), today) ? today : previousDate,
    );
  };

  const isPrevDisabled = isSameDay(
    startOfDay(startDate),
    startOfDay(new Date()),
  );

  const currentWeek = useMemo(() => {
    return Array.from({ length: 6 }, (_, index) => addDays(startDate, index));
  }, [startDate]);

  const start = currentWeek[0];
  const end = currentWeek[5];

  const period = `${format(start, "MMMM d")} - ${format(end, "MMMM d")}`;

  const lessonsMap = new Map();

  // We get a unique calendar cell - "2026-07-20"
  mockLessons.forEach((lesson) => {
    const start = new Date(lesson.startTime);

    const key = `${format(start, "yyyy-MM-dd")}-${start.getHours()}`;

    lessonsMap.set(key, lesson);
  });

  const availableHours = Array.from({ length: 9 }, (_, i) => i + 12);

  const getLesson = (day: Date, hour: number) => {
    const key = `${format(day, "yyyy-MM-dd")}-${hour}`;

    return lessonsMap.get(key);
  };

  return (
    <>
      <SubjectFilter />
      <div className={styles.bookingContent}>
        <BookingCalendar
          periodOfDays={period}
          currentWeek={currentWeek}
          availableHours={availableHours}
          getLesson={getLesson}
          handleNextDate={handleNextDate}
          handlePrevDate={handlePrevDate}
          isPrevDisabled={isPrevDisabled}
        />
        {selectedLesson && <LessonPreview lesson={selectedLesson} />}
      </div>
    </>
  );
};
