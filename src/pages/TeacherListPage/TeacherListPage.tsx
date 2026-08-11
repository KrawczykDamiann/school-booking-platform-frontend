import React, { useState } from "react";
import { useTranslatedText } from "../../hooks/useTranslatedText";
import styles from "./TeacherListPage.module.scss";

/* Helper do tłumaczenia w locie przez Google Translator (bez dotykania JSON-ów) */
const Txt: React.FC<{ children: string }> = ({ children }) => {
  const translated = useTranslatedText(children);
  return <>{translated}</>;
};

/* Interfaces & Data */
interface Teacher {
  id: number;
  name: string;
  email: string;
  subject: string;
  subjectColor: string;
  collabType: "Contract" | "Freelance";
  dueDate: string | null;
  isWarningDate?: boolean;
  avatar?: string;
  nextLessons?: string[];
}

const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 1,
    name: "Kataryna Novak",
    email: "k.nowakchemistry@onlineschool.com",
    subject: "Chemistry",
    subjectColor: "#00d2ff",
    collabType: "Contract",
    dueDate: "Without term",
    avatar: "https://i.pravatar.cc/150?img=47",
    nextLessons: ["30/06, 14:00, 15:00, 17:00"],
  },
  {
    id: 2,
    name: "Andrii Shevchenko",
    email: "a.shevchenko@onlineschool.com",
    subject: "Mathematics",
    subjectColor: "#00f2fe",
    collabType: "Freelance",
    dueDate: "Without term",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 3,
    name: "Sofia Koval",
    email: "PhysicsTeacheroleg@gmail.com",
    subject: "Physics",
    subjectColor: "#38ef7d",
    collabType: "Contract",
    dueDate: "26/06/26",
    isWarningDate: true,
    avatar: "https://i.pravatar.cc/150?img=5",
    nextLessons: ["29/06, 14:00, 15:00", "2/07, 14:00"],
  },
  {
    id: 4,
    name: "Nataliia Ivanenko",
    email: "n.ivanenko@onlineschool.com",
    subject: "Biology",
    subjectColor: "#b155fc",
    collabType: "Contract",
    dueDate: "31/8/27",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: 5,
    name: "Olena Melnyk",
    email: "o.melnyk@onlineschool.com",
    subject: "English",
    subjectColor: "#fbad34",
    collabType: "Contract",
    dueDate: "31/12/27",
    avatar: "https://i.pravatar.cc/150?img=41",
  },
  {
    id: 6,
    name: "Dmytro Kozak",
    email: "d.kozak@onlineschool.com",
    subject: "English",
    subjectColor: "#ff7675",
    collabType: "Freelance",
    dueDate: "Without term",
    avatar: "https://i.pravatar.cc/150?img=60",
  },
  {
    id: 7,
    name: "Maksym Bondarenko",
    email: "m.bondarenko@onlineschool.com",
    subject: "History",
    subjectColor: "#ff9ff3",
    collabType: "Contract",
    dueDate: "30/07/26",
    isWarningDate: true,
    avatar: "https://i.pravatar.cc/150?img=68",
  },
  {
    id: 8,
    name: "Anna Kowalska",
    email: "a.kowalska@onlineschool.com",
    subject: "English",
    subjectColor: "#ff4757",
    collabType: "Contract",
    dueDate: "27/04/27",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
];

const AVAILABLE_COLORS = ["#ff4757", "#fbad34", "#fec107", "#38ef7d", "#00f2fe", "#00d2ff", "#b155fc", "#ff9ff3"];

/* SVG Icons */
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
const MoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2"></circle>
    <circle cx="12" cy="12" r="2"></circle>
    <circle cx="19" cy="12" r="2"></circle>
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

