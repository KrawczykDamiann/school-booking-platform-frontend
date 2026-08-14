import styles from "./LessonPreview.module.scss";
// import dropdownIcon from "../../../../assets/dropdown.svg";
import type { Lesson } from "../../../../types/Lesson";
import { format } from "date-fns";
import { Button } from "../../../../components/ui/Button/Button";
import type { Subject } from "../../../../types/Subject";
import { useTranslation } from "react-i18next";

type LessonPreviewType = {
  lesson: Lesson | undefined;
  handleConfirm: () => void;
  subjects: Subject[] | null;
  isLoading: boolean;
};

export const LessonPreview: React.FC<LessonPreviewType> = ({
  lesson,
  handleConfirm,
  subjects,
  isLoading,
}) => {
  const isLessonEmpty = lesson === undefined;
  const subject = subjects?.find((s) => s.id === lesson?.subjectId);
  const { t } = useTranslation();

  return (
    <div className={styles.lessonPreview}>
      {isLessonEmpty ? (
        <>
          <div className={styles.lessonPreviewHeader}>
            <h4 className={`${styles.title} ${styles.titleDisabled}`}>
              {t("bookingPage.lessonPreview.title")}
            </h4>
            <span className={styles.description}>
              You selected timeslot will be shown here
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
            {/* <button className={styles.dropdownTrigger}>
          <span>{t("bookingPage.lessonPreview.activeBookings")}</span>
          <img
            src={dropdownIcon}
            alt="Dropdown icon"
            className={styles.dropdownIcon}
          />
        </button> */}

            <div className={styles.buttonWrapper}>
              <Button variant="primary" onClick={handleConfirm}>
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
