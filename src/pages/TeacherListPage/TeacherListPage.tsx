import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslatedText } from "../../hooks/useTranslatedText";
import {
  getTeachers,
  createTeacher,
  updateTeacher,
  updateTeacherAvatar,
  getTeacherAvailability,
  updateTeacherAvailability,
  deleteTeacher,
} from "../../api/teachers";
import type { TeacherDto, TeacherAvailabilityDto } from "../../api/teachers";
import { fetchSubjects } from "../../api/subjects";
import styles from "./TeacherListPage.module.scss";

const Txt: React.FC<{ children: string }> = ({ children }) => {
  const translated = useTranslatedText(children);
  return <>{translated}</>;
};

export interface SubjectItem {
  id: number;
  name: string;
  color?: string;
  description?: string | null;
}

export interface Teacher {
  id: number | string;
  uuid?: string;
  name: string;
  email: string;
  avatarUrl?: string;
  avatar?: string;
  subjectId?: number;
  subject: string;
  subjectColor: string;
  collabType: "Contract" | "Freelance";
  dueDate: string | null;
  isWarningDate?: boolean;
  nextLessons?: string[];
}

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

const DEFAULT_COLOR = "#00d2ff";

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
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const isValidTime = (t: string) => {
  return typeof t === "string" && /^\d{2}:\d{2}$/.test(t.trim());
};

const TIMES = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

const ALL_DAYS_LIST = [
  { id: "monday", name: "Monday" },
  { id: "tuesday", name: "Tuesday" },
  { id: "wednesday", name: "Wednesday" },
  { id: "thursday", name: "Thursday" },
  { id: "friday", name: "Friday" },
  { id: "saturday", name: "Saturday" },
  { id: "sunday", name: "Sunday" },
];

