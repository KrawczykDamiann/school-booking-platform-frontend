import React, { useEffect, useMemo, useState } from "react";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { useTranslatedText } from "../../hooks/useTranslatedText";
import styles from "./TeacherListPage.module.scss";
import {
  createTeacher,
  fetchTeacherAvailability,
  fetchTeachers,
  updateTeacherAvailability,
} from "../../api/teachers";
import { fetchEmails } from "../../api/emails";
import { fetchLessons } from "../../api/lessons";
import type { Teacher as TeacherDto } from "../../types/Teacher";
import type { Availability, TimeRange } from "../../types/Availability";
import type { Lesson } from "../../types/Lesson";

/* Helper for Google Translator */
const Txt: React.FC<{ children: string }> = ({ children }) => {
  const translated = useTranslatedText(children);
  return <>{translated}</>;
};

/* Interfaces */
interface Teacher {
  uuid: string;
  name: string;
  email: string;
  color?: string;
  subjectName?: string;
}

type WeekdayId = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

interface DayAvailability {
  start: string;
  end: string;
  active: boolean;
}

interface LunchBreak {
  start: string;
  end: string;
}

const WEEKDAYS: { id: WeekdayId; name: string }[] = [
  { id: "monday", name: "Monday" },
  { id: "tuesday", name: "Tuesday" },
  { id: "wednesday", name: "Wednesday" },
  { id: "thursday", name: "Thursday" },
  { id: "friday", name: "Friday" },
];

const DEFAULT_LUNCH: LunchBreak = { start: "13:00", end: "14:00" };

const createEmptySchedule = (): Record<WeekdayId, DayAvailability> => ({
  monday: { start: "09:00", end: "17:00", active: false },
  tuesday: { start: "09:00", end: "17:00", active: false },
  wednesday: { start: "09:00", end: "17:00", active: false },
  thursday: { start: "09:00", end: "17:00", active: false },
  friday: { start: "09:00", end: "17:00", active: false },
});

const toHHMM = (value?: string | null) => (value ? value.slice(0, 5) : "09:00");

/* Converts the backend AvailabilityDto shape into the local editable schedule state */
function availabilityToSchedule(availability: Availability | null) {
  const schedule = createEmptySchedule();

  (Object.keys(schedule) as WeekdayId[]).forEach((day) => {
    const range = availability?.[day];
    if (range) {
      schedule[day] = {
        start: toHHMM(range.startTime),
        end: toHHMM(range.endTime),
        active: true,
      };
    }
  });

  const lunchRange = availability?.lunchBreak;
  const lunch: LunchBreak = lunchRange
    ? { start: toHHMM(lunchRange.startTime), end: toHHMM(lunchRange.endTime) }
    : { ...DEFAULT_LUNCH };

  return { schedule, lunch };
}

function scheduleToAvailabilityPayload(
  schedule: Record<WeekdayId, DayAvailability>,
  lunch: LunchBreak,
) {
  const toRange = (day: DayAvailability): TimeRange | null =>
    day.active ? { startTime: day.start, endTime: day.end } : null;

  return {
    monday: toRange(schedule.monday),
    tuesday: toRange(schedule.tuesday),
    wednesday: toRange(schedule.wednesday),
    thursday: toRange(schedule.thursday),
    friday: toRange(schedule.friday),
    lunchBreak: { startTime: lunch.start, endTime: lunch.end },
  };
}

/* SVG Icons */
const BriefcaseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="14"
    height="14"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);
const UserPlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <line x1="19" y1="8" x2="19" y2="14"></line>
    <line x1="22" y1="11" x2="16" y2="11"></line>
  </svg>
);
const EditIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
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
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="16"
    height="16"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);
const InfoIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="12"
    height="12"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);
const ForkKnifeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="14"
    height="14"
  >
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
    <path d="M7 2v20"></path>
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"></path>
  </svg>
);

/* Helper function to robustly compare times */
const timeToMins = (t: string) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const splitName = (fullName: string) => {
  const trimmed = fullName.trim();
  const spaceIndex = trimmed.indexOf(" ");

  return spaceIndex === -1
    ? { firstName: trimmed, lastName: "" }
    : {
        firstName: trimmed.slice(0, spaceIndex),
        lastName: trimmed.slice(spaceIndex + 1),
      };
};

