import type { SubjectFilterType } from "../../../../types/SubjectFilterType";
import { mockSubjects } from "../../mocks/subjects";
import styles from "./SubjectFilter.module.scss";

type SubjectFilterProps = {
  onSelectSubject: (subject: SubjectFilterType) => void;
  selectedSubject: SubjectFilterType | null;
};

export const SubjectFilter: React.FC<SubjectFilterProps> = ({
  onSelectSubject,
  selectedSubject,
}) => {
  return (
    <div className={styles.subjectFilterWrapper}>
      <ul className={styles.subjectFilterList}>
        {mockSubjects.map((subject) => (
          <li
            key={subject.id}
            className={styles.subjectFilterItem}
            onClick={() => onSelectSubject(subject.name)}
            data-selected={subject.name === selectedSubject}
          >
            {subject.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
