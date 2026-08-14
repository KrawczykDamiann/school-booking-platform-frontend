import type { Subject } from "../../../../types/Subject";
import { mockSubjects } from "../../mocks/subjects";
import styles from "./SubjectFilter.module.scss";

type SubjectFilterProps = {
  subjects: Subject[] | null;
  onSelectSubject: (subjectId: number) => void;
  selectedSubjectId: number | null;
};

export const SubjectFilter: React.FC<SubjectFilterProps> = ({
  onSelectSubject,
  selectedSubjectId,
  subjects,
}) => {

  const visibleSubjects = subjects !== null ? subjects : mockSubjects;
  return (
    <div className={styles.subjectFilterWrapper}>
      <ul className={styles.subjectFilterList}>
        {visibleSubjects.map((subject) => (
          <li
            key={subject.id}
            className={styles.subjectFilterItem}
            onClick={() => onSelectSubject(subject.id)}
            data-selected={subject.id === selectedSubjectId}
          >
            {subject.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
