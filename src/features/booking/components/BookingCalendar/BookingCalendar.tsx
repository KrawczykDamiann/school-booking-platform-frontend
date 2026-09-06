import type { Lesson } from "../../../../types/Lesson";
import { CalendarGrid } from "../CalendarGrid/CalendarGrid";
import { CalendarToolbar } from "../CalendarToolbar/CalendarToolbar";
import styles from "./BookingCalendar.module.scss";
import warningIcon from "../../../../assets/warning.svg";
import type { TimePeriod } from "../../constants/timePeriods";
import { useTranslation } from "react-i18next";
import infoIcon from "../../../../assets/black-info-circle.svg";
import { SubjectSelection } from "../SubjectSelection/SubjectSelection";
import type { Subject } from "../../../../types/Subject";

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
  selectedSubjectId: number | null;
  subjects: Subject[] | null;
  onSelectSubject: (subjectId: number) => void;
  isSubjectsLoading: boolean;
  getBookedSubjectId: (day: Date, hour: number) => number;
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
  selectedSubjectId,
  subjects,
  onSelectSubject,
  isSubjectsLoading,
  getBookedSubjectId,
}) => {
  const { t } = useTranslation();

  if (!selectedSubjectId) {
    return (
      <div className={styles.bookingCalendar}>
        <div>
          <img src={infoIcon} alt="Info icon" className={styles.infoIcon} />
          <h3 className={styles.notSelectedSubjectTitle}>
            {t("bookingPage.notSelectedSubject")}
          </h3>
          <SubjectSelection
            type="list"
            subjects={subjects}
            onSelectSubject={onSelectSubject}
            selectedSubjectId={selectedSubjectId}
            isSubjectsLoading={isSubjectsLoading}
          />
        </div>
      </div>
    );
  }
  return (
    <div
      className={`${styles.bookingCalendar} ${!selectedSubjectId ? styles.bookingCalendarCollapsed : ""}`}
    >
      {!selectedSubjectId && (
        <div className={styles.bookingCalendarOverlay}>
          {t("bookingPage.notSelectedSubject")}
        </div>
      )}
      <CalendarToolbar
        periodOfDays={periodOfDays}
        onSelectTimePeriod={onSelectTimePeriod}
        selectedTimePeriod={selectedTimePeriod}
        subjects={subjects}
        onSelectSubject={onSelectSubject}
        selectedSubjectId={selectedSubjectId}
        isSubjectsLoading={isSubjectsLoading}
      />
      <CalendarGrid
        currentWeek={currentWeek}
        availableHours={availableHours}
        getLesson={getLesson}
        handleNextDate={handleNextDate}
        handlePrevDate={handlePrevDate}
        isPrevDisabled={isPrevDisabled}
        hasLessonsOnDay={hasLessonsOnDay}
        getBookedSubjectId={getBookedSubjectId}
        selectedSubjectId={selectedSubjectId}
      />
      <div className={styles.warningMessage}>
        <img
          src={warningIcon}
          alt="Warning icon"
          className={styles.warningIcon}
        />
        <p className={styles.warningText}>{t("bookingPage.notification")}</p>
      </div>
    </div>
  );
};
