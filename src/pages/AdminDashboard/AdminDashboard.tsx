import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslatedText } from "../../hooks/useTranslatedText";
import { getTeachers } from "../../api/teachers";
import type { TeacherDto } from "../../api/teachers";
import styles from "./AdminDashboard.module.scss";
import { EllipseIcon } from "../../components/icons/EllipseIcon";
import { api } from "../../api/api";
import { Loader } from "../../components/ui/Loader/Loader";

// Dynamic translation helper
const Txt: React.FC<{ children: string }> = ({ children }) => {
  const translated = useTranslatedText(children);
  return <>{translated}</>;
};

// Formats date to match Figma design
const formatFigmaDate = (date: Date): string => {
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();

  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) suffix = "st";
  else if (day === 2 || day === 22) suffix = "nd";
  else if (day === 3 || day === 23) suffix = "rd";

  return `${month}, the ${day}${suffix}`;
};

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [teachers, setTeachers] = useState<TeacherDto[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState<boolean>(true);

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setIsLoadingTeachers(true);
        const res: any = await getTeachers();
        const list = Array.isArray(res)
          ? res
          : res?.content || res?.teachers || [];
        setTeachers(list);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      } finally {
        setIsLoadingTeachers(false);
      }
    };

    fetchTeacherData();
  }, []);

  // Close calendar popup on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevDay = () => {
    setSelectedDate(
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1),
    );
  };

  const handleNextDay = () => {
    setSelectedDate(
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1),
    );
  };

  const handleSelectDay = (day: number) => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day),
    );
    setIsCalendarOpen(false);
  };

  const handleTeacherClick = (
    teacherIdentifier: string | number | undefined,
  ) => {
    if (!teacherIdentifier) return;
    navigate(`/admin/teachers?teacherId=${teacherIdentifier}`);
  };

  // Month grid calculations
  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDayIndex = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1,
  ).getDay();
  const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  // Trigger test data loader
  const [isSetupLoading, setIsSetupLoading] = useState(false);
  const handleSetup = async () => {
    setIsSetupLoading(true);
    try {
      await api.post("/api/setup/examples/install?step=1");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSetupLoading(false);
      window.location.reload();
    }
  };

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.dashboardLayout}>
        {/* Left Column: Teacher Workload */}
        <main className={styles.workloadCard}>
          <div className={styles.cardHeader}>
            <h2>
              <Txt>Teacher workload</Txt>
            </h2>

            <div className={styles.datePickerWrapper} ref={calendarRef}>
              <div className={styles.datePicker}>
                <button
                  type="button"
                  className={styles.arrowBtn}
                  onClick={handlePrevDay}
                  aria-label="Previous day"
                >
                  &lsaquo;
                </button>

                <button
                  type="button"
                  className={styles.dateTriggerBtn}
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                >
                  <span className={styles.calIcon}>📅</span>
                  <span className={styles.dateText}>
                    <Txt>{formatFigmaDate(selectedDate)}</Txt>
                  </span>
                </button>

                <button
                  type="button"
                  className={styles.arrowBtn}
                  onClick={handleNextDay}
                  aria-label="Next day"
                >
                  &rsaquo;
                </button>
              </div>

              {isCalendarOpen && (
                <div className={styles.calendarBubble}>
                  <div className={styles.bubbleHeader}>
                    <h4>
                      {selectedDate.toLocaleString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h4>
                  </div>

                  <div className={styles.weekDaysRow}>
                    <span>M</span>
                    <span>T</span>
                    <span>W</span>
                    <span>T</span>
                    <span>F</span>
                    <span>S</span>
                    <span>S</span>
                  </div>

                  <div className={styles.daysGrid}>
                    {Array.from({ length: offset }).map((_, i) => (
                      <span key={`empty-${i}`} className={styles.emptyDay} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const isCurrent = dayNum === selectedDate.getDate();
                      return (
                        <button
                          key={dayNum}
                          type="button"
                          className={`${styles.dayBtn} ${isCurrent ? styles.activeDay : ""}`}
                          onClick={() => handleSelectDay(dayNum)}
                        >
                          {dayNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.workloadTable}>
              <thead>
                <tr>
                  <th className={styles.thName}>
                    <Txt>Teacher's name</Txt>
                  </th>
                  <th className={styles.thWorkload}>
                    <Txt>Today's workload</Txt>
                  </th>
                  <th className={styles.thCounter}>
                    <Txt>Counter</Txt>
                  </th>
                  <th className={styles.thView}>
                    <Txt>View</Txt>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoadingTeachers ? (
                  <tr>
                    <td
                      colSpan={4}
                      style={{ textAlign: "center", padding: "2rem" }}
                    >
                      <Txt>Loading teachers...</Txt>
                    </td>
                  </tr>
                ) : teachers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        textAlign: "center",
                        padding: "2rem",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        {isSetupLoading ? (
                          <Loader />
                        ) : (
                          <span>
                            <Txt>No teachers found</Txt>
                          </span>
                        )}

                        {!isSetupLoading && (
                          <button
                            style={{
                              width: "40px",
                              height: "40px",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              alignSelf: "flex-end",
                              marginTop: "auto",
                            }}
                            onClick={handleSetup}
                          >
                            <EllipseIcon />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  teachers.map((teacher: any, index: number) => {
                    const identifier =
                      teacher.uuid || teacher.id || `teacher-${index}`;

                    const emailString =
                      typeof teacher.email === "object" &&
                      teacher.email !== null
                        ? teacher.email.value || ""
                        : typeof teacher.email === "string"
                          ? teacher.email
                          : "";

                    const fullName =
                      typeof teacher.name === "string" &&
                      teacher.name.trim() !== ""
                        ? teacher.name
                        : `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() ||
                          emailString ||
                          "Teacher";

                    const teacherColor =
                      teacher.color ||
                      teacher.subjectColor ||
                      teacher.subject_color ||
                      (typeof teacher.subject === "object" && teacher.subject !== null ? teacher.subject.color : undefined) ||
                      "#3b82f6";

                    const avatarSrc = teacher.avatarUrl || teacher.avatar;

                    const initials =
                      (fullName || "T")
                        .split(" ")
                        .filter(Boolean)
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "T";

                    const totalSlots = 8;
                    const bookedSlots = 0;

                    return (
                      <tr
                        key={identifier}
                        className={styles.tableRow}
                        style={{ '--teacher-color': teacherColor } as React.CSSProperties}
                        onClick={() => handleTeacherClick(identifier)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleTeacherClick(identifier);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <td className={styles.nameCell}>
                          {avatarSrc ? (
                            <img
                              src={avatarSrc}
                              alt={fullName}
                              className={styles.avatarImg}
                            />
                          ) : (
                            <div className={styles.avatarFallback}>
                              {initials}
                            </div>
                          )}
                          <span className={styles.teacherNameText}>
                            {fullName}
                          </span>
                        </td>

                        <td className={styles.workloadCell}>
                          <div className={styles.dotsBar}>
                            {Array.from({ length: totalSlots }).map(
                              (_, slotIndex) => {
                                const isBooked = slotIndex < bookedSlots;
                                return (
                                  <span
                                    key={slotIndex}
                                    className={`${styles.workloadDot} ${
                                      isBooked ? styles.booked : styles.empty
                                    }`}
                                  />
                                );
                              },
                            )}
                          </div>
                        </td>

                        <td className={styles.counterCell}>
                          <div className={styles.counterBox}>
                            <span className={styles.counterValue}>
                              {bookedSlots} / {totalSlots}
                            </span>
                            <span className={styles.counterLabel}>
                              <Txt>slots</Txt>
                            </span>
                          </div>
                        </td>

                        <td className={styles.viewCell}>
                          <button
                            type="button"
                            className={styles.chevronBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTeacherClick(identifier);
                            }}
                            aria-label={`View ${fullName} details`}
                          >
                            &rsaquo;
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>

        {/* Right Column: Pending Requests */}
        <aside className={styles.pendingContainer}>
          <div className={styles.pendingHeader}>
            <h3>
              <Txt>Pending requests</Txt>
            </h3>
            <span className={styles.badgeCount}>0</span>
          </div>
          <p className={styles.pendingSub}>
            <Txt>
              Accept or decline booking requests that require admin attention.
            </Txt>
          </p>

          <div className={styles.requestsList}>
            <p className={styles.allDoneMessage}>
              <Txt>All requests handled!</Txt>
            </p>
          </div>

          <button
            type="button"
            className={styles.viewAllBtn}
            onClick={() => navigate("/admin/students")}
          >
            <Txt>View all</Txt> &rarr;
          </button>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;