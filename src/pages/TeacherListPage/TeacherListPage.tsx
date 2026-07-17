import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTranslatedText } from "../../hooks/useTranslatedText";
import styles from "./TeacherListPage.module.scss";

interface Teacher {
  id: number;
  name: string;
  nameKey?: string;
  email: string;
  subject: string;
  subjectKey?: string;
  subjectColor: string;
  collabType: "Contract" | "Freelance";
  dueDate: string | null;
  dueDateKey?: string;
  avatar?: string;
  nextLessons?: string[];
}

const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 1,
    name: "Kataryna Novak",
    nameKey: "teacherListPage.teachers.katarynaNovak",
    email: "k.nowakchemistry@onlineschool.com",
    subject: "Chemistry",
    subjectKey: "subjects.chemistry",
    subjectColor: "#00d2ff",
    collabType: "Contract",
    dueDate: "Without term",
    dueDateKey: "teacherListPage.modal.withoutTerm",
    nextLessons: ["28/06 at 14:00", "15:00", "17:00"],
  },
  {
    id: 2,
    name: "Andrii Shevchenko",
    nameKey: "teacherListPage.teachers.andriiShevchenko",
    email: "a.shevchenko@onlineschool.com",
    subject: "Maths",
    subjectKey: "subjects.mathematics",
    subjectColor: "#00f2fe",
    collabType: "Freelance",
    dueDate: "Without term",
    dueDateKey: "teacherListPage.modal.withoutTerm",
  },
  {
    id: 3,
    name: "Sofia Koval",
    nameKey: "teacherListPage.teachers.sofiaKoval",
    email: "s.koval@onlineschool.com",
    subject: "Physics",
    subjectKey: "subjects.physics",
    subjectColor: "#38ef7d",
    collabType: "Contract",
    dueDate: "26/10/26",
  },
  {
    id: 4,
    name: "Nataliia Ivanenko",
    nameKey: "teacherListPage.teachers.nataliiaIvanenko",
    email: "n.ivanenko@onlineschool.com",
    subject: "Biology",
    subjectKey: "subjects.biology",
    subjectColor: "#b155fc",
    collabType: "Contract",
    dueDate: "31/8/27",
  },
  {
    id: 5,
    name: "Olena Melnyk",
    nameKey: "teacherListPage.teachers.olenaMelnyk",
    email: "o.melnyk@onlineschool.com",
    subject: "Literature",
    subjectKey: "subjects.english",
    subjectColor: "#fbad34",
    collabType: "Contract",
    dueDate: "31/12/27",
  },
  {
    id: 6,
    name: "Dmytro Kozak",
    nameKey: "teacherListPage.teachers.dmytroKozak",
    email: "d.kozak@onlineschool.com",
    subject: "Ukrainian",
    subjectKey: "subjects.english",
    subjectColor: "#ff7675",
    collabType: "Freelance",
    dueDate: "Without term",
    dueDateKey: "teacherListPage.modal.withoutTerm",
  },
  {
    id: 7,
    name: "Maksym Bondarenko",
    nameKey: "teacherListPage.teachers.maksymBondarenko",
    email: "m.bondarenko@onlineschool.com",
    subject: "History",
    subjectKey: "subjects.history",
    subjectColor: "#ff9ff3",
    collabType: "Contract",
    dueDate: "30/07/26",
  },
  {
    id: 8,
    name: "Anna Kowalska",
    nameKey: "teacherListPage.teachers.annaKowalska",
    email: "a.kowalska@onlineschool.com",
    subject: "English",
    subjectKey: "subjects.english",
    subjectColor: "#ff4757",
    collabType: "Contract",
    dueDate: "27/04/27",
  },
];

const AVAILABLE_COLORS = [
  "#ff4757",
  "#fbad34",
  "#fec107",
  "#38ef7d",
  "#00f2fe",
  "#00d2ff",
  "#b155fc",
  "#ff9ff3",
];

