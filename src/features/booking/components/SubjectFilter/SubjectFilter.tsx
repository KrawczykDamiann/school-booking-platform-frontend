import type { Subject } from "../../../../types/Subject";
import styles from "./SubjectFilter.module.scss";

type SubjectFilterProps = {
  subjects: Subject[] | null;
  onSelectSubject: (subjectId: number) => void;
  selectedSubjectId: number | null;
  isSubjectsLoading: boolean;
};

export const SubjectFilter: React.FC<SubjectFilterProps> = ({
  onSelectSubject,
  selectedSubjectId,
  subjects,
  isSubjectsLoading,
}) => {

  return (
    <div className={styles.subjectFilterWrapper}>
      <ul className={styles.subjectFilterList}>
        {isSubjectsLoading ? (
          <span className={styles.loadingText}>Loading subjects…</span>
        ) : (
          <>
            {subjects && subjects.map((subject) => (
              <li
                key={subject.id}
                className={styles.subjectFilterItem}
                onClick={() => onSelectSubject(subject.id)}
                data-selected={subject.id === selectedSubjectId}
              >
                {subject.name}
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
};
