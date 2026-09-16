import { useContext, useMemo, useState } from "react";
import type { TimePeriod } from "../constants/timePeriods";
import { LessonPreviewContext } from "../../../context/LessonPreviewContext";

export function useLessonFilters() {
  const { setSelectedLessonUuid } = useContext(LessonPreviewContext);

  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(
    0,
  );
  const handleSelectSubject = (subjectId: number) => {
    if (selectedSubjectId === subjectId) {
      setSelectedSubjectId(0);
      return;
    }

    setSelectedSubjectId(subjectId);
    setSelectedLessonUuid(undefined);
  };

  const [selectedTimePeriod, setSelectedTimePeriod] =
    useState<TimePeriod | null>(null);

  const handleSelectTimePeriod = (period: TimePeriod | null) => {
    if (selectedTimePeriod === period) {
      setSelectedTimePeriod(null);
      return;
    }

    setSelectedTimePeriod(period);
    setSelectedLessonUuid(undefined);
  };

  const availableHours = useMemo(() => {
    switch (selectedTimePeriod) {
      case "morning":
        return Array.from({ length: 4 }, (_, i) => i + 8);

      case "afternoon":
        return Array.from({ length: 5 }, (_, i) => i + 12);

      case "evening":
        return Array.from({ length: 4 }, (_, i) => i + 17);

      default:
        return Array.from({ length: 13 }, (_, i) => i + 8);
    }
  }, [selectedTimePeriod]);

  return {
    selectedSubjectId,
    setSelectedSubjectId,
    handleSelectSubject,
    selectedTimePeriod,
    handleSelectTimePeriod,
    availableHours,
  };
}
