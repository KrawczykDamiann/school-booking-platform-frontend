import { useEffect, useState } from "react";
import { fetchBookedLessons } from "../../../api/lessons";
import type { Lesson } from "../../../types/Lesson";

export function useStudentActiveBookings() {
  const [studentActiveBookings, setStudentActiveBookings] = useState<Lesson[]>(
    [],
  );

  useEffect(() => {
    async function init() {
      try {
        const response = await fetchBookedLessons();

        setStudentActiveBookings(response);
      } catch (error) {
        setStudentActiveBookings([]);
        console.log(error);
      }
    }

    init();
  }, []);

  return {
    studentActiveBookings,
  };
}
