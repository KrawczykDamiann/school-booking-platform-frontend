import { useContext } from "react";
import type { Lesson } from "../../../../../../types/Lesson";
import styles from "./TimeSlot.module.scss";
import { LessonPreviewContext } from "../../../../../../context/LessonPreviewContext";

type TimeSlotProps = {
  lesson?: Lesson;
  hour: number;
};

export const TimeSlot: React.FC<TimeSlotProps> = ({ lesson, hour }) => {
  const { selectedLessonUuid: selectedLessonId, setSelectedLessonUuid: setSelectedLessonId } =
    useContext(LessonPreviewContext);

  const isSelected =
    lesson !== undefined && selectedLessonId === lesson.uuid;

  return (
    <li className={styles.timeSlot}>
      <button
        className={styles.slotButton}
        data-available={lesson ? "available" : "disabled"}
        data-selected={isSelected}
        onClick={() => {
          if (lesson) {
            setSelectedLessonId(lesson.uuid);
          }
        }}
      >
        {hour}:00
      </button>
    </li>
  );
};
