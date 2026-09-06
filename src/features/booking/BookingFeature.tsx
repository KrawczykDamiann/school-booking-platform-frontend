import { useContext, useState } from "react";
import styles from "./BookingFeature.module.scss";
import { BookingCalendar } from "./components/BookingCalendar/BookingCalendar";
import { LessonPreview } from "./components/LessonPreview/LessonPreview";
import { LessonPreviewContext } from "../../context/LessonPreviewContext";
import { bookLesson } from "../../api/lessons";
import { AuthContext } from "../../context/AuthContext";
import { ModalContext } from "../../context/ModalContext";
import { useBookingCalendar } from "./hooks/useBookingCalendar";
import { useLessonFilters } from "./hooks/useLessonFilters";
import { useSubjects } from "./hooks/useSubjects";
import { useLessons } from "./hooks/useLessons";
import { useCalendarLessons } from "./hooks/useCalendarLessons";
import { useStudentActiveBookings } from "./hooks/useStudentActiveBookings";
import { useFilteredLessons } from "./hooks/useFilteredLessons";
import { format } from "date-fns";
import { GuidanceList } from "./components/GuidanceList/GuidanceList";

type Booking = {
  uuid: string;
  studentUuid: string;
  lessonUuid: string;
  bookedAt: string;
  type: "ACCEPTED" | "REQUESTED";
};

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
  const { studentActiveBookings, bookedSlots, getBookedSubjectId } = useStudentActiveBookings();

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

    if (!selectedLessonUuid || !selectedLesson) {
      return;
    }

    setIsLoading(true);

    try {
      const start = new Date(selectedLesson?.startTime);
      const selectedLessonKey = `${format(start, "yyyy-MM-dd")}-${start.getHours()}`;

      if (bookedSlots.includes(selectedLessonKey)) {
        openModal({
          type: "booking",
          variant: "confirmationRequested",
          data: {
            onResetBooking: handleResetBooking,
          },
        });

        return;
      }

      const response: Booking = await bookLesson(selectedLessonUuid);
      const bookingType = response.type;
      const bookingUuid = response.uuid;

      if (bookingType === "REQUESTED") {
        openModal({
          type: "booking",
          variant: "lessonRequested",
          data: {
            onResetBooking: handleResetBooking,
            bookingUuid,
          },
        });
        return;
      } else if (bookingType === "ACCEPTED") {
        openModal({
          type: "booking",
          variant: "lessonBooked",
          data: {
            onResetBooking: handleResetBooking,
            bookingUuid,
          },
        });
        return;
      }
    } catch (error) {
      console.error(error);
      openModal({
        type: "booking",
        variant: "somethingWentWrong",
        data: {
          onResetBooking: handleResetBooking,
        },
      });
      return;
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
          subjects={subjects}
          onSelectSubject={handleSelectSubject}
          isSubjectsLoading={isSubjectsLoading}
          getBookedSubjectId={getBookedSubjectId}
        />
        <LessonPreview
          lesson={selectedLesson}
          handleConfirm={handleConfirm}
          subjects={subjects}
          isLoading={isLoading}
          studentActiveBookings={studentActiveBookings}
        />
      </div>
      <GuidanceList />
    </>
  );
};
