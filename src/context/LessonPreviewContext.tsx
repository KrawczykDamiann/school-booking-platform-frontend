import { createContext, useMemo, useState } from "react";

type LessonPreviewContextType = {
  selectedLessonUuid: string | undefined;
  setSelectedLessonUuid: React.Dispatch<React.SetStateAction<string | undefined>>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const LessonPreviewContext = createContext<LessonPreviewContextType>({
  selectedLessonUuid: undefined,
  setSelectedLessonUuid: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const LessonPreviewProvider: React.FC<Props> = ({ children }) => {
  const [selectedLessonUuid, setSelectedLessonUuid] = useState<string | undefined>();

  const value = useMemo(
    () => ({
      selectedLessonUuid,
      setSelectedLessonUuid,
    }),
    [selectedLessonUuid],
  );

  return (
    <LessonPreviewContext.Provider value={value}>
      {children}
    </LessonPreviewContext.Provider>
  );
};
