import { useContext, useState } from "react";
import styles from "./BookingFeature.module.scss";
import { BookingCalendar } from "./components/BookingCalendar/BookingCalendar";
import { LessonPreview } from "./components/LessonPreview/LessonPreview";
import { SubjectFilter } from "./components/SubjectFilter/SubjectFilter";
import { LessonPreviewContext } from "../../context/LessonPreviewContext";
import { bookLesson } from "../../api/lessons";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { ModalContext } from "../../context/ModalContext";
import { useBookingCalendar } from "./hooks/useBookingCalendar";
import { useLessonFilters } from "./hooks/useLessonFilters";
import { useSubjects } from "./hooks/useSubjects";
import { useLessons } from "./hooks/useLessons";
import { useCalendarLessons } from "./hooks/useCalendarLessons";
import { useStudentActiveBookings } from "./hooks/useStudentActiveBookings";
import { useFilteredLessons } from "./hooks/useFilteredLessons";

export const BookingFeature: React.FC = () => {

  const { selectedLessonUuid, setSelectedLessonUuid } =
    useContext(LessonPreviewContext);
  const { openModal, closeModal } = useContext(ModalContext);
  const { isAuthenticated } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const {
    currentWeek,
    period,
    isPrevDisabled,
    handleNextDate,
    handlePrevDate,
  } = useBookingCalendar();

  const {
    selectedSubjectId,
    setSelectedSubjectId,
    handleSelectSubject,
    selectedTimePeriod,
    handleSelectTimePeriod,
    availableHours,
  } = useLessonFilters();

  const { subjects, isSubjectsLoading } = useSubjects();
  const { lessons } = useLessons();
  const { studentActiveBookings } = useStudentActiveBookings();

  const selectedLesson = lessons?.find(
    (lesson) => lesson.uuid === selectedLessonUuid,
  );

  const { filteredLessons } = useFilteredLessons(
    lessons,
    selectedSubjectId ? selectedSubjectId : 0,
    selectedTimePeriod,
  );

  const { getLesson, hasLessonsOnDay } = useCalendarLessons(
    filteredLessons,
    availableHours,
  );

  // Opens the lesson status modal when the user confirms their selection.
  const handleConfirm = async () => {
    if (!isAuthenticated) {
      openModal({ type: "login" });
      return;
    }

    setIsLoading(true);
    if (!selectedLessonUuid) {
      return;
    }

    try {
      const response = await bookLesson(selectedLessonUuid);

      const bookingUuid: string = response.uuid;
      if (bookingUuid) {
        openModal({
          type: "lessonBooked",
          data: {
            onResetBooking: handleResetBooking,
            bookingUuid,
          },
        });
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
    setSelectedLessonUuid(undefined);
    closeModal();
  };

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
    </>
  );
};
