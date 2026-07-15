import { createContext, useMemo, useState } from "react";
import type { Lesson } from "../types/Lesson";

type LessonPreviewContextType = {
  selectedLesson: Lesson | undefined;
  setSelectedLesson: React.Dispatch<React.SetStateAction<Lesson | undefined>>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const LessonPreviewContext = createContext<LessonPreviewContextType>({
  selectedLesson: undefined,
  setSelectedLesson: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const LessonPreviewProvider: React.FC<Props> = ({ children }) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>();

  const value = useMemo(
    () => ({
      selectedLesson,
      setSelectedLesson,
    }),
    [selectedLesson],
  );

  return (
    <LessonPreviewContext.Provider value={value}>
      {children}
    </LessonPreviewContext.Provider>
  );
};
