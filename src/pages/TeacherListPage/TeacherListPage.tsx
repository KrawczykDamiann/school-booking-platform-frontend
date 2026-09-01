import React, { useState, useEffect } from "react";
import { useTranslatedText } from "../../hooks/useTranslatedText";
import { getTeachers, createTeacher, deleteTeacher } from "../../api/teachers";
import type { TeacherDto } from "../../api/teachers";
import styles from "./TeacherListPage.module.scss";

/* Helper for Google Translator */
const Txt: React.FC<{ children: string }> = ({ children }) => {
  const translated = useTranslatedText(children);
  return <>{translated}</>;
};

/* Interfaces & Data */
export interface Teacher {
  id: number | string;
  uuid?: string;
  name: string;
  email: string;
  subjectId?: number;
  subject: string;
  subjectColor: string;
  collabType: "Contract" | "Freelance";
  dueDate: string | null;
  isWarningDate?: boolean;
  avatar?: string;
  nextLessons?: string[];
}

const SUBJECT_OPTIONS = [
  { id: 1, name: "Chemistry" },
  { id: 2, name: "Mathematics" },
  { id: 3, name: "Physics" },
  { id: 4, name: "Biology" },
  { id: 5, name: "English" },
  { id: 6, name: "History" },
  { id: 7, name: "Literature" },
];

