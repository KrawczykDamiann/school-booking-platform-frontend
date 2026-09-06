import styles from "./CalendarToolbar.module.scss";
import calendarIcon from "../../../../assets/calendar.svg";
import { TIME_PERIODS, type TimePeriod } from "../../constants/timePeriods";
import { useTranslation } from "react-i18next";
import type { Subject } from "../../../../types/Subject";
import { SubjectSelection } from "../SubjectSelection/SubjectSelection";

type CalendarToolbarProps = {
  periodOfDays: string;
  selectedTimePeriod: TimePeriod | null;
  onSelectTimePeriod: (period: TimePeriod | null) => void;
  selectedSubjectId: number | null;
  subjects: Subject[] | null;
  onSelectSubject: (subjectId: number) => void;
  isSubjectsLoading: boolean;
};

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  periodOfDays,
  selectedTimePeriod,
  onSelectTimePeriod,
  selectedSubjectId,
  subjects,
  onSelectSubject,
  isSubjectsLoading,
}) => {
  const { t } = useTranslation();
  return (
    <div className={styles.calendarToolbar}>
      <div className={styles.toolbarHeader}>
        <h3 className={styles.toolbarTitle}>
          {t("bookingPage.showLessonsFor")}
        </h3>
        <SubjectSelection
          type="dropdown"
          subjects={subjects}
          onSelectSubject={onSelectSubject}
          selectedSubjectId={selectedSubjectId}
          isSubjectsLoading={isSubjectsLoading}
        />
      </div>
      <div className={styles.toolbarMain}>
        <div className={styles.timePeriod}>
          <img
            src={calendarIcon}
            alt="Calendar icon"
            className={styles.calendarIcon}
          />
          <span className={styles.periodText}>{periodOfDays}</span>
        </div>
        <ul className={styles.timeFilterList}>
          {TIME_PERIODS.map((period) => (
            <li
              className={styles.timeFilterItem}
              key={period.id}
              data-selected={period.value === selectedTimePeriod}
            >
              <button
                className={styles.timeFilterButton}
                onClick={() => onSelectTimePeriod(period.value)}
              >
                {t(`bookingPage.timePeriods.${period.value}`)}
              </button>
            </li>
          ))}
          <li className={styles.clearFilterItem}>
            <button
              className={styles.clearFilterButton}
              onClick={() => onSelectTimePeriod(null)}
            >
              {t("bookingPage.clearFilter")}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
