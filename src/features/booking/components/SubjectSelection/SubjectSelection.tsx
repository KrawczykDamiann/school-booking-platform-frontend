import { useEffect, useRef, useState } from "react";
import type { Subject } from "../../../../types/Subject";
import { subjectIcons } from "../../constants/subjectIcons";
import styles from "./SubjectSelection.module.scss";
import { DropdownIcon } from "../../../../components/icons/DropdownIcon";

type SubjectSelectionType = "list" | "dropdown";

type SubjectSelectionProps = {
  type: SubjectSelectionType;
  subjects: Subject[] | null;
  onSelectSubject: (subjectId: number) => void;
  selectedSubjectId: number | null;
  isSubjectsLoading: boolean;
};

type SubjectWithIcon = Subject & {
  icon: string;
};

export const SubjectSelection: React.FC<SubjectSelectionProps> = ({
  type,
  onSelectSubject,
  selectedSubjectId,
  subjects,
  isSubjectsLoading,
}) => {
  const subjectsWithIcon: SubjectWithIcon[] | undefined = subjects?.map(
    (subject) => ({
      ...subject,
      icon: subjectIcons[subject.name as keyof typeof subjectIcons],
    }),
  );

  const selectedSubject = subjectsWithIcon?.find(
    (subject) => subject.id === selectedSubjectId,
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const visibleSubjects = subjectsWithIcon
    ? [...subjectsWithIcon].sort((a, b) => {
        if (a.id === selectedSubjectId) return -1;
        if (b.id === selectedSubjectId) return 1;
        return 0;
      })
    : [];

  const handleSelectSubject = (subjectId: number) => {
    onSelectSubject(subjectId);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (type === "list") {
    return (
      <div className={styles.subjectSelectionWrapper}>
        <ul className={styles.subjectSelectionList}>
          {isSubjectsLoading ? (
            <span className={styles.loadingText}>Loading subjects…</span>
          ) : (
            <>
              {subjectsWithIcon &&
                subjectsWithIcon.map((subject) => (
                  <li
                    key={subject.id}
                    className={styles.subjectSelectionItem}
                    onClick={() => onSelectSubject(subject.id)}
                    data-selected={subject.id === selectedSubjectId}
                  >
                    <img
                      src={subject.icon}
                      alt="Subject icon"
                      className={styles.subjectIcon}
                    />
                    {subject.name}
                  </li>
                ))}
            </>
          )}
        </ul>
      </div>
    );
  }

  if (type === "dropdown") {
    return (
      <div className={styles.subjectSelectionDropdown} ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className={styles.dropdownTrigger}
        >
          <div className={styles.dropdownSelectedItem}>
            <img
              src={selectedSubject?.icon}
              alt="Subject icon"
              className={styles.subjectIcon}
            />
            <span className={styles.dropdownSelectedItemText}>
              {selectedSubject?.name}
            </span>
          </div>
          <DropdownIcon
            size={20}
            className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.dropdownIconActive : ""}`}
          />
        </button>
        <>
          {isDropdownOpen && (
            <ul className={styles.dropdownMenu}>
              {visibleSubjects &&
                visibleSubjects.map((subject) => {
                  if (subject.id !== selectedSubjectId) {
                    return (
                      <li
                        key={subject.id}
                        className={styles.dropdownItem}
                        onClick={() => handleSelectSubject(subject.id)}
                        data-selected={subject.id === selectedSubjectId}
                      >
                        <img
                          src={subject.icon}
                          alt="Subject icon"
                          className={styles.subjectIcon}
                        />
                        {subject.name}
                      </li>
                    );
                  }
                })}
            </ul>
          )}
        </>
      </div>
    );
  }
};
