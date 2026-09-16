import { useEffect, useState } from "react";
import { fetchLessonsBySubjectId } from "../../../api/lessons";
import type { Lesson } from "../../../types/Lesson";

export function useLessons(selectedSubjectId: number) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLessonsLoading, setIsLessonsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setIsLessonsLoading(true);
    
      if (!selectedSubjectId) {
        setLessons([]);
        setIsLessonsLoading(false);
        return;
      }

      try {
        const lessonsData = await fetchLessonsBySubjectId(selectedSubjectId);
        setLessons(lessonsData.content);
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
      } finally {
        setIsLessonsLoading(false);
      }
    }

    init();
  }, [selectedSubjectId]);

  return {
    lessons,
    isLessonsLoading,
  };
}
