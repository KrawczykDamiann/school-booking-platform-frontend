import type { Lesson } from "../../../../types/Lesson";
import { CalendarGrid } from "../CalendarGrid/CalendarGrid";
import { CalendarToolbar } from "../CalendarToolbar/CalendarToolbar";
import styles from "./BookingCalendar.module.scss";
import warningIcon from "../../../../assets/warning.svg";
import type { TimePeriod } from "../../constants/timePeriods";
import type { SubjectFilterType } from "../../../../types/SubjectFilterType";

type BookingCalendarProps = {
  periodOfDays: string;
  currentWeek: Date[];
  availableHours: number[];
  getLesson: (day: Date, hour: number) => Lesson | undefined;
  handleNextDate: () => void;
  handlePrevDate: () => void;
  isPrevDisabled: boolean;
  selectedTimePeriod: TimePeriod | null;
  onSelectTimePeriod: (period: TimePeriod | null) => void;
  hasLessonsOnDay: (day: Date) => boolean;
  selectedSubject: SubjectFilterType | null;
};

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  periodOfDays,
  currentWeek,
  availableHours,
  getLesson,
  handleNextDate,
  handlePrevDate,
  isPrevDisabled,
  onSelectTimePeriod,
  selectedTimePeriod,
  hasLessonsOnDay,
  selectedSubject,
}) => {
  return (
    <div
      className={`${styles.bookingCalendar} ${!selectedSubject ? styles.bookingCalendarCollapsed : ""}`}
    >
      {!selectedSubject && (
        <div className={styles.bookingCalendarOverlay}>
          Select a subject to view slots
        </div>
      )}
      <CalendarToolbar
        periodOfDays={periodOfDays}
        onSelectTimePeriod={onSelectTimePeriod}
        selectedTimePeriod={selectedTimePeriod}
      />
      <CalendarGrid
        currentWeek={currentWeek}
        availableHours={availableHours}
        getLesson={getLesson}
        handleNextDate={handleNextDate}
        handlePrevDate={handlePrevDate}
        isPrevDisabled={isPrevDisabled}
        hasLessonsOnDay={hasLessonsOnDay}
      />
      <div className={styles.warningMessage}>
        <img
          src={warningIcon}
          alt="Warning icon"
          className={styles.warningIcon}
        />
        <p className={styles.warningText}>
          Our school is always closed on Sunday
        </p>
      </div>
    </div>
  );
};
