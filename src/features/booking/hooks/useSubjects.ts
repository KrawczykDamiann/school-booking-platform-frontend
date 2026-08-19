import { useEffect, useState } from "react";
import type { Subject } from "../../../types/Subject";
import { fetchSubjects } from "../../../api/subjects";

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [isSubjectsLoading, setIsSubjectsLoading] = useState(false);

  useEffect(() => {
    async function init() {
      setIsSubjectsLoading(true);
      try {
        const subjectsData = await fetchSubjects();
        setSubjects(subjectsData.content);
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubjectsLoading(false);
      }
    }

    init();
  }, []);

  return {
    subjects,
    isSubjectsLoading,
  }
}