const TIMES = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export const TeacherListPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [existingEmails, setExistingEmails] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedTeacherUuid, setSelectedTeacherUuid] = useState<string | null>(
    null,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [isSavingTeacher, setIsSavingTeacher] = useState(false);

  /* Teacher Form State */
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherEmail, setNewTeacherEmail] = useState("");
  const [newTeacherSubjectId, setNewTeacherSubjectId] = useState<number>(1);
  const [emailError, setEmailError] = useState("");
  const [newAvailability, setNewAvailability] = useState(createEmptySchedule());
  const [newLunch, setNewLunch] = useState<LunchBreak>({ ...DEFAULT_LUNCH });

  /* Interactive Schedule State (loaded from the teacher's real availability) */
  const [scheduleAvail, setScheduleAvail] = useState(createEmptySchedule());
  const [lunch, setLunch] = useState<LunchBreak>({ ...DEFAULT_LUNCH });
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadTeachers() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [teachersPage, emailsPage] = await Promise.all([
          fetchTeachers(0, 100),
          fetchEmails(0, 200).catch(() => ({ content: [] })),
        ]);

        const mapped: Teacher[] = teachersPage.content.map(
          (teacher: TeacherDto) => ({
            uuid: teacher.uuid,
            name: `${teacher.firstName} ${teacher.lastName}`.trim(),
            email: teacher.email,
            color: teacher.color,
            subjectName: teacher.subject?.name,
          }),
        );

        if (isMounted) {
          setTeachers(mapped);
          setExistingEmails(
            new Set(
              emailsPage.content.map((email: { value: string }) => email.value),
            ),
          );
        }
      } catch {
        if (isMounted) {
          setLoadError("Unable to load teachers. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTeachers();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadLessons() {
      try {
        const data = await fetchLessons();
        if (isMounted) {
          setLessons(data.content ?? []);
        }
      } catch {
        if (isMounted) {
          setLessons([]);
        }
      }
    }

    loadLessons();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadAvailability() {
      if (!selectedTeacherUuid) {
        if (isMounted) {
          setScheduleAvail(createEmptySchedule());
          setLunch({ ...DEFAULT_LUNCH });
        }
        return;
      }

      setIsAvailabilityLoading(true);

      try {
        const data = await fetchTeacherAvailability(selectedTeacherUuid);
        if (!isMounted) return;
        const { schedule, lunch: fetchedLunch } = availabilityToSchedule(data);
        setScheduleAvail(schedule);
        setLunch(fetchedLunch);
      } catch {
        if (isMounted) {
          setScheduleAvail(createEmptySchedule());
          setLunch({ ...DEFAULT_LUNCH });
        }
      } finally {
        if (isMounted) {
          setIsAvailabilityLoading(false);
        }
      }
    }

    loadAvailability();

    return () => {
      isMounted = false;
    };
  }, [selectedTeacherUuid]);

  const removeDay = (
    setter: React.Dispatch<
      React.SetStateAction<Record<WeekdayId, DayAvailability>>
    >,
    dayId: WeekdayId,
  ) => {
    setter((prev) => ({ ...prev, [dayId]: { ...prev[dayId], active: false } }));
  };

  const addNextDay = (
    schedule: Record<WeekdayId, DayAvailability>,
    setter: React.Dispatch<
      React.SetStateAction<Record<WeekdayId, DayAvailability>>
    >,
  ) => {
    const nextInactive = WEEKDAYS.map((day) => day.id).find(
      (id) => !schedule[id].active,
    );

    if (nextInactive) {
      setter((prev) => ({
        ...prev,
        [nextInactive]: { ...prev[nextInactive], active: true },
      }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewTeacherEmail(val);
    setEmailError(
      existingEmails.has(val) ? "This email already exists in your list" : "",
    );
  };

  const isStep1Valid =
    newTeacherName.trim() !== "" &&
    newTeacherEmail.trim() !== "" &&
    !emailError;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStep1Valid) {
      setModalStep(2);
    }
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setModalStep(1);
    setNewTeacherName("");
    setNewTeacherEmail("");
    setNewTeacherSubjectId(1);
    setEmailError("");
    setNewAvailability(createEmptySchedule());
    setNewLunch({ ...DEFAULT_LUNCH });
  };

  const handleSaveTeacher = async (withAvailability: boolean) => {
    if (!isStep1Valid || isSavingTeacher) return;

    setIsSavingTeacher(true);

    try {
      const { firstName, lastName } = splitName(newTeacherName);
      const created = await createTeacher({
        firstName,
        lastName,
        email: newTeacherEmail,
        zoneId: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        subjectId: newTeacherSubjectId,
      });

      if (withAvailability) {
        try {
          await updateTeacherAvailability(
            created.uuid,
            scheduleToAvailabilityPayload(newAvailability, newLunch),
          );
        } catch {
          // Teacher created; availability can still be set later
        }
      }

      setTeachers((prev) => [
        ...prev,
        {
          uuid: created.uuid,
          name: newTeacherName.trim(),
          email: newTeacherEmail,
          color: created.color,
          subjectName: created.subject?.name,
        },
      ]);
      setExistingEmails((prev) => new Set(prev).add(newTeacherEmail));
      resetForm();
    } catch (err) {
      setEmailError(
        err instanceof Error ? err.message : "Unable to save this teacher.",
      );
    } finally {
      setIsSavingTeacher(false);
    }
  };

  const handleSaveAvailability = async () => {
    if (!selectedTeacherUuid) return;

    try {
      await updateTeacherAvailability(
        selectedTeacherUuid,
        scheduleToAvailabilityPayload(scheduleAvail, lunch),
      );
    } catch {
      // Keep local edits on error
    }
  };

  const selectedTeacher =
    teachers.find((t) => t.uuid === selectedTeacherUuid) ?? teachers[0] ?? null;

  const getNextLessons = (teacherUuid: string) =>
    lessons
      .filter((lesson) => lesson.teacherUuid === teacherUuid)
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      )
      .map((lesson) => format(new Date(lesson.startTime), "dd/MM HH:mm"));

  const weekStart = useMemo(
    () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    [],
  );

  const MATRIX_DAYS = useMemo(
    () =>
      WEEKDAYS.map((day, index) => {
        const fullDate = addDays(weekStart, index);
        return {
          id: day.id,
          name: day.name,
          fullDate,
          dateLabel: format(fullDate, "d"),
        };
      }),
    [weekStart],
  );

  const weekRangeLabel = `${format(weekStart, "MMMM d")} - ${format(addDays(weekStart, 4), "MMMM d")}`;

  const isSlotBooked = (
    teacherUuid: string,
    dayId: WeekdayId,
    time: string,
  ) => {
    const day = MATRIX_DAYS.find((d) => d.id === dayId);
    if (!day) return false;

    return lessons.some((lesson) => {
      if (lesson.teacherUuid !== teacherUuid) return false;
      const lessonDate = new Date(lesson.startTime);
      return (
        isSameDay(lessonDate, day.fullDate) &&
        format(lessonDate, "HH:mm") === time &&
        lesson.enrolled > 0
      );
    });
  };

  return (
    <div className={styles.dashboardContainer}>
      <section className={styles.mainContent}>
        {isLoading && (
          <p>
            <Txt>Loading teachers...</Txt>
          </p>
        )}
        {loadError && <p className={styles.errorText}>{loadError}</p>}

        {!isLoading && !loadError && viewMode === "list" ? (
          <div className={styles.listSection}>
            <div className={styles.topHeader}>
              <h2>
                <Txt>Teachers</Txt>
              </h2>
              <button
                className={styles.addTeacherBtn}
                onClick={() => setIsModalOpen(true)}
              >
                <Txt>Add a teacher</Txt> <UserPlusIcon />
              </button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.teachersTable}>
                <thead>
                  <tr>
                    <th>
                      <Txt>Teacher's name</Txt>
                    </th>
                    <th className={styles.thAction}>
                      <Txt>Edit</Txt>
                    </th>
                    <th className={styles.thAction}>
                      <Txt>More</Txt>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => {
                    const isSelected = selectedTeacherUuid === teacher.uuid;
                    const teacherNextLessons = getNextLessons(teacher.uuid);

                    return (
                      <tr
                        key={teacher.uuid}
                        className={isSelected ? styles.activeRow : ""}
                        onClick={() =>
                          setSelectedTeacherUuid(
                            isSelected ? null : teacher.uuid,
                          )
                        }
                      >
                        <td className={styles.nameCell}>
                          <div
                            className={styles.avatarMock}
                            style={{
                              backgroundColor: teacher.color || "#4F46E5",
                            }}
                          >
                            {teacher.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          {teacher.name}
                        </td>
                        <td className={styles.actionCell}>
                          <button className={styles.actionIconButton}>
                            <EditIcon />
                          </button>
                        </td>
                        <td className={styles.actionCell}>
                          <button className={styles.actionIconButton}>
                            <MoreIcon />
                          </button>

                          {isSelected && (
                            <aside
                              className={styles.popoverCard}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className={styles.closeDetails}
                                onClick={() => setSelectedTeacherUuid(null)}
                              >
                                &times;
                              </button>

                              <div className={styles.popoverHeader}>
                                <h3>
                                  {teacher.name}{" "}
                                  <span className={styles.statusDot}></span>
                                </h3>
                                <span className={styles.popoverEmail}>
                                  <MailIcon /> {teacher.email}
                                </span>
                              </div>

                              <div className={styles.nextLessonsBox}>
                                <p className={styles.label}>
                                  <Txt>Next lessons:</Txt>
                                </p>
                                <p className={styles.lessons}>
                                  {teacherNextLessons.length > 0
                                    ? teacherNextLessons.join(" | ")
                                    : "No lessons scheduled"}
                                </p>
                              </div>

                              <div className={styles.popoverFooter}>
                                <button
                                  className={styles.teacherPageBtn}
                                  onClick={() => setViewMode("detail")}
                                >
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
        ) : null}

        {!isLoading &&
          !loadError &&
          viewMode === "detail" &&
          selectedTeacher && (
            <div>
              <button
                className={styles.backBtn}
                onClick={() => setViewMode("list")}
              >
                &larr; <Txt>Back to Teachers List</Txt>
              </button>

              <div className={styles.detailGrid}>
                <aside className={styles.avatarsSidebar}>
                  <h3>
                    <Txt>Teachers</Txt>
                  </h3>
                  {teachers.map((tItem) => {
                    const isActive = tItem.uuid === selectedTeacher.uuid;

                    return (
                      <div
                        key={tItem.uuid}
                        className={`${styles.teacherNavItem} ${isActive ? styles.activeNavItem : ""}`}
                        onClick={() => setSelectedTeacherUuid(tItem.uuid)}
                      >
                        <div
                          className={styles.avatarMock}
                          style={{
                            width: 32,
                            height: 32,
                            fontSize: "0.75rem",
                            backgroundColor: tItem.color || "#4F46E5",
                          }}
                        >
                          {tItem.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className={styles.navInfo}>
                          <span className={styles.navName}>{tItem.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </aside>

                <main className={styles.scheduleColumn}>
                  <div className={styles.teacherHeaderCard}>
                    <div className={styles.headerLeft}>
                      <div
                        className={styles.avatarMock}
                        style={{
                          width: 56,
                          height: 56,
                          fontSize: "1.2rem",
                          backgroundColor:
                            selectedTeacher.color || "#4F46E5",
                        }}
                      >
                        {selectedTeacher.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className={styles.headerDetails}>
                        <h3>{selectedTeacher.name}</h3>
                        <p>{selectedTeacher.email}</p>
                      </div>
                    </div>
                    <div className={styles.headerRight}>
                      <button className={styles.actionIconButton}>
                        <EditIcon />
                      </button>
                    </div>
                  </div>

                  <div className={styles.scheduleGridCard}>
                    <div className={styles.scheduleHeader}>
                      <h3>
                        <Txt>Schedule</Txt>
                      </h3>
                      <span>📅 {weekRangeLabel}</span>
                    </div>

                    {isAvailabilityLoading ? (
                      <p>
                        <Txt>Loading availability...</Txt>
                      </p>
                    ) : (
                      <div className={styles.calendarMatrix}>
                        {MATRIX_DAYS.map((day) => (
                          <div key={day.id} className={styles.dayColumn}>
                            <div
                              className={`${styles.dayHeader} ${isSameDay(day.fullDate, new Date()) ? styles.activeDay : ""}`}
                            >
                              {day.dateLabel}{" "}
                              <span className={styles.dayNum}>
                                <Txt>{day.name}</Txt>
                              </span>
                            </div>
                            {TIMES.map((time) => {
                              const tMins = timeToMins(time);
                              const dayConfig = scheduleAvail[day.id];

                              const wStart = timeToMins(dayConfig.start);
                              const wEnd = timeToMins(dayConfig.end);
                              const lStart = timeToMins(lunch.start);
                              const lEnd = timeToMins(lunch.end);

                              const isWork =
                                dayConfig.active &&
                                tMins >= wStart &&
                                tMins < wEnd;
                              const isLunch = tMins >= lStart && tMins < lEnd;

                              const isSelected = isWork && !isLunch;
                              const isBooked = isSlotBooked(
                                selectedTeacher.uuid,
                                day.id,
                                time,
                              );

                              let classes = styles.timeSlot;
                              if (isSelected && isBooked)
                                classes += ` ${styles.bookedSlot}`;
                              else if (isSelected)
                                classes += ` ${styles.selectedSlot}`;
                              else if (isBooked)
                                classes += ` ${styles.bookedSlot}`;

                              return (
                                <div key={time} className={classes}>
                                  {time}
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={styles.scheduleFooter}>
                      <div className={styles.nextLessonsLabel}>
                        <Txt>Next lessons:</Txt>{" "}
                        <span>
                          {getNextLessons(selectedTeacher.uuid).length > 0
                            ? getNextLessons(selectedTeacher.uuid).join(" ")
                            : "No upcoming lessons"}
                        </span>
                      </div>
                      <button
                        className={styles.sendScheduleBtn}
                        onClick={handleSaveAvailability}
                      >
                        <Txt>Send schedule</Txt>
                      </button>
                    </div>
                  </div>
                </main>

                <aside className={styles.availabilityColumn}>
                  <div className={styles.availabilityCard}>
                    <div className={styles.cardHeader}>
                      <h3>
                        <Txt>Availability</Txt>
                      </h3>
                      <button
                        className={styles.addDayBtn}
                        onClick={() =>
                          addNextDay(scheduleAvail, setScheduleAvail)
                        }
                      >
                        <Txt>+ Add day</Txt>
                      </button>
                    </div>
                    <p className={styles.subtext}>
                      <Txt>Set weekly availability hours for this teacher</Txt>
                    </p>

                    {WEEKDAYS.filter((day) => scheduleAvail[day.id].active).map(
                      (day) => (
                        <div key={day.id} className={styles.availRow}>
                          <span className={styles.dayName}>
                            <Txt>{day.name}</Txt>
                          </span>
                          <div className={styles.timeInputs}>
                            <input
                              type="time"
                              step="900"
                              value={scheduleAvail[day.id].start}
                              onChange={(e) =>
                                setScheduleAvail({
                                  ...scheduleAvail,
                                  [day.id]: {
                                    ...scheduleAvail[day.id],
                                    start: e.target.value,
                                  },
                                })
                              }
                            />
                            <span>—</span>
                            <input
                              type="time"
                              step="900"
                              value={scheduleAvail[day.id].end}
                              onChange={(e) =>
                                setScheduleAvail({
                                  ...scheduleAvail,
                                  [day.id]: {
                                    ...scheduleAvail[day.id],
                                    end: e.target.value,
                                  },
                                })
                              }
                            />
                            <span
                              className={styles.deleteIcon}
                              onClick={() =>
                                removeDay(setScheduleAvail, day.id)
                              }
                            >
                              🗑️
                            </span>
                          </div>
                        </div>
                      ),
                    )}

                    <p className={styles.hintFooter}>
                      <InfoIcon />{" "}
                      <Txt>
                        Other days will be marked unavailable by default
                      </Txt>
                    </p>

                    <div
                      className={styles.availRow}
                      style={{ marginTop: "1.25rem" }}
                    >
                      <span className={styles.dayName}>
                        <Txt>Lunch break</Txt>
                      </span>
                      <div className={styles.timeInputs}>
                        <input
                          type="time"
                          step="900"
                          value={lunch.start}
                          onChange={(e) =>
                            setLunch({ ...lunch, start: e.target.value })
                          }
                        />
                        <span>—</span>
                        <input
                          type="time"
                          step="900"
                          value={lunch.end}
                          onChange={(e) =>
                            setLunch({ ...lunch, end: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.vacationsCard}>
                    <div className={styles.vacationHeader}>
                      <h3>
                        <Txt>Vacations</Txt>
                      </h3>
                      <span className={styles.badge}>
                        <Txt>Coming in the next update</Txt>
                      </span>
                    </div>
                    <p>
                      <Txt>Mark dates when the teacher is unavailable</Txt>
                    </p>
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
                    <h3>
                      <Txt>Add a teacher</Txt>
                    </h3>
                  </div>
                  <div className={styles.headerRight}>
                    <span className={styles.stepIndicator}>
                      <Txt>Step 1 of 2</Txt>
                    </span>
                    <button
                      type="button"
                      className={styles.closeModal}
                      onClick={resetForm}
                    >
                      &times;
                    </button>
                  </div>
                </div>

                <p className={styles.subtitle}>
                  <Txt>Fill-in basic information</Txt>
                </p>

                <div className={styles.inputWrapper}>
                  <label>
                    <Txt>Name *</Txt>
                  </label>
                  <input
                    type="text"
                    placeholder="Olga Petrivna"
                    required
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                  />
                </div>

                <div
                  className={`${styles.inputWrapper} ${emailError ? styles.errorState : ""}`}
                >
                  <label>
                    <Txt>Email *</Txt>
                  </label>
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
                  <button
                    type="submit"
                    disabled={!isStep1Valid}
                    className={styles.primaryBtn}
                  >
                    <Txt>Continue to availability</Txt>
                  </button>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    disabled={!isStep1Valid || isSavingTeacher}
                    onClick={() => handleSaveTeacher(false)}
                  >
                    <Txt>Save and set later</Txt>
                  </button>
                </div>

                <p className={styles.modalFooterHint}>
                  <InfoIcon />{" "}
                  <Txt>
                    A teacher will be unavailable for booking, until you set
                    their availability
                  </Txt>
                </p>
              </form>
            ) : (
              <div>
                <div className={styles.modalHeader}>
                  <div className={styles.titleGroup}>
                    <button
                      type="button"
                      className={styles.backStepBtn}
                      onClick={() => setModalStep(1)}
                    >
                      &larr;
                    </button>
                    <h3>
                      <Txt>Add a teacher</Txt>
                    </h3>
                  </div>
                  <div className={styles.headerRight}>
                    <span className={styles.stepIndicator}>
                      <Txt>Step 2 of 2</Txt>
                    </span>
                    <button
                      type="button"
                      className={styles.closeModal}
                      onClick={resetForm}
                    >
                      &times;
                    </button>
                  </div>
                </div>
                <p className={styles.subtitle}>
                  <Txt>Set teacher's availability</Txt>
                </p>

                <h4 className={styles.sectionDivider}>
                  <Txt>Regular availability</Txt>
                </h4>
                {WEEKDAYS.map((day) => (
                  <div key={day.id} className={styles.availRow}>
                    <span className={styles.dayName}>
                      <BriefcaseIcon /> <Txt>{day.name}</Txt>
                    </span>
                    <div className={styles.timeInputs}>
                      <input
                        type="checkbox"
                        checked={newAvailability[day.id].active}
                        onChange={(e) =>
                          setNewAvailability({
                            ...newAvailability,
                            [day.id]: {
                              ...newAvailability[day.id],
                              active: e.target.checked,
                            },
                          })
                        }
                      />
                      <input
                        type="time"
                        step="900"
                        disabled={!newAvailability[day.id].active}
                        value={newAvailability[day.id].start}
                        onChange={(e) =>
                          setNewAvailability({
                            ...newAvailability,
                            [day.id]: {
                              ...newAvailability[day.id],
                              start: e.target.value,
                            },
                          })
                        }
                      />
                      <span>—</span>
                      <input
                        type="time"
                        step="900"
                        disabled={!newAvailability[day.id].active}
                        value={newAvailability[day.id].end}
                        onChange={(e) =>
                          setNewAvailability({
                            ...newAvailability,
                            [day.id]: {
                              ...newAvailability[day.id],
                              end: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                ))}

                <div className={styles.availabilityRow}>
                  <span className={styles.availLabel}>
                    <ForkKnifeIcon /> <Txt>Lunch break</Txt>
                  </span>
                  <div className={styles.timeInputs}>
                    <input
                      type="time"
                      step="900"
                      value={newLunch.start}
                      onChange={(e) =>
                        setNewLunch({ ...newLunch, start: e.target.value })
                      }
                    />
                    <span>—</span>
                    <input
                      type="time"
                      step="900"
                      value={newLunch.end}
                      onChange={(e) =>
                        setNewLunch({ ...newLunch, end: e.target.value })
                      }
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isSavingTeacher}
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