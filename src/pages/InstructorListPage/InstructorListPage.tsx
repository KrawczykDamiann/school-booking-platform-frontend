import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import styles from "./InstructorListPage.module.scss";
import { fetchPublicTeachers } from "../../api/teachers";
import { fetchLessons } from "../../api/lessons";
import type { PublicTeacher } from "../../types/Teacher";
import type { Lesson } from "../../types/Lesson";

interface Teacher {
  uuid: string;
  name: string;
}

export default function InstructorListPage() {
  const { t } = useTranslation();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedTeacherUuid, setSelectedTeacherUuid] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTeachers() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchPublicTeachers(0, 100);
        const mapped: Teacher[] = data.content.map(
          (teacher: PublicTeacher) => ({
            uuid: teacher.uuid,
            name: `${teacher.firstName} ${teacher.lastName}`.trim(),
          }),
        );

        if (isMounted) {
          setTeachers(mapped);
          setSelectedTeacherUuid(mapped[0]?.uuid ?? null);
        }
      } catch {
        if (isMounted) {
          setError("Unable to load teachers. Please try again later.");
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

    // Lesson booking isn't live yet on every environment, degrade gracefully.
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

  const selectedTeacher =
    teachers.find((teacher) => teacher.uuid === selectedTeacherUuid) ?? null;

  const nextLessons = selectedTeacher
    ? lessons
        .filter((lesson) => lesson.teacherUuid === selectedTeacher.uuid)
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        )
        .map((lesson) => format(new Date(lesson.startTime), "dd/MM HH:mm"))
    : [];

  return (
    <div className={styles.dashboardContainer}>
      <main className={styles.mainContent}>
        <section className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h1 className={styles.pageTitle}>
              {t("instructorListPage.title")}
            </h1>
          </div>

          {isLoading && <p>Loading teachers...</p>}
          {error && <p>{error}</p>}

          {!isLoading && !error && (
            <div className={styles.tableWrapper}>
              <table className={styles.teachersTable}>
                <thead>
                  <tr>
                    <th>{t("instructorListPage.table.teacherName")}</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr
                      key={teacher.uuid}
                      className={
                        selectedTeacherUuid === teacher.uuid
                          ? styles.selectedRow
                          : ""
                      }
                      onClick={() => setSelectedTeacherUuid(teacher.uuid)}
                    >
                      <td className={styles.teacherNameCell}>
                        <div className={styles.tableAvatar}>
                          {teacher.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        {teacher.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selectedTeacher && (
          <aside className={styles.detailsSidebar}>
            <button
              className={styles.closeSidebarBtn}
              onClick={() => setSelectedTeacherUuid(null)}
            >
              ✕
            </button>

            <div className={styles.sidebarHeader}>
              <h2>{selectedTeacher.name}</h2>
              <span className={styles.statusIndicator}></span>
            </div>

            <div className={styles.nextLessonsSection}>
              <h3>{t("instructorListPage.details.nextLessons")}</h3>
              {nextLessons.length > 0 ? (
                <p className={styles.lessonsList}>{nextLessons.join(", ")}</p>
              ) : (
                <p className={styles.noLessons}>
                  {t("instructorListPage.details.noLessons")}
                </p>
              )}
            </div>

            <button className={styles.teacherPageLink}>
              {t("instructorListPage.details.teacherPage")}
            </button>
          </aside>
        )}
      </main>
    </div>
  );
}
