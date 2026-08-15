import { useContext, useEffect, useMemo, useState } from "react";
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
import { LessonBookingModal } from "../../components/LessonBookingModal/LessonBookingModal";
import {
  bookLesson,
  fetchBookedLessons,
  fetchLessons,
} from "../../api/lessons";
import type { TimePeriod } from "./constants/timePeriods";
import { fetchSubjects } from "../../api/subjects";
import type { Lesson } from "../../types/Lesson";
import type { Subject } from "../../types/Subject";
import axios from "axios";

export const BookingFeature: React.FC = () => {
  // #region MAIN_CONTENT

  // State to manage the active starting date of the currently viewed calendar period.
  const [startDate, setStartDate] = useState(new Date());

  const [isLoading, setIsLoading] = useState(false);

  // Tracks active time period filter, allowing users to select or toggle off a period
  const [selectedTimePeriod, setSelectedTimePeriod] =
    useState<TimePeriod | null>(null);

  const handleSelectTimePeriod = (period: TimePeriod | null) => {
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
  const { selectedLessonUuid, setSelectedLessonUuid } =
    useContext(LessonPreviewContext);

  // Navigates the calendar to the next day.
  const handleNextDate = () => {
    setStartDate((prev) => {
      const nextDate = addDays(prev, 7);

      return isSunday(nextDate) ? addDays(nextDate, 7) : nextDate;
    });
  };

  // Navigates the calendar to the previous day.
  // Includes a safety guard that prevents selecting past dates.
  const getValidStartDate = (date: Date): Date => {
    return isSunday(date) ? addDays(date, 1) : date;
  };

  const handlePrevDate = () => {
    const today = getValidStartDate(startOfDay(new Date()));

    let previousDate = subDays(startDate, 7);

    if (isSunday(previousDate)) {
      previousDate = subDays(previousDate, 7);
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

  // Captures the start and end dates of the currently rendered 6-day week.
  const start = currentWeek[0];
  const end = currentWeek[5];

  // Generates a readable date range string to display as a toolbar title.
  // e.g July 17 - July 22
  const period = `${format(start, "MMMM d")} - ${format(end, "MMMM d")}`;

  const [lessons, setLessons] = useState<Lesson[] | null>(null);

  const selectedLesson = lessons?.find(
    (lesson) => lesson.uuid === selectedLessonUuid,
  );

  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
    null,
  );

  const handleSelectSubject = (subjectId: number) => {
    if (selectedSubjectId === subjectId) {
      setSelectedSubjectId(null);
      return;
    }

    setSelectedSubjectId(subjectId);
    setSelectedLessonUuid(undefined);
  };

  const [isSubjectsLoading, setIsSubjectsLoading] = useState(false);
  // Loads initial subjects list once when the component first renders
  useEffect(() => {
    async function init() {
      setIsSubjectsLoading(true);
      try {
        const subjectsData = await fetchSubjects();
        setSubjects(subjectsData.content);
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubjectsLoading(false);
      }
    }

    init();
  }, []);

  // Loads initial lessons list once when the component first renders
  useEffect(() => {
    async function init() {
      try {
        const lessonsData = await fetchLessons();
        setLessons(lessonsData.content);
      } catch (error) {
        console.log(error);
      }
    }

    init();
  }, []);

  const visibleLessons = lessons !== null ? lessons : [];

  const availableLessons = visibleLessons.filter(
    (lesson) => lesson.enrolled < lesson.maxEnrolled,
  );

  // Filters the lessons array to include only those that match the currently selected subject.
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

  // Dynamically generates and memoizes hour ranges (8 AM to 9 PM) to filter grid time rows.
  const availableHours = useMemo(() => {
    switch (selectedTimePeriod) {
      case "morning":
        return Array.from({ length: 4 }, (_, i) => i + 8);

      case "afternoon":
        return Array.from({ length: 5 }, (_, i) => i + 12);

      case "evening":
        return Array.from({ length: 4 }, (_, i) => i + 17);

      default:
        return Array.from({ length: 13 }, (_, i) => i + 8);
    }
  }, [selectedTimePeriod]);

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

  const [bookingUuid, setBookingUuid] = useState<string | null>(null);

  // Opens the lesson status modal when the user confirms their selection.
  const handleConfirm = async () => {
    setIsLoading(true);
    if (!selectedLessonUuid) {
      return;
    }

    try {
      const response = await bookLesson(selectedLessonUuid);

      const bookingUuid = response.uuid;
      if (bookingUuid) {
        setBookingUuid(bookingUuid);
        setIsLessonBookingModalOpen(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          console.log("error");
          return;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clears active selection, resets subject filters, and closes the booking modal.
  const handleResetBooking = () => {
    setSelectedSubjectId(null);
    setIsLessonBookingModalOpen(false);
    setSelectedLessonUuid(undefined);
  };

  // #endregion
  const [studentActiveBookings, setStudentActiveBookings] = useState<
    Lesson[] | null
  >(null);

  useEffect(() => {
    async function init() {
      try {
        const response = await fetchBookedLessons();

        setStudentActiveBookings(response);
      } catch (error) {
        setStudentActiveBookings(null);
        console.log(error);
      }
    }

    init();
  }, []);

  return (
    <>
      <SubjectFilter
        subjects={subjects}
        onSelectSubject={handleSelectSubject}
        selectedSubjectId={selectedSubjectId}
        isSubjectsLoading={isSubjectsLoading}
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
          selectedSubjectId={selectedSubjectId}
        />
        <LessonPreview
          lesson={selectedLesson}
          handleConfirm={handleConfirm}
          subjects={subjects}
          isLoading={isLoading}
          studentActiveBookings={studentActiveBookings}
        />
      </div>
      {isLessonBookingModalOpen && bookingUuid && (
        <LessonBookingModal
          onClose={() => setIsLessonBookingModalOpen(false)}
          onResetBooking={handleResetBooking}
          bookingUuid={bookingUuid}
        />
      )}
    </>
  );
};
