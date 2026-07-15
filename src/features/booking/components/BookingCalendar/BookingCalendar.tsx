import type { Lesson } from "../../../../types/Lesson";
import { CalendarGrid } from "../CalendarGrid/CalendarGrid";
import { CalendarToolbar } from "../CalendarToolbar/CalendarToolbar";
import styles from "./BookingCalendar.module.scss";
import warningIcon from "../../../../assets/warning.svg";

type BookingCalendarProps = {
  periodOfDays: string;
  currentWeek: Date[];
  availableHours: number[];
  getLesson: (day: Date, hour: number) => Lesson | undefined;
  handleNextDate: () => void;
  handlePrevDate: () => void;
  isPrevDisabled: boolean;
};

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  periodOfDays,
  currentWeek,
  availableHours,
  getLesson,
  handleNextDate,
  handlePrevDate,
  isPrevDisabled,
}) => {
  return (
    <div className={styles.bookingCalendar}>
      <CalendarToolbar periodOfDays={periodOfDays} />
      <CalendarGrid
        currentWeek={currentWeek}
        availableHours={availableHours}
        getLesson={getLesson}
        handleNextDate={handleNextDate}
        handlePrevDate={handlePrevDate}
        isPrevDisabled={isPrevDisabled}
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