export const TeacherListPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);

  const [editingTeacherUuid, setEditingTeacherUuid] = useState<string | null>(null);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherAvatarUrl, setNewTeacherAvatarUrl] = useState("");
  const [newTeacherSubjectId, setNewTeacherSubjectId] = useState<number | "">("");
  const [newTeacherColor, setNewTeacherColor] = useState(DEFAULT_COLOR);
  const [newTeacherEmail, setNewTeacherEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [collabType, setCollabType] = useState<"Contract" | "Freelance">("Contract");
  const [dueDate, setDueDate] = useState("2027-06-06");

  const [modalWorkStart, setModalWorkStart] = useState("07:00");
  const [modalWorkEnd, setModalWorkEnd] = useState("15:00");
  const [modalLunchStart, setModalLunchStart] = useState("12:00");
  const [modalLunchEnd, setModalLunchEnd] = useState("13:00");

  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);

  const [scheduleAvail, setScheduleAvail] = useState({
    monday: { start: "07:00", end: "15:00", active: true },
    tuesday: { start: "07:00", end: "15:00", active: true },
    wednesday: { start: "07:00", end: "15:00", active: true },
    thursday: { start: "07:00", end: "15:00", active: true },
    friday: { start: "07:00", end: "15:00", active: true },
    saturday: { start: "10:00", end: "14:00", active: false },
    sunday: { start: "10:00", end: "14:00", active: false },
  });
  const [lunch, setLunch] = useState({ start: "12:00", end: "13:00" });

  const userTimeZone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Warsaw";
    } catch {
      return "Europe/Warsaw";
    }
  }, []);

  const { currentWeekDays, weekRangeLabel } = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(now);
    monday.setDate(now.getDate() + distanceToMonday);

    const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday"] as const;
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const days = dayKeys.map((key, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        id: key,
        name: dayNames[i],
        date: String(d.getDate()),
        isToday: d.toDateString() === now.toDateString(),
      };
    });

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const mondayMonth = monday.toLocaleString("en-US", { month: "short" });
    const fridayMonth = friday.toLocaleString("en-US", { month: "short" });

    const rangeStr =
      mondayMonth === fridayMonth
        ? `${mondayMonth} ${monday.getDate()} - ${friday.getDate()}`
        : `${mondayMonth} ${monday.getDate()} - ${fridayMonth} ${friday.getDate()}`;

    return { currentWeekDays: days, weekRangeLabel: rangeStr };
  }, []);

  useEffect(() => {
    setIsLoadingSubjects(true);
    fetchSubjects()
      .then((res: any) => {
        const rawSubs: any[] = res?.content || (Array.isArray(res) ? res : []);
        setSubjects(rawSubs);
      })
      .catch((err) => {
        console.error("Failed to fetch subjects from backend:", err);
      })
      .finally(() => {
        setIsLoadingSubjects(false);
      });

    getTeachers()
      .then((res: any) => {
        const rawList: any[] = res?.content || (Array.isArray(res) ? res : []);

        const mappedFromApi: Teacher[] = rawList.map((t: any, idx: number) => {
          const firstName = t.firstName || t.first_name || "";
          const lastName = t.lastName || t.last_name || "";
          const fullName =
            t.name || `${firstName} ${lastName}`.trim() || t.email || "Teacher";

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

          const sId =
            t.subjectId ||
            t.subject_id ||
            (t.subject && typeof t.subject === "object" ? t.subject.id : undefined);

          const resolvedColor =
            t.color ||
            t.subjectColor ||
            t.subject_color ||
            (typeof t.subject === "object" && t.subject !== null ? t.subject.color : undefined) ||
            DEFAULT_COLOR;

          const resolvedAvatar = t.avatarUrl || t.avatar || undefined;

          return {
            id: t.uuid || t.id || `teacher-${idx}`,
            uuid: t.uuid,
            name: fullName,
            email: emailStr,
            avatar: resolvedAvatar,
            avatarUrl: resolvedAvatar,
            subjectId: sId,
            subject: sName || "",
            subjectColor: resolvedColor,
            collabType: (t.collabType as "Contract" | "Freelance") || "Contract",
            dueDate: t.dueDate || "Without term",
          };
        });

        setTeachers(mappedFromApi);

        const queryId = searchParams.get("teacherId");
        if (queryId) {
          const target = mappedFromApi.find(
            (t) => String(t.uuid) === queryId || String(t.id) === queryId
          );
          if (target) {
            setSelectedTeacherId(target.uuid || target.id);
            setViewMode("detail");
          }
        }
      })
      .catch((err) => {
        console.warn("Could not fetch teachers from backend:", err);
      });
  }, [searchParams]);

  useEffect(() => {
    if (!selectedTeacherId) return;
    const teacher = teachers.find(
      (t) => t.uuid === selectedTeacherId || String(t.id) === String(selectedTeacherId)
    );
    const targetUuid = teacher?.uuid || (typeof selectedTeacherId === "string" ? selectedTeacherId : null);

    if (targetUuid) {
      getTeacherAvailability(targetUuid)
        .then((avail) => {
          if (!avail) return;
          setScheduleAvail((prev) => ({
            monday: avail.monday
              ? { start: avail.monday.startTime, end: avail.monday.endTime, active: true }
              : { ...prev.monday, active: false },
            tuesday: avail.tuesday
              ? { start: avail.tuesday.startTime, end: avail.tuesday.endTime, active: true }
              : { ...prev.tuesday, active: false },
            wednesday: avail.wednesday
              ? { start: avail.wednesday.startTime, end: avail.wednesday.endTime, active: true }
              : { ...prev.wednesday, active: false },
            thursday: avail.thursday
              ? { start: avail.thursday.startTime, end: avail.thursday.endTime, active: true }
              : { ...prev.thursday, active: false },
            friday: avail.friday
              ? { start: avail.friday.startTime, end: avail.friday.endTime, active: true }
              : { ...prev.friday, active: false },
            saturday: avail.saturday
              ? { start: avail.saturday.startTime, end: avail.saturday.endTime, active: true }
              : { ...prev.saturday, active: false },
            sunday: avail.sunday
              ? { start: avail.sunday.startTime, end: avail.sunday.endTime, active: true }
              : { ...prev.sunday, active: false },
          }));
          if (avail.lunchBreak) {
            setLunch({
              start: avail.lunchBreak.startTime,
              end: avail.lunchBreak.endTime,
            });
          }
        })
        .catch((err) => {
          console.warn("Could not fetch teacher availability:", err);
        });
    }
  }, [selectedTeacherId, teachers]);

  const handleSubjectSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subId = Number(e.target.value);
    setNewTeacherSubjectId(subId);
    const found = subjects.find((s) => s.id === subId);
    if (found?.color) {
      setNewTeacherColor(found.color);
    }
  };

  const handleRemoveDay = (dayId: string) => {
    const updated = {
      ...scheduleAvail,
      [dayId]: { ...scheduleAvail[dayId as keyof typeof scheduleAvail], active: false },
    };
    setScheduleAvail(updated);
    handleSaveDetailAvailability(updated, lunch);
  };

  const handleAddDay = () => {
    const allKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const nextInactive = allKeys.find((k) => !scheduleAvail[k as keyof typeof scheduleAvail].active);

    if (nextInactive) {
      const updated = {
        ...scheduleAvail,
        [nextInactive]: { ...scheduleAvail[nextInactive as keyof typeof scheduleAvail], active: true },
      };
      setScheduleAvail(updated);
      handleSaveDetailAvailability(updated, lunch);
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
    !emailError;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStep1Valid) {
      setModalStep(2);
    }
  };

  const openEditModal = (t: Teacher) => {
    setEditingTeacherUuid(t.uuid || String(t.id));
    setNewTeacherName(t.name);
    setNewTeacherEmail(t.email);
    setNewTeacherAvatarUrl(t.avatarUrl || t.avatar || "");
    setNewTeacherSubjectId(t.subjectId || "");
    setNewTeacherColor(t.subjectColor || DEFAULT_COLOR);
    setCollabType(t.collabType || "Contract");
    setIsModalOpen(true);
  };

  const buildAvailabilityPayload = (
    availState = scheduleAvail,
    lunchState = lunch
  ): TeacherAvailabilityDto & { zoneId?: string } => {
    return {
      zoneId: userTimeZone,
      monday: availState.monday.active && isValidTime(availState.monday.start) && isValidTime(availState.monday.end)
        ? { startTime: availState.monday.start, endTime: availState.monday.end }
        : null,
      tuesday: availState.tuesday.active && isValidTime(availState.tuesday.start) && isValidTime(availState.tuesday.end)
        ? { startTime: availState.tuesday.start, endTime: availState.tuesday.end }
        : null,
      wednesday: availState.wednesday.active && isValidTime(availState.wednesday.start) && isValidTime(availState.wednesday.end)
        ? { startTime: availState.wednesday.start, endTime: availState.wednesday.end }
        : null,
      thursday: availState.thursday.active && isValidTime(availState.thursday.start) && isValidTime(availState.thursday.end)
        ? { startTime: availState.thursday.start, endTime: availState.thursday.end }
        : null,
      friday: availState.friday.active && isValidTime(availState.friday.start) && isValidTime(availState.friday.end)
        ? { startTime: availState.friday.start, endTime: availState.friday.end }
        : null,
      saturday: availState.saturday.active && isValidTime(availState.saturday.start) && isValidTime(availState.saturday.end)
        ? { startTime: availState.saturday.start, endTime: availState.saturday.end }
        : null,
      sunday: availState.sunday.active && isValidTime(availState.sunday.start) && isValidTime(availState.sunday.end)
        ? { startTime: availState.sunday.start, endTime: availState.sunday.end }
        : null,
      lunchBreak: isValidTime(lunchState.start) && isValidTime(lunchState.end)
        ? { startTime: lunchState.start, endTime: lunchState.end }
        : null,
    };
  };

  const handleSaveTeacher = async (saveWithAvailability = false) => {
    const selectedSub = subjects.find((s) => s.id === Number(newTeacherSubjectId));
    const subjectName = selectedSub ? selectedSub.name : "";

    const nameParts = (newTeacherName || "Teacher").trim().split(" ");
    const firstName = nameParts[0] || "Teacher";
    const lastName = nameParts.slice(1).join(" ") || "";

    const finalColor = newTeacherColor || selectedSub?.color || DEFAULT_COLOR;
    const finalAvatar = newTeacherAvatarUrl.trim() || undefined;

    const teacherPayload: Partial<TeacherDto> & { zoneId?: string } = {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email: newTeacherEmail,
      avatarUrl: finalAvatar,
      color: finalColor,
      subjectColor: finalColor,
      subjectId: Number(newTeacherSubjectId),
      collabType: collabType,
      zoneId: userTimeZone,
      dueDate: collabType === "Freelance" ? "Without term" : new Date(dueDate).toLocaleDateString("en-GB"),
    };

    try {
      if (editingTeacherUuid) {
        const updated: any = await updateTeacher(editingTeacherUuid, teacherPayload);

        if (finalAvatar) {
          try {
            await updateTeacherAvatar(editingTeacherUuid, finalAvatar);
          } catch (avatarErr) {
            console.error("API Error updating avatar via dedicated endpoint:", avatarErr);
          }
        }

        if (saveWithAvailability) {
          try {
            const workdayRange = { startTime: modalWorkStart, endTime: modalWorkEnd };
            const modalPayload: TeacherAvailabilityDto & { zoneId?: string } = {
              zoneId: userTimeZone,
              monday: workdayRange,
              tuesday: workdayRange,
              wednesday: workdayRange,
              thursday: workdayRange,
              friday: workdayRange,
              lunchBreak: { startTime: modalLunchStart, endTime: modalLunchEnd },
            };
            await updateTeacherAvailability(editingTeacherUuid, modalPayload);
          } catch (availErr) {
            console.error("API Error updating teacher availability:", availErr);
          }
        }

        const subjectLabel =
          typeof updated.subject === "object" && updated.subject !== null
            ? updated.subject.name
            : typeof updated.subject === "string"
            ? updated.subject
            : subjectName;

        const resolvedColor =
          updated.color ||
          updated.subjectColor ||
          updated.subject_color ||
          (typeof updated.subject === "object" && updated.subject !== null ? updated.subject.color : undefined) ||
          finalColor;

        const resolvedAvatar = updated.avatarUrl || updated.avatar || finalAvatar;

        setTeachers((prev) =>
          prev.map((t) =>
            t.uuid === editingTeacherUuid || String(t.id) === editingTeacherUuid
              ? {
                  ...t,
                  name: updated.name || teacherPayload.name!,
                  email: updated.email || teacherPayload.email!,
                  avatar: resolvedAvatar,
                  avatarUrl: resolvedAvatar,
                  subjectId: updated.subjectId || teacherPayload.subjectId!,
                  subject: subjectLabel,
                  subjectColor: resolvedColor,
                  collabType: (updated.collabType as "Contract" | "Freelance") || teacherPayload.collabType!,
                  dueDate: updated.dueDate || teacherPayload.dueDate!,
                }
              : t
          )
        );
      } else {
        const saved: any = await createTeacher(teacherPayload);
        const targetUuid = saved.uuid || saved.id;

        if (finalAvatar && targetUuid) {
          try {
            await updateTeacherAvatar(targetUuid, finalAvatar);
          } catch (avatarErr) {
            console.error("API Error setting avatar via dedicated endpoint:", avatarErr);
          }
        }

        if (saveWithAvailability && targetUuid) {
          try {
            const workdayRange = { startTime: modalWorkStart, endTime: modalWorkEnd };
            const modalPayload: TeacherAvailabilityDto & { zoneId?: string } = {
              zoneId: userTimeZone,
              monday: workdayRange,
              tuesday: workdayRange,
              wednesday: workdayRange,
              thursday: workdayRange,
              friday: workdayRange,
              lunchBreak: { startTime: modalLunchStart, endTime: modalLunchEnd },
            };
            await updateTeacherAvailability(targetUuid, modalPayload);
          } catch (availErr) {
            console.error("API Error setting teacher availability:", availErr);
          }
        }

        const subjectLabel =
          typeof saved.subject === "object" && saved.subject !== null
            ? saved.subject.name
            : typeof saved.subject === "string"
            ? saved.subject
            : subjectName;

        const savedFullName =
          saved.name ||
          `${saved.firstName || ""} ${saved.lastName || ""}`.trim() ||
          teacherPayload.name!;

        const resolvedColor =
          saved.color ||
          saved.subjectColor ||
          saved.subject_color ||
          (typeof saved.subject === "object" && saved.subject !== null ? saved.subject.color : undefined) ||
          finalColor;

        const resolvedAvatar = saved.avatarUrl || saved.avatar || finalAvatar;

        const created: Teacher = {
          id: saved.uuid || saved.id || `teacher-${Date.now()}`,
          uuid: saved.uuid,
          name: savedFullName,
          email: saved.email || teacherPayload.email!,
          avatar: resolvedAvatar,
          avatarUrl: resolvedAvatar,
          subjectId: saved.subjectId || teacherPayload.subjectId!,
          subject: subjectLabel,
          subjectColor: resolvedColor,
          collabType: (saved.collabType as "Contract" | "Freelance") || teacherPayload.collabType!,
          dueDate: saved.dueDate || teacherPayload.dueDate!,
        };

        setTeachers((prev) => [...prev, created]);
      }
    } catch (err) {
      console.error("API Error saving teacher:", err);
    }

    resetForm();
  };

  const handleSaveDetailAvailability = async (
    availState = scheduleAvail,
    lunchState = lunch
  ) => {
    if (!selectedTeacher) return;
    const targetUuid = selectedTeacher.uuid || (typeof selectedTeacher.id === "string" ? selectedTeacher.id : null);
    if (!targetUuid) return;

    try {
      const payload = buildAvailabilityPayload(availState, lunchState);
      await updateTeacherAvailability(targetUuid, payload);
    } catch (err) {
      console.error("API Error saving availability from details view:", err);
    }
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
      console.error("API Error deleting teacher:", err);
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setModalStep(1);
    setEditingTeacherUuid(null);
    setNewTeacherName("");
    setNewTeacherAvatarUrl("");
    setNewTeacherSubjectId("");
    setNewTeacherEmail("");
    setNewTeacherColor(DEFAULT_COLOR);
    setEmailError("");
    setIsColorPaletteOpen(false);
    setModalWorkStart("07:00");
    setModalWorkEnd("15:00");
    setModalLunchStart("12:00");
    setModalLunchEnd("13:00");
  };

  const selectedTeacher =
    teachers.find((t) => t.id === selectedTeacherId || (t.uuid && t.uuid === selectedTeacherId)) ??
    teachers[0];

  return (
    <div className={styles.dashboardContainer}>
      <section className={styles.mainContent}>
        {viewMode === "list" ? (
          <div className={styles.listSection}>
            <div className={styles.topHeader}>
              <h2><Txt>Teachers</Txt></h2>
              <button
                className={styles.addTeacherBtn}
                onClick={() => {
                  resetForm();
                  setIsModalOpen(true);
                }}
              >
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
                    const isSelected =
                      selectedTeacherId === teacher.id || (teacher.uuid && selectedTeacherId === teacher.uuid);

                    const matchedSub = subjects.find((s) => s.id === teacher.subjectId);
                    const displaySubject = matchedSub?.name || teacher.subject || "—";
                    const avatarColor = teacher.subjectColor || matchedSub?.color || DEFAULT_COLOR;
                    const avatarSrc = teacher.avatarUrl || teacher.avatar;

                    return (
                      <tr
                        key={teacher.uuid || teacher.id}
                        className={isSelected ? styles.activeRow : ""}
                        style={{ '--subject-color': avatarColor } as React.CSSProperties}
                        onClick={() => {
                          setSelectedTeacherId(teacher.uuid || teacher.id);
                          setViewMode("detail");
                        }}
                      >
                        <td className={styles.nameCell}>
                          {avatarSrc ? (
                            <img
                              src={avatarSrc}
                              alt={teacher.name}
                              className={styles.avatarImg}
                            />
                          ) : (
                            <div className={styles.avatarMock}>
                              {teacher.name
                                .split(" ")
                                .filter(Boolean)
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase() || "T"}
                            </div>
                          )}
                          <span>{teacher.name}</span>
                        </td>
                        <td>
                          <span className={styles.subjectWrapper}>
                            <span className={styles.colorDot}></span>
                            <Txt>{displaySubject}</Txt>
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
                          <button
                            type="button"
                            className={styles.actionIconButton}
                            title="Edit teacher"
                            onClick={() => openEditModal(teacher)}
                          >
                            <EditIcon />
                          </button>
                        </td>
                        <td className={styles.actionCell} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className={`${styles.actionIconButton} ${styles.deleteBtn}`}
                            title="Delete teacher"
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

            {selectedTeacher && (
              <div className={styles.detailGrid}>
                <aside className={styles.avatarsSidebar}>
                  <h3><Txt>Teachers</Txt></h3>
                  {teachers.map((tItem) => {
                    const isActive =
                      (tItem.uuid && tItem.uuid === selectedTeacher.uuid) || tItem.id === selectedTeacher.id;

                    const matchedSub = subjects.find((s) => s.id === tItem.subjectId);
                    const displaySubject = matchedSub?.name || tItem.subject || "—";
                    const navColor = tItem.subjectColor || matchedSub?.color || DEFAULT_COLOR;
                    const navAvatarSrc = tItem.avatarUrl || tItem.avatar;

                    return (
                      <div
                        key={tItem.uuid || tItem.id}
                        className={`${styles.teacherNavItem} ${isActive ? styles.activeNavItem : ""}`}
                        style={{ '--subject-color': navColor } as React.CSSProperties}
                        onClick={() => setSelectedTeacherId(tItem.uuid || tItem.id)}
                      >
                        {navAvatarSrc ? (
                          <img
                            src={navAvatarSrc}
                            alt={tItem.name}
                            className={styles.navAvatar}
                          />
                        ) : (
                          <div className={styles.navAvatarMock}>
                            {tItem.name
                              .split(" ")
                              .filter(Boolean)
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase() || "T"}
                          </div>
                        )}
                        <div className={styles.navInfo}>
                          <span className={styles.navName}>{tItem.name}</span>
                          <span className={styles.navSubject}><Txt>{displaySubject}</Txt></span>
                        </div>
                      </div>
                    );
                  })}
                </aside>

                <main className={styles.scheduleColumn}>
                  <div
                    className={styles.teacherHeaderCard}
                    style={{ '--subject-color': selectedTeacher.subjectColor || DEFAULT_COLOR } as React.CSSProperties}
                  >
                    <div className={styles.headerLeft}>
                      {selectedTeacher.avatarUrl || selectedTeacher.avatar ? (
                        <img
                          src={selectedTeacher.avatarUrl || selectedTeacher.avatar}
                          alt="Avatar"
                          className={styles.headerAvatar}
                        />
                      ) : (
                        <div className={styles.headerAvatarMock}>
                          {selectedTeacher.name
                            .split(" ")
                            .filter(Boolean)
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase() || "T"}
                        </div>
                      )}
                      <div className={styles.headerDetails}>
                        <h3>{selectedTeacher.name}</h3>
                        <p>{selectedTeacher.email}</p>
                      </div>
                    </div>
                    <div className={styles.headerRight}>
                      <span>
                        <Txt>
                          {subjects.find((s) => s.id === selectedTeacher.subjectId)?.name || selectedTeacher.subject}
                        </Txt>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteTeacher(selectedTeacher)}
                        className={styles.headerDeleteBtn}
                        title="Delete teacher"
                      >
                        <TrashIcon />
                      </button>
                      <button
                        type="button"
                        className={styles.actionIconButton}
                        title="Edit teacher"
                        onClick={() => openEditModal(selectedTeacher)}
                      >
                        <EditIcon />
                      </button>
                    </div>
                  </div>

                  <div className={styles.scheduleGridCard}>
                    <div className={styles.scheduleHeader}>
                      <h3><Txt>Schedule</Txt></h3>
                      <span>📅 <Txt>{weekRangeLabel}</Txt></span>
                    </div>

                    <div className={styles.calendarMatrix}>
                      {currentWeekDays.map((day) => (
                        <div key={day.id} className={styles.dayColumn}>
                          <div className={`${styles.dayHeader} ${day.isToday ? styles.activeDay : ""}`}>
                            {day.date} <span className={styles.dayNum}><Txt>{day.name}</Txt></span>
                          </div>
                          {TIMES.map((time) => {
                            const slotStart = timeToMins(time);
                            const slotEnd = slotStart + 60;
                            const dayConfig = scheduleAvail[day.id as keyof typeof scheduleAvail];

                            const wStart = timeToMins(dayConfig.start);
                            const wEnd = timeToMins(dayConfig.end);
                            const lStart = timeToMins(lunch.start);
                            const lEnd = timeToMins(lunch.end);

                            const isWork = dayConfig.active && slotStart >= wStart && slotStart < wEnd;
                            const isLunch = slotStart < lEnd && slotEnd > lStart;

                            const isAvailable = isWork && !isLunch;

                            let classes = styles.timeSlot;
                            if (isAvailable) classes += ` ${styles.selectedSlot}`;

                            return <div key={time} className={classes}>{time}</div>;
                          })}
                        </div>
                      ))}
                    </div>

                    <div className={styles.scheduleFooter}>
                      <div className={styles.nextLessonsLabel}>
                        <Txt>Schedule status:</Txt> <span>Active</span>
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

                    {ALL_DAYS_LIST.filter((day) => scheduleAvail[day.id as keyof typeof scheduleAvail].active).map((day) => (
                      <div key={day.id} className={styles.availRow}>
                        <span className={styles.dayName}><Txt>{day.name}</Txt></span>
                        <div className={styles.timeInputs}>
                          <input
                            type="time"
                            value={scheduleAvail[day.id as keyof typeof scheduleAvail].start}
                            onChange={(e) => {
                              const val = e.target.value;
                              setScheduleAvail((prev) => ({
                                ...prev,
                                [day.id]: {
                                  ...prev[day.id as keyof typeof prev],
                                  start: val,
                                },
                              }));
                            }}
                            onBlur={() => handleSaveDetailAvailability()}
                          />
                          <span>—</span>
                          <input
                            type="time"
                            value={scheduleAvail[day.id as keyof typeof scheduleAvail].end}
                            onChange={(e) => {
                              const val = e.target.value;
                              setScheduleAvail((prev) => ({
                                ...prev,
                                [day.id]: {
                                  ...prev[day.id as keyof typeof prev],
                                  end: val,
                                },
                              }));
                            }}
                            onBlur={() => handleSaveDetailAvailability()}
                          />
                          <span
                            className={styles.deleteIcon}
                            onClick={() => handleRemoveDay(day.id)}
                          >
                            🗑️
                          </span>
                        </div>
                      </div>
                    ))}

                    <p className={styles.hintFooter}>
                      <InfoIcon /> <Txt>Other days will be marked unavailable by default</Txt>
                    </p>

                    <div className={`${styles.availRow} ${styles.lunchRow}`}>
                      <span className={styles.dayName}><Txt>Lunch break</Txt></span>
                      <div className={styles.timeInputs}>
                        <input
                          type="time"
                          value={lunch.start}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLunch((prev) => ({ ...prev, start: val }));
                          }}
                          onBlur={() => handleSaveDetailAvailability()}
                        />
                        <span>—</span>
                        <input
                          type="time"
                          value={lunch.end}
                          onChange={(e) => {
                            const val = e.target.value;
                            setLunch((prev) => ({ ...prev, end: val }));
                          }}
                          onBlur={() => handleSaveDetailAvailability()}
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
            )}
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            {modalStep === 1 ? (
              <form onSubmit={handleNextStep}>
                <div className={styles.modalHeader}>
                  <div className={styles.titleGroup}>
                    <UserPlusIcon />
                    <h3><Txt>{editingTeacherUuid ? "Edit teacher" : "Add a teacher"}</Txt></h3>
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

                <div className={styles.inputWrapper}>
                  <label><Txt>Avatar URL</Txt></label>
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={newTeacherAvatarUrl}
                    onChange={(e) => setNewTeacherAvatarUrl(e.target.value)}
                  />
                </div>

                <div className={styles.subjectRow}>
                  <div className={styles.inputWrapper}>
                    <label><Txt>Subject (required) *</Txt></label>
                    <select
                      required
                      value={newTeacherSubjectId}
                      onChange={handleSubjectSelectChange}
                    >
                      <option value="" disabled hidden>
                        {isLoadingSubjects ? "Loading subjects..." : "Select subject"}
                      </option>
                      {subjects.map((sub) => (
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
                      <span
                        className={styles.innerColorDot}
                        style={{ '--selected-color': newTeacherColor || DEFAULT_COLOR } as React.CSSProperties}
                      ></span>
                    </button>

                    {isColorPaletteOpen && (
                      <div className={styles.floatingPalette}>
                        {AVAILABLE_COLORS.map((c) => (
                          <button
                            type="button"
                            key={c}
                            className={`${styles.paletteDot} ${newTeacherColor === c ? styles.activePaletteDot : ""}`}
                            style={{ '--dot-color': c } as React.CSSProperties}
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
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => handleSaveTeacher(false)}
                  >
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
                    <h3><Txt>{editingTeacherUuid ? "Edit teacher" : "Add a teacher"}</Txt></h3>
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
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setCollabType(e.target.value as "Contract" | "Freelance")
                        }
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
                    <input
                      type="time"
                      value={modalWorkStart}
                      onChange={(e) => setModalWorkStart(e.target.value)}
                    />
                    <span>—</span>
                    <input
                      type="time"
                      value={modalWorkEnd}
                      onChange={(e) => setModalWorkEnd(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.availabilityRow}>
                  <span className={styles.availLabel}>
                    <ForkKnifeIcon /> <Txt>Lunch break</Txt>
                  </span>
                  <div className={styles.timeInputs}>
                    <input
                      type="time"
                      value={modalLunchStart}
                      onChange={(e) => setModalLunchStart(e.target.value)}
                    />
                    <span>—</span>
                    <input
                      type="time"
                      value={modalLunchEnd}
                      onChange={(e) => setModalLunchEnd(e.target.value)}
                    />
                  </div>
                </div>

                <p className={styles.infoLink}>
                  <InfoIcon /> <Txt>You can set individual per day later or</Txt>{" "}
                  <span className={styles.accentText}><Txt>add now</Txt></span>
                </p>

                <button
                  type="button"
                  className={`${styles.primaryBtn} ${styles.activeBtn}`}
                  onClick={() => handleSaveTeacher(true)}
                >
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

export default TeacherListPage;