export const TeacherListPage: React.FC = () => {
  const { t } = useTranslation();
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number>(
    INITIAL_TEACHERS[0].id,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);

  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherSubject, setNewTeacherSubject] = useState("");
  const [newTeacherColor, setNewTeacherColor] = useState("#00d2ff");
  const [newTeacherEmail, setNewTeacherEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [collabType, setCollabType] = useState<"Contract" | "Freelance">(
    "Contract",
  );
  const [dueDate, setDueDate] = useState("2027-06-06");
  const [workFrom, setWorkFrom] = useState("09:00");
  const [workTo, setWorkTo] = useState("17:00");
  const [lunchFrom, setLunchFrom] = useState("12:00");
  const [lunchTo, setLunchTo] = useState("13:00");

  // Simulates email duplication check from the wireframe
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewTeacherEmail(val);
    if (val === "hello@school.com") {
      setEmailError(t("teacherListPage.modal.emailExists"));
    } else {
      setEmailError("");
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailError && newTeacherName && newTeacherEmail && newTeacherSubject) {
      setModalStep(2);
    }
  };

  const handleSaveTeacher = () => {
    const created: Teacher = {
      id: teachers.length + 1,
      name: newTeacherName,
      email: newTeacherEmail,
      subject: newTeacherSubject,
      subjectKey: `subjects.${newTeacherSubject}`,
      subjectColor: newTeacherColor,
      collabType: collabType,
      dueDate:
        collabType === "Freelance"
          ? t("teacherListPage.modal.withoutTerm")
          : new Date(dueDate).toLocaleDateString("en-GB"),
    };

    setTeachers([...teachers, created]);
    resetForm();
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setModalStep(1);
    setNewTeacherName("");
    setNewTeacherSubject("");
    setNewTeacherEmail("");
    setEmailError("");
  };

  const selectedTeacher =
    teachers.find((teacher) => teacher.id === selectedTeacherId) ?? null;

  const translatedTitle = useTranslatedText(t("teacherListPage.title"));
  const translatedAddTeacher = useTranslatedText(
    t("teacherListPage.addTeacher"),
  );

  return (
    <div className={styles.dashboardContainer}>
      <section className={styles.mainContent}>
        <div className={styles.listSection}>
          <div className={styles.tableHeader}>
            <h2>{translatedTitle}</h2>
            <button
              className={styles.addTeacherBtn}
              onClick={() => setIsModalOpen(true)}
            >
              {translatedAddTeacher} <span>+</span>
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.teachersTable}>
              <thead>
                <tr>
                  <th>{t("teacherListPage.table.teacherName")}</th>
                  <th>{t("teacherListPage.table.subject")}</th>
                  <th>{t("teacherListPage.table.workTerms")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => {
                  const displayName = teacher.nameKey
                    ? t(teacher.nameKey)
                    : teacher.name;
                  const displaySubject = teacher.subjectKey
                    ? t(teacher.subjectKey)
                    : teacher.subject;
                  const displayCollabType =
                    teacher.collabType === "Contract"
                      ? "Contract"
                      : "Freelance";
                  const displayDueDate = teacher.dueDateKey
                    ? t(teacher.dueDateKey)
                    : teacher.dueDate;

                  return (
                    <tr
                      key={teacher.id}
                      className={
                        selectedTeacher?.id === teacher.id
                          ? styles.activeRow
                          : ""
                      }
                      onClick={() => setSelectedTeacherId(teacher.id)}
                    >
                      <td className={styles.nameCell}>
                        <div className={styles.avatarMock}>
                          {displayName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        {displayName}
                      </td>
                      <td>
                        <span className={styles.subjectWrapper}>
                          <span
                            className={styles.colorDot}
                            style={{ backgroundColor: teacher.subjectColor }}
                          ></span>
                          {displaySubject}
                        </span>
                      </td>
                      <td className={styles.termsCell}>
                        <span className={styles.collabType}>
                          {displayCollabType}
                        </span>
                        <span className={styles.dueDate}>{displayDueDate}</span>
                      </td>
                      <td className={styles.actionsCell}>
                        <button className={styles.actionIconButton}>✏️</button>
                        <button className={styles.actionIconButton}>•••</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected instructor sidebar panel */}
        {selectedTeacher && (
          <aside className={styles.detailsCard}>
            <button
              className={styles.closeDetails}
              onClick={() => setSelectedTeacherId(0)}
            >
              ×
            </button>
            <h3>
              {selectedTeacher.nameKey
                ? t(selectedTeacher.nameKey)
                : selectedTeacher.name}{" "}
              <span
                className={styles.miniDot}
                style={{ backgroundColor: selectedTeacher.subjectColor }}
              ></span>
            </h3>
            <p className={styles.detailsEmail}>✉️ {selectedTeacher.email}</p>

            <div className={styles.nextLessonsSection}>
              <h4>{t("teacherListPage.details.nextLessons")}</h4>
              {selectedTeacher.nextLessons ? (
                <ul>
                  {selectedTeacher.nextLessons.map((lesson, idx) => (
                    <li key={idx}>{lesson}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noLessons}>
                  {t("teacherListPage.details.noLessons")}
                </p>
              )}
            </div>
            <a href="#teacher-page" className={styles.teacherPageLink}>
              {t("teacherListPage.details.teacherPage")}
            </a>
          </aside>
        )}
      </section>

      {/* Creation wizard modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <button className={styles.closeModal} onClick={resetForm}>
              ×
            </button>

            {modalStep === 1 ? (
              <form onSubmit={handleNextStep}>
                <h3>
                  👤 {t("teacherListPage.modal.title")}{" "}
                  <span className={styles.stepIndicator}>
                    {t("teacherListPage.modal.step1")}
                  </span>
                </h3>
                <p className={styles.subtitle}>
                  {t("teacherListPage.modal.subtitle")}
                </p>

                <div className={styles.inputGroup}>
                  <label>{t("teacherListPage.modal.nameLabel")}</label>
                  <input
                    type="text"
                    placeholder="Olga Petrivna"
                    required
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>{t("teacherListPage.modal.subjectLabel")}</label>
                  <div className={styles.selectWithColor}>
                    <select
                      required
                      value={newTeacherSubject}
                      onChange={(e) => setNewTeacherSubject(e.target.value)}
                    >
                      <option value="">
                        {t("teacherListPage.modal.subjectPlaceholder")}
                      </option>
                      <option value="chemistry">
                        {t("teacherListPage.modal.subjectOptions.chemistry")}
                      </option>
                      <option value="mathematics">
                        {t("teacherListPage.modal.subjectOptions.mathematics")}
                      </option>
                      <option value="physics">
                        {t("teacherListPage.modal.subjectOptions.physics")}
                      </option>
                    </select>
                    <span
                      className={styles.selectedColorPreview}
                      style={{ backgroundColor: newTeacherColor }}
                    ></span>
                  </div>
                  <p className={styles.hint}>
                    {t("teacherListPage.modal.subjectHint")}
                  </p>
                </div>

                <div className={styles.colorPalette}>
                  {AVAILABLE_COLORS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      className={`${styles.paletteDot} ${newTeacherColor === c ? styles.activePaletteDot : ""}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setNewTeacherColor(c)}
                    />
                  ))}
                </div>

                <div
                  className={`${styles.inputGroup} ${emailError ? styles.errorState : ""}`}
                >
                  <label>{t("teacherListPage.modal.emailLabel")}</label>
                  <input
                    type="email"
                    placeholder="hello@school.com"
                    required
                    value={newTeacherEmail}
                    onChange={handleEmailChange}
                  />
                  {emailError && (
                    <span className={styles.errorText}>⚠️ {emailError}</span>
                  )}
                </div>

                <button type="submit" className={styles.primaryModalBtn}>
                  {t("teacherListPage.modal.continue")}
                </button>
                <button
                  type="button"
                  className={styles.secondaryModalBtn}
                  onClick={handleSaveTeacher}
                >
                  {t("teacherListPage.modal.saveLater")}
                </button>
              </form>
            ) : (
              <div>
                <h3>
                  📅 {t("teacherListPage.modal.title")}{" "}
                  <span className={styles.stepIndicator}>
                    {t("teacherListPage.modal.step2")}
                  </span>
                </h3>
                <p className={styles.subtitle}>
                  {t("teacherListPage.modal.availabilitySubtitle")}
                </p>

                <h4 className={styles.sectionDivider}>
                  {t("teacherListPage.modal.workTerms")}
                </h4>
                <div className={styles.rowInputs}>
                  <div className={styles.inputGroup}>
                    <label>
                      {t("teacherListPage.modal.collaborationType")}
                    </label>
                    <select
                      value={collabType}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setCollabType(
                          e.target.value as "Contract" | "Freelance",
                        )
                      }
                    >
                      <option value="Contract">
                        {t("teacherListPage.modal.contract")}
                      </option>
                      <option value="Freelance">
                        {t("teacherListPage.modal.freelance")}
                      </option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>{t("teacherListPage.modal.dueDate")}</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      disabled={collabType === "Freelance"}
                    />
                  </div>
                </div>

                <h4 className={styles.sectionDivider}>
                  {t("teacherListPage.modal.regularAvailability")}
                </h4>
                <div className={styles.availabilityRow}>
                  <span>{t("teacherListPage.modal.workdays")}</span>
                  <div className={styles.timeInputs}>
                    <input
                      type="time"
                      value={workFrom}
                      onChange={(e) => setWorkFrom(e.target.value)}
                    />
                    <span>—</span>
                    <input
                      type="time"
                      value={workTo}
                      onChange={(e) => setWorkTo(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.availabilityRow}>
                  <span>{t("teacherListPage.modal.lunchBreak")}</span>
                  <div className={styles.timeInputs}>
                    <input
                      type="time"
                      value={lunchFrom}
                      onChange={(e) => setLunchFrom(e.target.value)}
                    />
                    <span>—</span>
                    <input
                      type="time"
                      value={lunchTo}
                      onChange={(e) => setLunchTo(e.target.value)}
                    />
                  </div>
                </div>

                <p className={styles.infoLink}>
                  {t("teacherListPage.modal.info")}{" "}
                  <span className={styles.accentText}>
                    {t("teacherListPage.modal.infoLink")}
                  </span>
                </p>

                <button
                  type="button"
                  className={styles.primaryModalBtn}
                  onClick={handleSaveTeacher}
                >
                  {t("teacherListPage.modal.saveTeacher")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
