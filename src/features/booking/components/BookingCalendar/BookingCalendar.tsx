import type { Lesson } from "../../../../types/Lesson";
import { CalendarGrid } from "../CalendarGrid/CalendarGrid";
import { CalendarToolbar } from "../CalendarToolbar/CalendarToolbar";
import styles from "./BookingCalendar.module.scss";
import warningIcon from "../../../../assets/warning.svg";
import type { TimePeriod } from "../../constants/timePeriods";

type BookingCalendarProps = {
  periodOfDays: string;
  currentWeek: Date[];
  availableHours: number[];
  getLesson: (day: Date, hour: number) => Lesson | undefined;
  handleNextDate: () => void;
  handlePrevDate: () => void;
  isPrevDisabled: boolean;
  selectedTimePeriod: TimePeriod | null;
  onSelectTimePeriod: (period: TimePeriod) => void;
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
}) => {
  return (
    <div className={styles.bookingCalendar}>
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
