import styles from "./LessonPreview.module.scss";
// import dropdownIcon from "../../../../assets/dropdown.svg";
import { Button } from "../../../../components/ui/Button/Button";
import type { Lesson } from "../../../../types/Lesson";
import { format } from "date-fns";
import { useContext } from "react";
import { LessonPreviewContext } from "../../../../context/LessonPreviewContext";

type LessonPreviewType = {
  lesson: Lesson;
}

export const LessonPreview: React.FC<LessonPreviewType> = ({ lesson }) => {
  const { setSelectedLesson } = useContext(LessonPreviewContext);
  return (
    <div className={styles.lessonPreview}>
      <div className={styles.lessonPreviewHeader}>
        <div className={styles.lessonPreviewHeaderTop}>
          <h4 className={styles.title}>Selected lesson preview</h4>
          <button className={styles.closeButton} onClick={() => setSelectedLesson(undefined)}>✕</button>
        </div>
        <span className={styles.description}>Description</span>
      </div>
      <div className={styles.lessonPreviewContent}>
        <span className={styles.text}>The lesson to book:</span>
        <span className={styles.textSubject}>{lesson.subject}</span>
        <div className={styles.containerDate}>
          <span className={styles.textDate}>{format(new Date(lesson.startTime), "dd/MM")}</span>
          <span className={styles.textDate}>{format(new Date(lesson.startTime), "HH:mm")}</span>
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
          <Button text="Confirm" type="button" />
        </div>
      </div>
    </div>
  );
};
