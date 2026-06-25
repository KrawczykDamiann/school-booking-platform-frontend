import React from "react";
import styles from "./FilterModal.module.scss";
import { useTranslation } from "react-i18next";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubject: string | null;
  // Callback fired when a subject is chosen to filter the active view
  onSelectSubject: (subject: string | null) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  selectedSubject,
  onSelectSubject,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  // List of subject identifier keys matching your translation dictionaries
  const subjects = [
    "subjects.mathematics",
    "subjects.physics",
    "subjects.informatics",
    "subjects.economics",
    "subjects.biology",
    "subjects.chemistry",
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <h2 className={styles.modalTitle}>{t("filters.title")}</h2>
        <p className={styles.modalSubtitle}>{t("filters.subtitle")}</p>

        <div className={styles.subjectsGrid}>
          {/* Universal fallback button to completely clear the filter state */}
          <button
            className={`${styles.subjectBtn} ${!selectedSubject ? styles.activeSubject : ""}`}
            onClick={() => {
              onSelectSubject(null);
              onClose();
            }}
          >
            {t("filters.allSubjects")}
          </button>

          {subjects.map((subKey) => {
            const isSelected = selectedSubject === subKey;
            return (
              <button
                key={subKey}
                className={`${styles.subjectBtn} ${isSelected ? styles.activeSubject : ""}`}
                onClick={() => {
                  onSelectSubject(subKey);
                  onClose();
                }}
              >
                {t(subKey)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
