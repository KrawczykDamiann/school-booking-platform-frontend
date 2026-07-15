import { format } from "date-fns";
import styles from "./CalendarGrid.module.scss";
import type { Lesson } from "../../../../types/Lesson";
import { TimeSlot } from "./components/TimeSlot/TimeSlot";
import { LeftIcon } from "../../../../components/icons/LeftIcon";
import { RightIcon } from "../../../../components/icons/RightIcon";

type CalendarGridProps = {
  currentWeek: Date[];
  availableHours: number[];
  getLesson: (day: Date, hour: number) => Lesson | undefined;
  handleNextDate: () => void;
  handlePrevDate: () => void;
  isPrevDisabled: boolean;
};

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentWeek,
  availableHours,
  getLesson,
  handleNextDate,
  handlePrevDate,
  isPrevDisabled,
}) => {
  return (
    <div className={styles.calendarGrid}>
      <button
        className={styles.calendarPrevButton}
        onClick={handlePrevDate}
        disabled={isPrevDisabled}
      >
        <LeftIcon size="16" className={styles.leftIcon}/>
      </button>
      <ul className={styles.daysList}>
        {currentWeek.map((day) => (
          <li key={day.toISOString()} className={styles.daysItem}>
            <div className={styles.headerColumn}>
              <span className={styles.date}>{format(day, "d")}</span>
              <span className={styles.weekDay}>{format(day, "EEEE")}</span>
            </div>
            <ul className={styles.listHours}>
              {availableHours.map((hour) => {
                const lesson = getLesson(day, hour);

                return <TimeSlot key={hour} hour={hour} lesson={lesson} />;
              })}
            </ul>
          </li>
        ))}
      </ul>
      <button className={styles.calendarNextButton} onClick={handleNextDate}>
        <RightIcon size="16" />
      </button>
    </div>
  );
};
