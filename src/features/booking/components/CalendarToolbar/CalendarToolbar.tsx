import style from "./CalendarToolbar.module.scss";
import calendarIcon from "../../../../assets/calendar.svg";

type CalendarToolbarProps = {
  periodOfDays: string;
};

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  periodOfDays,
}) => {
  return (
    <div className={style.calendarToolbar}>
      <div className={style.toolbarHeader}>
        <ul className={style.timeFilterList}>
          <li className={style.timeFilterItem}>Afternoon</li>
          <li className={style.timeFilterItem}>Evening</li>
        </ul>
        <div className={style.timePeriod}>
          <img
            src={calendarIcon}
            alt="Calendar icon"
            className={style.calendarIcon}
          />
          <span className={style.periodText}>{periodOfDays}</span>
        </div>
      </div>
      <span className={style.toolbarText}>Select preferred period of time</span>
    </div>
  );
};