export const TeacherListPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  
  /* State Management */
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);

  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherSubject, setNewTeacherSubject] = useState("");
  const [newTeacherColor, setNewTeacherColor] = useState("#00d2ff");
  const [newTeacherEmail, setNewTeacherEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [collabType, setCollabType] = useState<"Contract" | "Freelance">("Contract");
  const [dueDate, setDueDate] = useState("2027-06-06");

  /* Handlers */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewTeacherEmail(val);
    if (val === "hello@school.com") {
      setEmailError("This email already exists");
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
      subjectColor: newTeacherColor,
      collabType: collabType,
      dueDate: collabType === "Freelance" ? "Without term" : new Date(dueDate).toLocaleDateString("en-GB"),
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

  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId) ?? teachers[0];

  return (
    <div className={styles.dashboardContainer}>
      <section className={styles.mainContent}>
        
        {/* VIEW 1: MAIN LIST VIEW */}
        {viewMode === "list" ? (
          <div className={styles.listSection}>
            <div className={styles.topHeader}>
              <h2><Txt>Teachers</Txt></h2>
              <button className={styles.addTeacherBtn} onClick={() => setIsModalOpen(true)}>
                <Txt>Add a teacher</Txt> <UserPlusIcon />
              </button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.teachersTable}>
                <thead>
                  <tr>
                    <th><Txt>Teacher's name</Txt></th>
                    <th><Txt>Subject</Txt></th>
                    <th><Txt>Work terms & Due date</Txt></th>
                    <th className={styles.thAction}><Txt>Edit</Txt></th>
                    <th className={styles.thAction}><Txt>More</Txt></th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => {
                    const isSelected = selectedTeacherId === teacher.id;

                    return (
                      <tr
                        key={teacher.id}
                        className={isSelected ? styles.activeRow : ""}
                        onClick={() => setSelectedTeacherId(isSelected ? null : teacher.id)}
                      >
                        <td className={styles.nameCell}>
                          {teacher.avatar ? (
                            <img src={teacher.avatar} alt={teacher.name} className={styles.avatarImg} />
                          ) : (
                            <div className={styles.avatarMock}>
                              {teacher.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                          )}
                          {teacher.name}
                        </td>
                        <td>
                          <span className={styles.subjectWrapper}>
                            <span className={styles.colorDot} style={{ backgroundColor: teacher.subjectColor }}></span>
                            <Txt>{teacher.subject}</Txt>
                          </span>
                        </td>
                        <td>
                          <div className={styles.termsCell}>
                            <span className={styles.collabTypeWrapper}>
                              {teacher.collabType === "Contract" ? <BriefcaseIcon /> : <SendIcon />}
                              <Txt>{teacher.collabType}</Txt>
                            </span>
                            <span className={`${styles.dueDate} ${teacher.isWarningDate ? styles.hasWarning : ""}`}>
                              {teacher.dueDate === "Without term" ? <Txt>Without term</Txt> : teacher.dueDate}
                              {teacher.isWarningDate && <span className={styles.warningDot}></span>}
                            </span>
                          </div>
                        </td>
                        <td className={styles.actionCell}><button className={styles.actionIconButton}><EditIcon /></button></td>
                        <td className={styles.actionCell}>
                          <button className={styles.actionIconButton}><MoreIcon /></button>
                          
                          {/* Popover */}
                          {isSelected && (
                            <aside className={styles.popoverCard} onClick={(e) => e.stopPropagation()}>
                              <button className={styles.closeDetails} onClick={() => setSelectedTeacherId(null)}>&times;</button>
                              
                              <div className={styles.popoverHeader}>
                                <h3>{teacher.name} <span className={styles.statusDot}></span></h3>
                                <span className={styles.popoverEmail}>
                                  <MailIcon /> {teacher.email}
                                </span>
                              </div>

                              <div className={styles.nextLessonsBox}>
                                <p className={styles.label}><Txt>Next lessons:</Txt></p>
                                <p className={styles.lessons}>
                                  {teacher.nextLessons ? teacher.nextLessons.join(" | ") : "30/06, 14:00, 15:00, 17:00"}
                                </p>
                              </div>

                              <div className={styles.popoverFooter}>
                                <button className={styles.teacherPageBtn} onClick={() => setViewMode("detail")}>
                                  <Txt>Teacher's page</Txt> &rarr;
                                </button>
                              </div>
                            </aside>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          
          /* VIEW 2: DETAIL VIEW (Schedule & Availability) */
          <div>
            <button className={styles.backBtn} onClick={() => { setViewMode("list"); setSelectedTeacherId(null); }}>
              &larr; <Txt>Back to Teachers List</Txt>
            </button>

            <div className={styles.detailGrid}>
              
              {/* Left Sidebar */}
              <aside className={styles.avatarsSidebar}>
                <h3><Txt>Teachers</Txt></h3>
                {teachers.map((tItem) => {
                  const isActive = tItem.id === selectedTeacher.id;

                  return (
                    <div
                      key={tItem.id}
                      className={`${styles.teacherNavItem} ${isActive ? styles.activeNavItem : ""}`}
                      onClick={() => setSelectedTeacherId(tItem.id)}
                    >
                      {tItem.avatar ? (
                        <img src={tItem.avatar} alt={tItem.name} className={styles.navAvatar} />
                      ) : (
                        <div className={styles.avatarMock} style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                          {tItem.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                      )}
                      <div className={styles.navInfo}>
                        <span className={styles.navName}>{tItem.name}</span>
                        <span className={styles.navSubject}><Txt>{tItem.subject}</Txt></span>
                      </div>
                    </div>
                  );
                })}
              </aside>

              {/* Center Schedule */}
              <main className={styles.scheduleColumn}>
                <div className={styles.teacherHeaderCard}>
                  <div className={styles.headerLeft}>
                    {selectedTeacher.avatar ? (
                      <img src={selectedTeacher.avatar} alt="Avatar" className={styles.headerAvatar} />
                    ) : (
                      <div className={styles.avatarMock} style={{ width: 56, height: 56, fontSize: '1.2rem' }}>
                        {selectedTeacher.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    )}
                    <div className={styles.headerDetails}>
                      <h3>{selectedTeacher.name}</h3>
                      <p>{selectedTeacher.email}</p>
                    </div>
                  </div>
                  <div className={styles.headerRight}>
                    <span><Txt>{selectedTeacher.subject}</Txt></span>
                    <button className={styles.actionIconButton}><EditIcon /></button>
                  </div>
                </div>

                <div className={styles.scheduleGridCard}>
                  <div className={styles.scheduleHeader}>
                    <h3><Txt>Schedule</Txt></h3>
                    <span>📅 <Txt>June 29 - July 5</Txt></span>
                  </div>

                  <div className={styles.calendarMatrix}>
                    <div className={styles.dayColumn}>
                      <div className={`${styles.dayHeader} ${styles.activeDay}`}>
                        29 <span className={styles.dayNum}><Txt>Monday</Txt></span>
                      </div>
                      <div className={styles.timeSlot}>12:00</div>
                      <div className={styles.timeSlot}>13:00</div>
                      <div className={`${styles.timeSlot} ${styles.selectedSlot}`}>14:00</div>
                      <div className={`${styles.timeSlot} ${styles.selectedSlot}`}>15:00</div>
                      <div className={styles.timeSlot}>16:00</div>
                      <div className={styles.timeSlot}>17:00</div>
                    </div>

                    <div className={styles.dayColumn}>
                      <div className={styles.dayHeader}>
                        30 <span className={styles.dayNum}><Txt>Tuesday</Txt></span>
                      </div>
                      <div className={styles.timeSlot}>12:00</div>
                      <div className={styles.timeSlot}>13:00</div>
                      <div className={styles.timeSlot}>14:00</div>
                      <div className={styles.timeSlot}>15:00</div>
                      <div className={styles.timeSlot}>16:00</div>
                      <div className={styles.timeSlot}>17:00</div>
                    </div>

                    <div className={styles.dayColumn}>
                      <div className={styles.dayHeader}>
                        1 <span className={styles.dayNum}><Txt>Wednesday</Txt></span>
                      </div>
                      <div className={styles.timeSlot}>12:00</div>
                      <div className={styles.timeSlot}>13:00</div>
                      <div className={styles.timeSlot}>14:00</div>
                      <div className={styles.timeSlot}>15:00</div>
                      <div className={`${styles.timeSlot} ${styles.bookedSlot}`}>17:00</div>
                      <div className={styles.timeSlot}>18:00</div>
                    </div>

                    <div className={styles.dayColumn}>
                      <div className={styles.dayHeader}>
                        2 <span className={styles.dayNum}><Txt>Thursday</Txt></span>
                      </div>
                      <div className={styles.timeSlot}>12:00</div>
                      <div className={styles.timeSlot}>13:00</div>
                      <div className={styles.timeSlot}>14:00</div>
                      <div className={styles.timeSlot}>15:00</div>
                      <div className={`${styles.timeSlot} ${styles.bookedSlot}`}>17:00</div>
                      <div className={styles.timeSlot}>18:00</div>
                    </div>

                    <div className={styles.dayColumn}>
                      <div className={styles.dayHeader}>
                        3 <span className={styles.dayNum}><Txt>Friday</Txt></span>
                      </div>
                      <div className={styles.timeSlot}>12:00</div>
                      <div className={styles.timeSlot}>13:00</div>
                      <div className={styles.timeSlot}>14:00</div>
                      <div className={styles.timeSlot}>15:00</div>
                      <div className={`${styles.timeSlot} ${styles.selectedSlot}`}>16:00</div>
                      <div className={`${styles.timeSlot} ${styles.selectedSlot}`}>17:00</div>
                    </div>
                  </div>

                  <div className={styles.scheduleFooter}>
                    <div className={styles.nextLessonsLabel}>
                      <Txt>Next lessons:</Txt> <span>29/06 14:00 15:00 2/07 14:00</span>
                    </div>
                    <button className={styles.sendScheduleBtn}><Txt>Send schedule</Txt></button>
                  </div>
                </div>
              </main>

              {/* Right Availability Form */}
              <aside className={styles.availabilityColumn}>
                <div className={styles.availabilityCard}>
                  <div className={styles.cardHeader}>
                    <h3><Txt>Availability</Txt></h3>
                    <button className={styles.addDayBtn}><Txt>+ Add day</Txt></button>
                  </div>
                  <p className={styles.subtext}><Txt>Set weekly availability hours for this teacher</Txt></p>

                  <div className={styles.availRow}>
                    <span className={styles.dayName}><Txt>Monday</Txt></span>
                    <div className={styles.timeInputs}>
                      <input type="text" defaultValue="14:00" />
                      <span>—</span>
                      <input type="text" defaultValue="17:00" />
                      <span className={styles.deleteIcon}>🗑️</span>
                    </div>
                  </div>

                  <div className={styles.availRow}>
                    <span className={styles.dayName}><Txt>Tuesday</Txt></span>
                    <div className={styles.timeInputs}>
                      <input type="text" defaultValue="15:00" />
                      <span>—</span>
                      <input type="text" defaultValue="19:00" />
                      <span className={styles.deleteIcon}>🗑️</span>
                    </div>
                  </div>

                  <div className={styles.availRow}>
                    <span className={styles.dayName}><Txt>Wednesday</Txt></span>
                    <div className={styles.timeInputs}>
                      <input type="text" defaultValue="14:00" />
                      <span>—</span>
                      <input type="text" defaultValue="18:00" />
                      <span className={styles.deleteIcon}>🗑️</span>
                    </div>
                  </div>

                  <div className={styles.availRow}>
                    <span className={styles.dayName}><Txt>Thursday</Txt></span>
                    <div className={styles.timeInputs}>
                      <input type="text" defaultValue="14:00" />
                      <span>—</span>
                      <input type="text" defaultValue="18:00" />
                      <span className={styles.deleteIcon}>🗑️</span>
                    </div>
                  </div>

                  <div className={styles.availRow}>
                    <span className={styles.dayName}><Txt>Friday</Txt></span>
                    <div className={styles.timeInputs}>
                      <input type="text" defaultValue="10:00" />
                      <span>—</span>
                      <input type="text" defaultValue="17:00" />
                      <span className={styles.deleteIcon}>🗑️</span>
                    </div>
                  </div>

                  <p className={styles.hintFooter}>
                    ℹ️ <Txt>Other days will be marked unavailable by default</Txt>
                  </p>

                  <div className={styles.availRow} style={{ marginTop: '1.25rem' }}>
                    <span className={styles.dayName}><Txt>Lunch break</Txt></span>
                    <div className={styles.timeInputs}>
                      <input type="text" defaultValue="13:00" />
                      <span>—</span>
                      <input type="text" defaultValue="14:00" />
                      <span className={styles.deleteIcon}>✏️</span>
                    </div>
                  </div>
                </div>

                <div className={styles.vacationsCard}>
                  <div className={styles.vacationHeader}>
                    <h3><Txt>Vacations</Txt></h3>
                    <span className={styles.badge}><Txt>Coming in the next update</Txt></span>
                  </div>
                  <p><Txt>Mark dates when the teacher is unavailable</Txt></p>
                </div>
              </aside>
            </div>
          </div>
        )}
      </section>

      {/* Modal View */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <button className={styles.closeModal} onClick={resetForm}>&times;</button>

            {modalStep === 1 ? (
              <form onSubmit={handleNextStep}>
                <h3>
                  <UserPlusIcon /> <Txt>Add a teacher</Txt> 
                  <span className={styles.stepIndicator}><Txt>Step 1 of 2</Txt></span>
                </h3>
                <p className={styles.subtitle}><Txt>Fill in basic info</Txt></p>

                <div className={styles.inputGroup}>
                  <label><Txt>Name*</Txt></label>
                  <input
                    type="text"
                    placeholder="Olga Petrivna"
                    required
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label><Txt>Subject (required)*</Txt></label>
                  <div className={styles.selectWithColor}>
                    <select required value={newTeacherSubject} onChange={(e) => setNewTeacherSubject(e.target.value)}>
                      <option value=""><Txt>Select a subject...</Txt></option>
                      <option value="chemistry"><Txt>Chemistry</Txt></option>
                      <option value="mathematics"><Txt>Mathematics</Txt></option>
                      <option value="physics"><Txt>Physics</Txt></option>
                    </select>
                    <span className={styles.selectedColorPreview} style={{ backgroundColor: newTeacherColor }}></span>
                  </div>
                  <p className={styles.hint}><Txt>Select a subject and a color to mark in your schedule</Txt></p>
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
                  <label><Txt>Email*</Txt></label>
                  <input
                    type="email"
                    placeholder="hello@school.com"
                    required
                    value={newTeacherEmail}
                    onChange={handleEmailChange}
                  />
                  {emailError && <span className={styles.errorText}>⚠️ <Txt>{emailError}</Txt></span>}
                </div>

                <button type="submit" className={styles.primaryModalBtn}>
                  <Txt>Continue to availability</Txt>
                </button>
                <button type="button" className={styles.secondaryModalBtn} onClick={handleSaveTeacher}>
                  <Txt>Save and set later</Txt>
                </button>
              </form>
            ) : (
              <div>
                <h3>
                   &larr; <Txt>Add a teacher</Txt>
                  <span className={styles.stepIndicator}><Txt>Step 2 of 2</Txt></span>
                </h3>
                <p className={styles.subtitle}><Txt>Set teachers availability</Txt></p>

                <h4 className={styles.sectionDivider}><Txt>Work terms</Txt></h4>
                <div className={styles.rowInputs}>
                  <div className={styles.inputGroup}>
                    <label><Txt>Collaboration type *</Txt></label>
                    <select
                      value={collabType}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCollabType(e.target.value as "Contract" | "Freelance")}
                    >
                      <option value="Contract"><Txt>Contract</Txt></option>
                      <option value="Freelance"><Txt>Freelance</Txt></option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label><Txt>Due Date *</Txt></label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      disabled={collabType === "Freelance"}
                    />
                  </div>
                </div>

                <h4 className={styles.sectionDivider}><Txt>Regular availability</Txt></h4>
                <div className={styles.availabilityRow}>
                  <span><Txt>Workdays</Txt></span>
                  <div className={styles.timeInputs}>
                    <input type="time" defaultValue="09:00" />
                    <span>—</span>
                    <input type="time" defaultValue="17:00" />
                  </div>
                </div>

                <div className={styles.availabilityRow}>
                  <span><Txt>Lunch break</Txt></span>
                  <div className={styles.timeInputs}>
                    <input type="time" defaultValue="12:00" />
                    <span>—</span>
                    <input type="time" defaultValue="13:00" />
                  </div>
                </div>

                <p className={styles.infoLink}>
                  <Txt>You can set individual per-day later or</Txt>{" "}
                  <span className={styles.accentText}><Txt>add now</Txt></span>
                </p>

                <button type="button" className={styles.primaryModalBtn} onClick={handleSaveTeacher}>
                  <Txt>Save teacher</Txt>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};