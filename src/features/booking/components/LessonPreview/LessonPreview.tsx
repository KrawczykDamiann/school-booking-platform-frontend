import styles from "./LessonPreview.module.scss";
// import dropdownIcon from "../../../../assets/dropdown.svg";
import type { Lesson } from "../../../../types/Lesson";
import { format } from "date-fns";
import { Button } from "../../../../components/ui/Button/Button";

type LessonPreviewType = {
  lesson: Lesson | undefined;
  handleConfirm: () => void;
};

export const LessonPreview: React.FC<LessonPreviewType> = ({
  lesson,
  handleConfirm,
}) => {
  const isLessonEmpty = lesson === undefined;

  return (
    <div className={styles.lessonPreview}>
      {isLessonEmpty ? (
        <>
          <div className={styles.lessonPreviewHeader}>
            <h4 className={`${styles.title} ${styles.titleDisabled}`}>Selected lesson preview</h4>
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
            <h4 className={styles.title}>Selected lesson preview</h4>
            <span className={styles.description}>Review your timeslot</span>
          </div>
          <div className={styles.lessonPreviewContent}>
            <span className={styles.text}>The lesson to book:</span>
            <span className={styles.textSubject}>{lesson.subject}</span>
            <div className={styles.containerDate}>
              <span className={styles.textDate}>
                {format(new Date(lesson.startTime), "dd/MM")}
              </span>
              <span className={styles.textDate}>
                {format(new Date(lesson.startTime), "HH:mm")}
              </span>
            </div>
            {/* <button className={styles.dropdownTrigger}>
          <span>You already have active bookings</span>
          <img
            src={dropdownIcon}
            alt="Dropdown icon"
            className={styles.dropdownIcon}
          />
        </button> */}
            <div className={styles.buttonWrapper}>
              <Button variant="primary" onClick={handleConfirm}>
                Confirm
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
