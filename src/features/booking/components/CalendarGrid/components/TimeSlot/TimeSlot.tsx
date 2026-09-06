import { useContext } from "react";
import type { Lesson } from "../../../../../../types/Lesson";
import styles from "./TimeSlot.module.scss";
import { LessonPreviewContext } from "../../../../../../context/LessonPreviewContext";

type TimeSlotProps = {
  lesson?: Lesson;
  hour: number;
  isBookedLesson: boolean;
};

export const TimeSlot: React.FC<TimeSlotProps> = ({ lesson, hour, isBookedLesson }) => {
  const { selectedLessonUuid, setSelectedLessonUuid } =
    useContext(LessonPreviewContext);

  const isSelected =
    lesson !== undefined && selectedLessonUuid === lesson.uuid;

  return (
    <li className={styles.timeSlot}>
      <button
        className={styles.slotButton}
        data-available={lesson ? "available" : "disabled"}
        data-selected={isSelected}
        data-booked={isBookedLesson}
        onClick={() => {
          if (lesson) {
            setSelectedLessonUuid(lesson.uuid);
          }
        }}
      >
        {hour}:00
      </button>
    </li>
  );
};
