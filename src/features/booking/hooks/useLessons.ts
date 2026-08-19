import { useEffect, useState } from "react";
import { fetchLessons } from "../../../api/lessons";
import type { Lesson } from "../../../types/Lesson";

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const lessonsData = await fetchLessons();
        setLessons(lessonsData.content);
      } catch (error) {
        console.log(error);
      }
    }

    init();
  }, []);

  return {
    lessons,
  }
}
