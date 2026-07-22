import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import styles from "./BookingFeature.module.scss";
import { BookingCalendar } from "./components/BookingCalendar/BookingCalendar";
import { LessonPreview } from "./components/LessonPreview/LessonPreview";
import { SubjectFilter } from "./components/SubjectFilter/SubjectFilter";
import {
  addDays,
  format,
  isBefore,
  isSameDay,
  isSunday,
  startOfDay,
  subDays,
} from "date-fns";
import { LessonPreviewContext } from "../../context/LessonPreviewContext";
import { mockLessons } from "./mocks/lessons";
import type { SubjectFilterType } from "../../types/SubjectFilterType";
import { LessonBookingModal } from "../../components/LessonBookingModal/LessonBookingModal";
import { fetchLessons } from "../../api/lessons";
import type { TimePeriod } from "./constants/timePeriods";

export const BookingFeature: React.FC = () => {
  // State to manage the active starting date of the currently viewed calendar period.
  const [startDate, setStartDate] = useState(new Date());

  // Tracks active subject filter, letting users select or toggle off a subject.
  const [selectedSubject, setSelectedSubject] =
    useState<SubjectFilterType | null>(null);

  const handleSelectSubject = (subject: SubjectFilterType) => {
    if (selectedSubject === subject) {
      setSelectedSubject(null);
      return;
    }

    setSelectedSubject(subject);
  };

  // Tracks active time period filter, allowing users to select or toggle off a period
  const [selectedTimePeriod, setSelectedTimePeriod] =
    useState<TimePeriod | null>(null);

  const handleSelectTimePeriod = (period: TimePeriod) => {
    if (selectedTimePeriod === period) {
      setSelectedTimePeriod(null);
      return;
    }

    setSelectedTimePeriod(period);
  };

  // State to control the visibility of the lesson booking and status modal.
  const [isLessonBookingModalOpen, setIsLessonBookingModalOpen] =
    useState(false);

  // Context hook to manage the state of the currently selected lesson for preview or scheduling details.
  const { selectedLesson, setSelectedLesson } =
    useContext(LessonPreviewContext);

  // Navigates the calendar to the next day.
  const handleNextDate = () => {
    setStartDate((prev) => {
      const nextDate = addDays(prev, 1);

      return isSunday(nextDate) ? addDays(nextDate, 1) : nextDate;
    });
  };

  // Navigates the calendar to the previous day.
  // Includes a safety guard that prevents selecting past dates.
  const getValidStartDate = (date: Date): Date => {
    return isSunday(date) ? addDays(date, 1) : date;
  };

  const handlePrevDate = () => {
    const today = getValidStartDate(startOfDay(new Date()));

    let previousDate = subDays(startDate, 1);

    if (isSunday(previousDate)) {
      previousDate = subDays(previousDate, 1);
    }

    setStartDate(
      isBefore(startOfDay(previousDate), today) ? today : previousDate,
    );
  };

  // Disables backward navigation if the calendar view is already on today's date.
  const isPrevDisabled = isSameDay(startDate, new Date());

  // Generates an array of 6 consecutive days starting from the startDate, excluding Sunday.
  const currentWeek = useMemo(() => {
    const days: Date[] = [];
    let currentDate = startDate;

    while (days.length < 6) {
      if (!isSunday(currentDate)) {
        days.push(currentDate);
      }
      currentDate = addDays(currentDate, 1);
    }

    return days;
  }, [startDate]);

  // Defines the operational schedule hours (12 PM to 8 PM) for the calendar grid.
  // const availableHours = Array.from({ length: 13 }, (_, i) => i + 8);

  // Captures the start and end dates of the currently rendered 6-day week.
  const start = currentWeek[0];
  const end = currentWeek[5];

  // Generates a readable date range string to display as a toolbar title.
  // e.g July 17 - July 22
  const period = `${format(start, "MMMM d")} - ${format(end, "MMMM d")}`;

  // Loads initial lessons list once when the component first renders
  useEffect(() => {
    async function init() {
      try {
        const lessonsData = await fetchLessons();
        console.log(lessonsData);
      } catch (error) {
        console.log(error);
      }
    }

    init();
  }, []);

  // Filters the lessons array to include only those that match the currently selected subject.
  const filteredBySubject = mockLessons.filter(
    (lesson) => lesson.subject === selectedSubject,
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

  // Dynamically generates and memoizes hour ranges (8 AM to 9 PM) to filter grid time rows.
  const getAvailableHours = useCallback(() => {
    if (selectedTimePeriod) {
      switch (selectedTimePeriod) {
        case "morning":
          return Array.from({ length: 4 }, (_, i) => i + 8);
        case "afternoon":
          return Array.from({ length: 5 }, (_, i) => i + 12);
        case "evening":
          return Array.from({ length: 4 }, (_, i) => i + 17);
      }
    } else {
      return Array.from({ length: 13 }, (_, i) => i + 8);
    }
  }, [selectedTimePeriod]);

  const availableHours = useMemo(() => {
    return getAvailableHours();
  }, [getAvailableHours]);

  // Indexes lessons by date and hour to easily map them to their corresponding calendar slots.
  const lessonsMap = new Map();

  filteredByTimePeriod.forEach((lesson) => {
    const start = new Date(lesson.startTime);

    const key = `${format(start, "yyyy-MM-dd")}-${start.getHours()}`;

    lessonsMap.set(key, lesson);
  });

  // Helper function passed to CalendarGrid to resolve lesson data for each grid cell.
  const getLesson = (day: Date, hour: number) => {
    const key = `${format(day, "yyyy-MM-dd")}-${hour}`;

    return lessonsMap.get(key);
  };

  // Check if there is at least one lesson in the selected available hours for a specific day
  const hasLessonsOnDay = (day: Date) => {
    const key = format(day, "yyyy-MM-dd");
    return availableHours.some((hour) => lessonsMap.has(`${key}-${hour}`));
  };

  // Opens the lesson status modal when the user confirms their selection.
  const handleConfirm = () => {
    setIsLessonBookingModalOpen(true);
  };

  // Clears active selection, resets subject filters, and closes the booking modal.
  const handleResetBooking = () => {
    setSelectedSubject(null);
    setIsLessonBookingModalOpen(false);
    setSelectedLesson(undefined);
  };

  return (
    <>
      <SubjectFilter
        onSelectSubject={handleSelectSubject}
        selectedSubject={selectedSubject}
      />
      <div className={styles.bookingContent}>
        <BookingCalendar
          periodOfDays={period}
          currentWeek={currentWeek}
          availableHours={availableHours}
          getLesson={getLesson}
          handleNextDate={handleNextDate}
          handlePrevDate={handlePrevDate}
          isPrevDisabled={isPrevDisabled}
          onSelectTimePeriod={handleSelectTimePeriod}
          selectedTimePeriod={selectedTimePeriod}
          hasLessonsOnDay={hasLessonsOnDay}
        />
        {selectedLesson && (
          <LessonPreview
            lesson={selectedLesson}
            handleConfirm={handleConfirm}
          />
        )}
      </div>
      {isLessonBookingModalOpen && (
        <LessonBookingModal
          onClose={() => setIsLessonBookingModalOpen(false)}
          onResetBooking={handleResetBooking}
        />
      )}
    </>
  );
};
