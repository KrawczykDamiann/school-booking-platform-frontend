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
  };
}
