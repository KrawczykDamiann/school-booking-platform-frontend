import styles from "./LessonPreview.module.scss";
import type { Lesson } from "../../../../types/Lesson";
import { format } from "date-fns";
import { Button } from "../../../../components/ui/Button/Button";
import type { Subject } from "../../../../types/Subject";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { DropdownIcon } from "../../../../components/icons/DropdownIcon";

type LessonPreviewType = {
  lesson: Lesson | undefined;
  handleConfirm: () => void;
  subjects: Subject[] | null;
  isLoading: boolean;
  studentActiveBookings: Lesson[];
};

export const LessonPreview: React.FC<LessonPreviewType> = ({
  lesson,
  handleConfirm,
  subjects,
  isLoading,
  studentActiveBookings,
}) => {
  const isLessonEmpty = lesson === undefined;
  const subject = subjects?.find((s) => s.id === lesson?.subjectId);
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const hasActiveBookings = studentActiveBookings.length !== 0;

  const getSubjectById = (subjectId: number) => {
    return subjects?.find((s) => s.id === subjectId)?.name;
  };

  useEffect(() => {
    return () => {
      setIsDropdownOpen(false);
    };
  }, []);

  return (
    <div className={styles.lessonPreview}>
      {isLessonEmpty ? (
        <>
          <div className={styles.lessonPreviewHeader}>
            <h4 className={`${styles.title} ${styles.titleDisabled}`}>
              {t("bookingPage.lessonPreview.title")}
            </h4>
            <span className={styles.description}>
              {t("bookingPage.lessonPreview.notSelected.subtitle")}
            </span>
          </div>
          <div className={styles.buttonWrapperDisabled}>
            <Button variant="primary" onClick={handleConfirm} disabled={true}>
              Confirm
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.lessonPreviewHeader}>
            <h4 className={styles.title}>
              {t("bookingPage.lessonPreview.title")}
            </h4>
            <span className={styles.description}>
              {t("bookingPage.lessonPreview.subtitle")}
            </span>
          </div>
          <div className={styles.lessonPreviewContent}>
            <span className={styles.text}>
              {t("bookingPage.lessonPreview.lessonToBook")}
            </span>
            <span className={styles.textSubject}>{subject?.name}</span>
            <div className={styles.containerDate}>
              <span className={styles.textDate}>
                {format(new Date(lesson.startTime), "dd/MM")}
              </span>
              <span className={styles.textDate}>
                {format(new Date(lesson.startTime), "HH:mm")}
              </span>
            </div>

            {hasActiveBookings && (
              <button
                className={styles.dropdownTrigger}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{t("bookingPage.lessonPreview.activeBookings")}</span>
                <DropdownIcon
                  size={16}
                  className={isDropdownOpen ? styles.dropdownIconActive : ""}
                />
              </button>
            )}

            {hasActiveBookings && isDropdownOpen && (
              <ul className={styles.activeBookingsList}>
                {studentActiveBookings.map((l) => (
                  <li key={l.uuid} className={styles.activeBookingsItem}>
                    <span className={styles.activeBookingsText}>
                      Subject:
                      <span className={styles.activeBookingsValue}>
                        {getSubjectById(l.subjectId)}
                      </span>
                    </span>
                    <span className={styles.activeBookingsText}>
                      Date:
                      <span className={styles.activeBookingsValue}>
                        {format(new Date(l.startTime), "dd/MM HH:mm")}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className={styles.buttonWrapper}>
              <Button
                variant="primary"
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading
                  ? t("bookingPage.lessonPreview.button_sending")
                  : t("bookingPage.lessonPreview.button_confirm")}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