const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 1,
    name: "Kataryna Novak",
    email: "k.nowakchemistry@onlineschool.com",
    subjectId: 1,
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
    subjectId: 2,
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
    subjectId: 3,
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
    subjectId: 4,
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
    subjectId: 7,
    subject: "Literature",
    subjectColor: "#fbad34",
    collabType: "Contract",
    dueDate: "31/12/27",
    avatar: "https://i.pravatar.cc/150?img=41",
  },
  {
    id: 6,
    name: "Dmytro Kozak",
    email: "d.kozak@onlineschool.com",
    subjectId: 5,
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
    subjectId: 6,
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
    subjectId: 5,
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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);
const UserPlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);
const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const ContactIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
    <circle cx="8" cy="12" r="3"></circle>
    <line x1="14" y1="10" x2="19" y2="10"></line>
    <line x1="14" y1="14" x2="19" y2="14"></line>
  </svg>
);
const ForkKnifeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
    <path d="M7 2v20"></path>
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"></path>
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const timeToMins = (t: string) => {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export const TeacherListPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);

  /* Teacher Form State */
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherSubjectId, setNewTeacherSubjectId] = useState<number | "">("");
  const [newTeacherColor, setNewTeacherColor] = useState(""); 
  const [newTeacherEmail, setNewTeacherEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [collabType, setCollabType] = useState<"Contract" | "Freelance">("Contract");
  const [dueDate, setDueDate] = useState("2027-06-06");

  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);

  /* Interactive Schedule State */
  const [scheduleAvail, setScheduleAvail] = useState({
    monday: { start: "14:00", end: "16:00", active: true },
    tuesday: { start: "15:00", end: "19:00", active: true },
    wednesday: { start: "12:00", end: "18:00", active: true },
    thursday: { start: "14:00", end: "18:00", active: true },
    friday: { start: "10:00", end: "17:00", active: true },
    saturday: { start: "10:00", end: "14:00", active: false },
    sunday: { start: "10:00", end: "14:00", active: false },
  });
  const [lunch, setLunch] = useState({ start: "13:00", end: "14:00" });

  /* Fetch Teachers on Mount */
  useEffect(() => {
    getTeachers()
      .then((res: any) => {
        const rawList: any[] = Array.isArray(res) ? res : (res?.content || []);

        if (rawList.length > 0) {
          const mappedFromApi: Teacher[] = rawList.map((t: any, idx: number) => {
            const firstName = t.firstName || t.first_name || "";
            const lastName = t.lastName || t.last_name || "";
            const fullName = t.name || `${firstName} ${lastName}`.trim() || "Teacher";

            const emailStr =
              typeof t.email === "object" && t.email !== null
                ? t.email.value || ""
                : typeof t.email === "string"
                ? t.email
                : "";

            const sName =
              typeof t.subject === "object" && t.subject !== null
                ? t.subject.name
                : typeof t.subject === "string"
                ? t.subject
                : undefined;

            const foundSubject = SUBJECT_OPTIONS.find(
              (s) => s.id === (t.subjectId || t.subject_id || (t.subject && t.subject.id))
            );

            return {
              id: t.uuid || t.id || idx + 100,
              uuid: t.uuid,
              name: fullName,
              email: emailStr,
              subjectId: t.subjectId || t.subject_id || (t.subject && t.subject.id) || 1,
              subject: sName || (foundSubject ? foundSubject.name : "Chemistry"),
              subjectColor: t.subjectColor || "#38ef7d",
              collabType: (t.collabType as "Contract" | "Freelance") || "Contract",
              dueDate: t.dueDate || "Without term",
            };
          });

          const apiEmails = new Set(
            mappedFromApi.map((m) => (m.email ? m.email.toLowerCase() : "")).filter(Boolean)
          );
          const filteredMock = INITIAL_TEACHERS.filter(
            (init) => !apiEmails.has(init.email.toLowerCase())
          );
          setTeachers([...filteredMock, ...mappedFromApi]);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch teachers from backend, using default mock data:", err);
      });
  }, []);

  /* Remove and Add Day Functions */
  const handleRemoveDay = (dayId: string) => {
    setScheduleAvail((prev) => ({
      ...prev,
      [dayId]: { ...prev[dayId as keyof typeof prev], active: false },
    }));
  };

  const handleAddDay = () => {
    const allKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const nextInactive = allKeys.find((k) => !scheduleAvail[k as keyof typeof scheduleAvail].active);
    
    if (nextInactive) {
      setScheduleAvail((prev) => ({
        ...prev,
        [nextInactive]: { ...prev[nextInactive as keyof typeof prev], active: true },
      }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewTeacherEmail(val);
    if (val === "hello@school.com") {
      setEmailError("This email already exists in your list");
    } else {
      setEmailError("");
    }
  };

  const isStep1Valid =
    newTeacherName.trim() !== "" &&
    newTeacherSubjectId !== "" &&
    newTeacherEmail.trim() !== "" &&
    newTeacherColor !== "" &&
    !emailError;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStep1Valid) {
      setModalStep(2);
    }
  };

  const handleSaveTeacher = async () => {
    const selectedSub = SUBJECT_OPTIONS.find((s) => s.id === Number(newTeacherSubjectId));
    const subjectName = selectedSub ? selectedSub.name : "Chemistry";

    const nameParts = (newTeacherName || "Draft Teacher").trim().split(" ");
    const firstName = nameParts[0] || "Draft";
    const lastName = nameParts.slice(1).join(" ") || "Teacher";

    const newTeacherPayload: Partial<TeacherDto> = {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email: newTeacherEmail || "draft@school.com",
      subjectId: Number(newTeacherSubjectId) || 1,
      subjectColor: newTeacherColor || "#00d2ff",
      collabType: collabType,
      dueDate: collabType === "Freelance" ? "Without term" : new Date(dueDate).toLocaleDateString("en-GB"),
    };

    try {
      const saved: any = await createTeacher(newTeacherPayload);
      const subjectLabel =
        typeof saved.subject === "object" && saved.subject !== null
          ? saved.subject.name
          : typeof saved.subject === "string"
          ? saved.subject
          : subjectName;

      const savedFullName =
        saved.name ||
        `${saved.firstName || ""} ${saved.lastName || ""}`.trim() ||
        newTeacherPayload.name!;

      const created: Teacher = {
        id: saved.uuid || saved.id || teachers.length + 1,
        uuid: saved.uuid,
        name: savedFullName,
        email: saved.email || newTeacherPayload.email!,
        subjectId: saved.subjectId || newTeacherPayload.subjectId!,
        subject: subjectLabel || "Chemistry",
        subjectColor: saved.subjectColor || newTeacherPayload.subjectColor!,
        collabType: (saved.collabType as "Contract" | "Freelance") || newTeacherPayload.collabType!,
        dueDate: saved.dueDate || newTeacherPayload.dueDate!,
      };
      setTeachers((prev) => [...prev, created]);
    } catch (err) {
      console.error("API Error saving teacher, falling back to local state:", err);
      const fallback: Teacher = {
        id: teachers.length + 1,
        name: newTeacherPayload.name!,
        email: newTeacherPayload.email!,
        subjectId: newTeacherPayload.subjectId!,
        subject: subjectName,
        subjectColor: newTeacherPayload.subjectColor!,
        collabType: newTeacherPayload.collabType!,
        dueDate: newTeacherPayload.dueDate!,
      };
      setTeachers((prev) => [...prev, fallback]);
    }

    resetForm();
  };

  const handleDeleteTeacher = async (teacher: Teacher) => {
    const identifier = teacher.uuid || teacher.id;
    try {
      await deleteTeacher(identifier);
      setTeachers((prev) => prev.filter((t) => (t.uuid ? t.uuid !== teacher.uuid : t.id !== teacher.id)));
      if (selectedTeacherId === teacher.id || selectedTeacherId === teacher.uuid) {
        setSelectedTeacherId(null);
        setViewMode("list");
      }
    } catch (err) {
      console.error("API Error deleting teacher, removing locally:", err);
      setTeachers((prev) => prev.filter((t) => (t.uuid ? t.uuid !== teacher.uuid : t.id !== teacher.id)));
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setModalStep(1);
    setNewTeacherName("");
    setNewTeacherSubjectId("");
    setNewTeacherEmail("");
    setNewTeacherColor("");
    setEmailError("");
    setIsColorPaletteOpen(false);
  };

  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId || (t.uuid && t.uuid === selectedTeacherId)) ?? teachers[0];

  const MATRIX_DAYS = [
    { id: 'monday', date: '29', name: 'Monday' },
    { id: 'tuesday', date: '30', name: 'Tuesday' },
    { id: 'wednesday', date: '1', name: 'Wednesday' },
    { id: 'thursday', date: '2', name: 'Thursday' },
    { id: 'friday', date: '3', name: 'Friday' },
  ];

  const ALL_DAYS_LIST = [
    { id: 'monday', name: 'Monday' },
    { id: 'tuesday', name: 'Tuesday' },
    { id: 'wednesday', name: 'Wednesday' },
    { id: 'thursday', name: 'Thursday' },
    { id: 'friday', name: 'Friday' },
    { id: 'saturday', name: 'Saturday' },
    { id: 'sunday', name: 'Sunday' },
  ];

  const TIMES = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  return (
    <div className={styles.dashboardContainer}>
      <section className={styles.mainContent}>
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
                    <th className={styles.thAction}><Txt>Delete</Txt></th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => {
                    const isSelected = selectedTeacherId === teacher.id || (teacher.uuid && selectedTeacherId === teacher.uuid);

                    return (
                      <tr
                        key={teacher.uuid || teacher.id}
                        className={isSelected ? styles.activeRow : ""}
                        onClick={() => setSelectedTeacherId(isSelected ? null : (teacher.uuid || teacher.id))}
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
                        <td className={styles.actionCell} onClick={(e) => e.stopPropagation()}>
                          <button className={styles.actionIconButton} title="Edit teacher">
                            <EditIcon />
                          </button>
                        </td>
                        <td className={styles.actionCell} onClick={(e) => e.stopPropagation()}>
                          <button 
                            type="button" 
                            className={styles.actionIconButton} 
                            title="Delete teacher"
                            style={{ color: "#ff4757" }}
                            onClick={() => handleDeleteTeacher(teacher)}
                          >
                            <TrashIcon />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <button className={styles.backBtn} onClick={() => { setViewMode("list"); setSelectedTeacherId(null); }}>
              &larr; <Txt>Back to Teachers List</Txt>
            </button>

            <div className={styles.detailGrid}>
              
              <aside className={styles.avatarsSidebar}>
                <h3><Txt>Teachers</Txt></h3>
                {teachers.map((tItem) => {
                  const isActive = (tItem.uuid && tItem.uuid === selectedTeacher.uuid) || tItem.id === selectedTeacher.id;

                  return (
                    <div
                      key={tItem.uuid || tItem.id}
                      className={`${styles.teacherNavItem} ${isActive ? styles.activeNavItem : ""}`}
                      onClick={() => setSelectedTeacherId(tItem.uuid || tItem.id)}
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
                  <div className={styles.headerRight} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span><Txt>{selectedTeacher.subject}</Txt></span>
                    <button 
                      type="button"
                      onClick={() => handleDeleteTeacher(selectedTeacher)}
                      style={{ background: 'transparent', border: 'none', color: '#ff4757', cursor: 'pointer', fontSize: '1.1rem' }}
                      title="Delete teacher"
                    >
                      <TrashIcon />
                    </button>
                    <button className={styles.actionIconButton}><EditIcon /></button>
                  </div>
                </div>

                <div className={styles.scheduleGridCard}>
                  <div className={styles.scheduleHeader}>
                    <h3><Txt>Schedule</Txt></h3>
                    <span>📅 <Txt>June 29 - July 5</Txt></span>
                  </div>

                  <div className={styles.calendarMatrix}>
                    {MATRIX_DAYS.map(day => (
                      <div key={day.id} className={styles.dayColumn}>
                        <div className={`${styles.dayHeader} ${day.id === 'monday' ? styles.activeDay : ''}`}>
                          {day.date} <span className={styles.dayNum}><Txt>{day.name}</Txt></span>
                        </div>
                        {TIMES.map(time => {
                          const tMins = timeToMins(time);
                          const dayConfig = scheduleAvail[day.id as keyof typeof scheduleAvail];
                          
                          const wStart = timeToMins(dayConfig.start);
                          const wEnd = timeToMins(dayConfig.end);
                          const lStart = timeToMins(lunch.start);
                          const lEnd = timeToMins(lunch.end);

                          const isWork = dayConfig.active && (tMins >= wStart && tMins < wEnd);
                          const isLunch = tMins >= lStart && tMins < lEnd;
                          
                          const isSelected = isWork && !isLunch;
                          
                          const isBooked = (day.id === "wednesday" || day.id === "thursday") && time === "17:00";

                          let classes = styles.timeSlot;
                          if (isSelected && isBooked) classes += ` ${styles.bookedSlot}`;
                          else if (isSelected) classes += ` ${styles.selectedSlot}`;
                          else if (isBooked) classes += ` ${styles.bookedSlot}`;

                          return <div key={time} className={classes}>{time}</div>;
                        })}
                      </div>
                    ))}
                  </div>

                  <div className={styles.scheduleFooter}>
                    <div className={styles.nextLessonsLabel}>
                      <Txt>Next lessons:</Txt> <span>29/06 14:00 15:00 2/07 14:00</span>
                    </div>
                    <button className={styles.sendScheduleBtn}><Txt>Send schedule</Txt></button>
                  </div>
                </div>
              </main>

              <aside className={styles.availabilityColumn}>
                <div className={styles.availabilityCard}>
                  <div className={styles.cardHeader}>
                    <h3><Txt>Availability</Txt></h3>
                    <button className={styles.addDayBtn} onClick={handleAddDay}><Txt>+ Add day</Txt></button>
                  </div>
                  <p className={styles.subtext}><Txt>Set weekly availability hours for this teacher</Txt></p>

                  {ALL_DAYS_LIST.filter(day => scheduleAvail[day.id as keyof typeof scheduleAvail].active).map(day => (
                    <div key={day.id} className={styles.availRow}>
                      <span className={styles.dayName}><Txt>{day.name}</Txt></span>
                      <div className={styles.timeInputs}>
                        <input 
                          type="time" 
                          step="900" 
                          value={scheduleAvail[day.id as keyof typeof scheduleAvail].start}
                          onChange={(e) => setScheduleAvail({...scheduleAvail, [day.id]: { ...scheduleAvail[day.id as keyof typeof scheduleAvail], start: e.target.value }})}
                        />
                        <span>—</span>
                        <input 
                          type="time" 
                          step="900"
                          value={scheduleAvail[day.id as keyof typeof scheduleAvail].end}
                          onChange={(e) => setScheduleAvail({...scheduleAvail, [day.id]: { ...scheduleAvail[day.id as keyof typeof scheduleAvail], end: e.target.value }})}
                        />
                        <span className={styles.deleteIcon} onClick={() => handleRemoveDay(day.id)}>🗑️</span>
                      </div>
                    </div>
                  ))}

                  <p className={styles.hintFooter}>
                    <InfoIcon /> <Txt>Other days will be marked unavailable by default</Txt>
                  </p>

                  <div className={styles.availRow} style={{ marginTop: '1.25rem' }}>
                    <span className={styles.dayName}><Txt>Lunch break</Txt></span>
                    <div className={styles.timeInputs}>
                      <input 
                        type="time" 
                        step="900" 
                        value={lunch.start}
                        onChange={(e) => setLunch({...lunch, start: e.target.value})}
                      />
                      <span>—</span>
                      <input 
                        type="time" 
                        step="900"
                        value={lunch.end}
                        onChange={(e) => setLunch({...lunch, end: e.target.value})}
                      />
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

      {/* FIGMA ALIGNED MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            
            {modalStep === 1 ? (
              <form onSubmit={handleNextStep}>
                
                <div className={styles.modalHeader}>
                  <div className={styles.titleGroup}>
                    <UserPlusIcon />
                    <h3><Txt>Add a teacher</Txt></h3>
                  </div>
                  <div className={styles.headerRight}>
                    <span className={styles.stepIndicator}><Txt>Step 1 of 2</Txt></span>
                    <button type="button" className={styles.closeModal} onClick={resetForm}>&times;</button>
                  </div>
                </div>
                
                <p className={styles.subtitle}><Txt>Fill-in basic information</Txt></p>

                <div className={styles.inputWrapper}>
                  <label><Txt>Name *</Txt></label>
                  <input
                    type="text"
                    placeholder="Olga Petrivna"
                    required
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                  />
                </div>

                <div className={styles.subjectRow}>
                  <div className={styles.inputWrapper}>
                    <label><Txt>Subject (required) *</Txt></label>
                    <select
                      required
                      value={newTeacherSubjectId}
                      onChange={(e) => setNewTeacherSubjectId(Number(e.target.value))}
                    >
                      <option value="" disabled hidden></option>
                      {SUBJECT_OPTIONS.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.colorPickerContainer}>
                    <button 
                      type="button" 
                      className={styles.colorWheelBtn}
                      onClick={() => setIsColorPaletteOpen(!isColorPaletteOpen)}
                    >
                      {newTeacherColor && <span className={styles.innerColorDot} style={{ backgroundColor: newTeacherColor }}></span>}
                    </button>

                    {isColorPaletteOpen && (
                      <div className={styles.floatingPalette}>
                        {AVAILABLE_COLORS.map((c) => (
                          <button
                            type="button"
                            key={c}
                            className={`${styles.paletteDot} ${newTeacherColor === c ? styles.activePaletteDot : ""}`}
                            style={{ backgroundColor: c }}
                            onClick={() => {
                              setNewTeacherColor(c);
                              setIsColorPaletteOpen(false);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <p className={styles.hint}><Txt>Select a subject and a colour to mark in your schedule</Txt></p>

                <div className={`${styles.inputWrapper} ${emailError ? styles.errorState : ""}`}>
                  <label><Txt>Email *</Txt></label>
                  <div className={styles.inputWithLeftIcon}>
                    <MailIcon />
                    <input
                      type="email"
                      placeholder="hello@school.com"
                      required
                      value={newTeacherEmail}
                      onChange={handleEmailChange}
                    />
                  </div>
                </div>
                {emailError && <p className={styles.errorText}>{emailError}</p>}

                <div className={styles.modalFooterActions}>
                  <button type="submit" disabled={!isStep1Valid} className={styles.primaryBtn}>
                    <Txt>Continue to availability</Txt>
                  </button>
                  <button type="button" className={styles.secondaryBtn} onClick={handleSaveTeacher}>
                    <Txt>Save and set later</Txt>
                  </button>
                </div>

                <p className={styles.modalFooterHint}>
                  <InfoIcon /> <Txt>A teacher will be unavailable for booking, until you set their availability</Txt>
                </p>
              </form>
            ) : (
              <div>
                <div className={styles.modalHeader}>
                  <div className={styles.titleGroup}>
                    <button type="button" className={styles.backStepBtn} onClick={() => setModalStep(1)}>&larr;</button>
                    <h3><Txt>Add a teacher</Txt></h3>
                  </div>
                  <div className={styles.headerRight}>
                    <span className={styles.stepIndicator}><Txt>Step 2 of 2</Txt></span>
                    <button type="button" className={styles.closeModal} onClick={resetForm}>&times;</button>
                  </div>
                </div>
                <p className={styles.subtitle}><Txt>Set teacher's availability</Txt></p>

                <h4 className={styles.sectionDivider}><Txt>Work terms</Txt></h4>
                <div className={styles.rowInputs}>
                  <div className={styles.inputWrapper}>
                    <label><Txt>Collaboration type *</Txt></label>
                    <div className={styles.inputWithLeftIcon}>
                      <ContactIcon />
                      <select
                        value={collabType}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCollabType(e.target.value as "Contract" | "Freelance")}
                      >
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.inputWrapper}>
                    <label><Txt>Due Date *</Txt></label>
                    <div className={styles.inputWithRightIcon}>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        disabled={collabType === "Freelance"}
                      />
                      <CalendarIcon />
                    </div>
                  </div>
                </div>

                <h4 className={styles.sectionDivider}><Txt>Regular availability</Txt></h4>
                <div className={styles.availabilityRow}>
                  <span className={styles.availLabel}>
                    <BriefcaseIcon /> <Txt>Workdays</Txt>
                  </span>
                  <div className={styles.timeInputs}>
                    <input type="time" step="900" defaultValue="09:00" />
                    <span>—</span>
                    <input type="time" step="900" defaultValue="17:00" />
                  </div>
                </div>

                <div className={styles.availabilityRow}>
                  <span className={styles.availLabel}>
                    <ForkKnifeIcon /> <Txt>Lunch break</Txt>
                  </span>
                  <div className={styles.timeInputs}>
                    <input type="time" step="900" defaultValue="12:00" />
                    <span>—</span>
                    <input type="time" step="900" defaultValue="13:00" />
                  </div>
                </div>

                <p className={styles.infoLink}>
                  <InfoIcon /> <Txt>You can set individual per day later or</Txt>{" "}
                  <span className={styles.accentText}><Txt>add now</Txt></span>
                </p>

                <button type="button" className={`${styles.primaryBtn} ${styles.activeBtn}`} onClick={handleSaveTeacher}>
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