import styles from "./CalendarToolbar.module.scss";
import calendarIcon from "../../../../assets/calendar.svg";
import { TIME_PERIODS, type TimePeriod } from "../../constants/timePeriods";

type CalendarToolbarProps = {
  periodOfDays: string;
  selectedTimePeriod: TimePeriod | null;
  onSelectTimePeriod: (period: TimePeriod) => void;
};

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  periodOfDays,
  selectedTimePeriod,
  onSelectTimePeriod,
}) => {
  return (
    <div className={styles.calendarToolbar}>
      <div className={styles.toolbarHeader}>
        <ul className={styles.timeFilterList}>
          {TIME_PERIODS.map((period) => (
            <li className={styles.timeFilterItem} key={period.id} data-selected={period.value === selectedTimePeriod}>
              <button className={styles.timeFilterButton} onClick={() => onSelectTimePeriod(period.value)}>{period.label}</button>
            </li>
          ))}
        </ul>
        <div className={styles.timePeriod}>
          <img
            src={calendarIcon}
            alt="Calendar icon"
            className={styles.calendarIcon}
          />
          <span className={styles.periodText}>{periodOfDays}</span>
        </div>
      </div>
      <span className={styles.toolbarText}>Select preferred period of time</span>
    </div>
  );
};
