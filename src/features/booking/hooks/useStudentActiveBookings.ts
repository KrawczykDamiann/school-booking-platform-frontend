import { useContext, useEffect, useState } from "react";
import { fetchBookedLessons } from "../../../api/lessons";
import type { Lesson } from "../../../types/Lesson";
import { AuthContext } from "../../../context/AuthContext";
import { format } from "date-fns";

export function useStudentActiveBookings() {
  const [studentActiveBookings, setStudentActiveBookings] = useState<Lesson[]>(
    [],
  );
  const { isAuthenticated, userType } = useContext(AuthContext);

  const bookedSlots = studentActiveBookings.map((b) =>
    format(new Date(b.startTime), "yyyy-MM-dd-H"),
  );

  const bookedSubjectsBySlot = new Map();

  studentActiveBookings.forEach((b) => {
    const start = new Date(b.startTime);

    const key = `${format(start, "yyyy-MM-dd")}-${start.getHours()}`;

    bookedSubjectsBySlot.set(key, b.subjectId);
  });

  const getBookedSubjectId = (day: Date, hour: number) => {
    const key = `${format(day, "yyyy-MM-dd")}-${hour}`;

    return bookedSubjectsBySlot.get(key);
  };

  useEffect(() => {
    if (!isAuthenticated || userType !== "student") {
      return;
    }
    async function init() {
      try {
        const response = await fetchBookedLessons();

        setStudentActiveBookings(response);
      } catch (error) {
        setStudentActiveBookings([]);
        console.error(error);
      }
    }

    init();
  }, [isAuthenticated, userType]);

  return {
    studentActiveBookings,
    bookedSlots,
    getBookedSubjectId,
  };
}
