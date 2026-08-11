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

// Dodane przykładowe awatary do initial state (zastąp własnymi grafikami jeśli trzeba)
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
    avatar: "https://i.pravatar.cc/150?img=47",
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
    avatar: "https://i.pravatar.cc/150?img=11",
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
    avatar: "https://i.pravatar.cc/150?img=5",
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
    avatar: "https://i.pravatar.cc/150?img=9",
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
    avatar: "https://i.pravatar.cc/150?img=41",
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
    avatar: "https://i.pravatar.cc/150?img=60",
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
    avatar: "https://i.pravatar.cc/150?img=68",
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
    avatar: "https://i.pravatar.cc/150?img=32",
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

// Ikony SVG (zastępujące złącza zewnętrznych bibliotek, dla pełnej niezależności)
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const UserPlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <line x1="19" y1="8" x2="19" y2="14"></line>
    <line x1="22" y1="11" x2="16" y2="11"></line>
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

export const TeacherListPage: React.FC = () => {
  const { t } = useTranslation();
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number>(INITIAL_TEACHERS[0].id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);

  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherSubject, setNewTeacherSubject] = useState("");
  const [newTeacherColor, setNewTeacherColor] = useState("#00d2ff");
  const [newTeacherEmail, setNewTeacherEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [collabType, setCollabType] = useState<"Contract" | "Freelance">("Contract");
  const [dueDate, setDueDate] = useState("2027-06-06");
  const [workFrom, setWorkFrom] = useState("09:00");
  const [workTo, setWorkTo] = useState("17:00");
  const [lunchFrom, setLunchFrom] = useState("12:00");
  const [lunchTo, setLunchTo] = useState("13:00");

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

  const selectedTeacher = teachers.find((teacher) => teacher.id === selectedTeacherId) ?? null;

  const translatedTitle = useTranslatedText(t("teacherListPage.title"));
  const translatedAddTeacher = useTranslatedText(t("teacherListPage.addTeacher"));

  return (
    <div className={styles.dashboardContainer}>
      <section className={styles.mainContent}>
        <div className={styles.listSection}>
          <div className={styles.tableHeader}>
            <h2>{translatedTitle}</h2>
            <button className={styles.addTeacherBtn} onClick={() => setIsModalOpen(true)}>
              {translatedAddTeacher} <UserPlusIcon />
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
                  const displayName = teacher.nameKey ? t(teacher.nameKey) : teacher.name;
                  const displaySubject = teacher.subjectKey ? t(teacher.subjectKey) : teacher.subject;
                  const displayCollabType = teacher.collabType === "Contract" ? "Contract" : "Freelance";
                  const displayDueDate = teacher.dueDateKey ? t(teacher.dueDateKey) : teacher.dueDate;

                  return (
                    <tr
                      key={teacher.id}
                      className={selectedTeacher?.id === teacher.id ? styles.activeRow : ""}
                      onClick={() => setSelectedTeacherId(teacher.id)}
                    >
                      <td className={styles.nameCell}>
                        {teacher.avatar ? (
                          <img src={teacher.avatar} alt={displayName} className={styles.avatarImg} />
                        ) : (
                          <div className={styles.avatarMock}>
                            {displayName.split(" ").map((n) => n[0]).join("")}
                          </div>
                        )}
                        {displayName}
                      </td>
                      <td>
                        <span className={styles.subjectWrapper}>
                          <span className={styles.colorDot} style={{ backgroundColor: teacher.subjectColor }}></span>
                          {displaySubject}
                        </span>
                      </td>
                      <td className={styles.termsCell}>
                        <span className={styles.collabTypeWrapper}>
                          {teacher.collabType === "Contract" ? <BriefcaseIcon /> : <SendIcon />}
                          {displayCollabType}
                        </span>
                        <span className={styles.dueDate}>{displayDueDate}</span>
                      </td>
                      <td className={styles.actionsCell}>
                        <button className={styles.actionIconButton}><EditIcon /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Panel - Rozbudowany wg mocków z Figmy */}
        {selectedTeacher && (
          <aside className={styles.detailsCard}>
            <button className={styles.closeDetails} onClick={() => setSelectedTeacherId(0)}>
              &times;
            </button>
            
            <div className={styles.detailsHeader}>
              {selectedTeacher.avatar ? (
                 <img src={selectedTeacher.avatar} alt="avatar" className={styles.headerAvatar} />
              ) : (
                <div className={styles.avatarMock} style={{ width: '60px', height: '60px', fontSize: '1.2rem' }}>
                   {(selectedTeacher.nameKey ? t(selectedTeacher.nameKey) : selectedTeacher.name).split(" ").map((n) => n[0]).join("")}
                </div>
              )}
              
              <div className={styles.headerInfo}>
                <h3>
                  {selectedTeacher.nameKey ? t(selectedTeacher.nameKey) : selectedTeacher.name}
                </h3>
                <span className={styles.detailsEmail}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  {selectedTeacher.email}
                </span>
                <span className={styles.subjectWrapper} style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                  <span className={styles.miniDot} style={{ backgroundColor: selectedTeacher.subjectColor }}></span>
                  {selectedTeacher.subjectKey ? t(selectedTeacher.subjectKey) : selectedTeacher.subject}
                </span>
              </div>
            </div>

            <div className={styles.detailsGrid}>
              {/* Miejsce na przyszły pełny kalendarz z Figmy */}
              <div className={styles.nextLessonsSection}>
                <h4>Schedule Preview</h4>
                {selectedTeacher.nextLessons ? (
                  <ul>
                    {selectedTeacher.nextLessons.map((lesson, idx) => (
                      <li key={idx}>{lesson}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.noLessons}>{t("teacherListPage.details.noLessons")}</p>
                )}
                <a href="#teacher-page" className={styles.teacherPageLink}>
                  Teacher's page &rarr;
                </a>
              </div>
              
              {/* Miejsce na komponent Dostępności z Figmy */}
              <div className={styles.nextLessonsSection} style={{ backgroundColor: '#fff', border: '1px solid #eee' }}>
                <h4>Availability Placeholder</h4>
                <p style={{ fontSize: '0.8rem', color: '#999' }}>Tu w przyszłości wyląduje pełny widok godzin tygodniowych.</p>
              </div>
            </div>
          </aside>
        )}
      </section>

      {/* Modal - Dodany layout na 2 kroki wg Figmy */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <button className={styles.closeModal} onClick={resetForm}>&times;</button>

            {modalStep === 1 ? (
              <form onSubmit={handleNextStep}>
                <h3>
                  <UserPlusIcon /> {t("teacherListPage.modal.title")} 
                  <span className={styles.stepIndicator}>Step 1 of 2</span>
                </h3>
                <p className={styles.subtitle}>{t("teacherListPage.modal.subtitle")}</p>

                <div className={styles.inputGroup}>
                  <label>Name*</label>
                  <input
                    type="text"
                    placeholder="Olga Petrivna"
                    required
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Subject (required)*</label>
                  <div className={styles.selectWithColor}>
                    <select required value={newTeacherSubject} onChange={(e) => setNewTeacherSubject(e.target.value)}>
                      <option value="">Select a subject...</option>
                      <option value="chemistry">Chemistry</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="physics">Physics</option>
                    </select>
                    <span className={styles.selectedColorPreview} style={{ backgroundColor: newTeacherColor }}></span>
                  </div>
                  <p className={styles.hint}>Select a subject and a color to mark in your schedule</p>
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

                <div className={`${styles.inputGroup} ${emailError ? styles.errorState : ""}`}>
                  <label>Email*</label>
                  <input
                    type="email"
                    placeholder="hello@school.com"
                    required
                    value={newTeacherEmail}
                    onChange={handleEmailChange}
                  />
                  {emailError && <span className={styles.errorText}>⚠️ {emailError}</span>}
                </div>

                <button type="submit" className={styles.primaryModalBtn}>
                  Continue to availability
                </button>
                <button type="button" className={styles.secondaryModalBtn} onClick={handleSaveTeacher}>
                  Save and set later
                </button>
              </form>
            ) : (
              <div>
                <h3>
                   &larr; {t("teacherListPage.modal.title")}
                  <span className={styles.stepIndicator}>Step 2 of 2</span>
                </h3>
                <p className={styles.subtitle}>Set teachers availability</p>

                <h4 className={styles.sectionDivider}>Work terms</h4>
                <div className={styles.rowInputs}>
                  <div className={styles.inputGroup}>
                    <label>Collaboration type *</label>
                    <select
                      value={collabType}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCollabType(e.target.value as "Contract" | "Freelance")}
                    >
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Due Date *</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      disabled={collabType === "Freelance"}
                    />
                  </div>
                </div>

                <h4 className={styles.sectionDivider}>Regular availability</h4>
                <div className={styles.availabilityRow}>
                  <span>Workdays</span>
                  <div className={styles.timeInputs}>
                    <input type="time" value={workFrom} onChange={(e) => setWorkFrom(e.target.value)} />
                    <span>—</span>
                    <input type="time" value={workTo} onChange={(e) => setWorkTo(e.target.value)} />
                  </div>
                </div>

                <div className={styles.availabilityRow}>
                  <span>Lunch break</span>
                  <div className={styles.timeInputs}>
                    <input type="time" value={lunchFrom} onChange={(e) => setLunchFrom(e.target.value)} />
                    <span>—</span>
                    <input type="time" value={lunchTo} onChange={(e) => setLunchTo(e.target.value)} />
                  </div>
                </div>

                <p className={styles.infoLink}>
                  You can set individual per-day later or <span className={styles.accentText}>add now</span>
                </p>

                <button type="button" className={styles.primaryModalBtn} onClick={handleSaveTeacher}>
                  Save teacher
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
