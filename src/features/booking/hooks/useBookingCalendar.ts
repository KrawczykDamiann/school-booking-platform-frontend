import {
  addDays,
  format,
  isBefore,
  isSameDay,
  isSunday,
  startOfDay,
  subDays,
} from "date-fns";
import { useMemo, useState } from "react";

export function useBookingCalendar() {
  const [startDate, setStartDate] = useState(new Date());

  const currentWeek = useMemo(() => {
    const days: Date[] = [];
    let currentDate = startDate;

    while (days.length < 6) {
      if (!isSunday(currentDate)) {
        days.push(currentDate);
      }
      currentDate = addDays(currentDate, 1);
    }

    return days;
  }, [startDate]);

  const start = currentWeek[0];
  const end = currentWeek[5];

  const period = `${format(start, "MMMM d")} - ${format(end, "MMMM d")}`;

  const isPrevDisabled = isSameDay(startDate, new Date());

  const handlePrevDate = () => {
    const today = getValidStartDate(startOfDay(new Date()));

    let previousDate = subDays(startDate, 7);

    if (isSunday(previousDate)) {
      previousDate = subDays(previousDate, 7);
    }

    setStartDate(
      isBefore(startOfDay(previousDate), today) ? today : previousDate,
    );
  };

  const handleNextDate = () => {
    setStartDate((prev) => {
      const nextDate = addDays(prev, 7);

      return isSunday(nextDate) ? addDays(nextDate, 7) : nextDate;
    });
  };

  const getValidStartDate = (date: Date): Date => {
    return isSunday(date) ? addDays(date, 1) : date;
  };

  return {
    currentWeek,
    period,
    isPrevDisabled,
    handlePrevDate,
    handleNextDate,
  };
}
