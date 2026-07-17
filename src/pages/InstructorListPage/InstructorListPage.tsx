import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./InstructorListPage.module.scss";

interface Teacher {
  id: number;
  nameKey: string;
  subjectKey: string;
  color: string;
  termsKey: string;
  date: string;
  status: string;
  email: string;
  nextLessons: string[];
  alert?: boolean;
}

const MOCK_TEACHERS: Teacher[] = [
  {
    id: 1,
    nameKey: "teacherListPage.teachers.katarynaNovak",
    subjectKey: "subjects.chemistry",
    color: "#2f80ed",
    termsKey: "teacherListPage.modal.contract",
    date: "teacherListPage.modal.withoutTerm",
    status: "online",
    email: "knowakchemistry@onlineschool.com",
    nextLessons: ["30/06 at 14:00", "15:00", "17:00"],
  },
  {
    id: 2,
    nameKey: "teacherListPage.teachers.andriiShevchenko",
    subjectKey: "subjects.mathematics",
    color: "#00bfa5",
    termsKey: "teacherListPage.modal.freelance",
    date: "teacherListPage.modal.withoutTerm",
    status: "online",
    email: "ashevchenko@onlineschool.com",
    nextLessons: [],
  },
  {
    id: 3,
    nameKey: "teacherListPage.teachers.sofiaKoval",
    subjectKey: "subjects.physics",
    color: "#4caf50",
    termsKey: "teacherListPage.modal.contract",
    date: "26/06/26",
    alert: true,
    status: "offline",
    email: "skoval@onlineschool.com",
    nextLessons: [],
  },
  {
    id: 4,
    nameKey: "teacherListPage.teachers.nataliiaIvanenko",
    subjectKey: "subjects.biology",
    color: "#9c27b0",
    termsKey: "teacherListPage.modal.contract",
    date: "31/8/27",
    status: "online",
    email: "nivanenko@onlineschool.com",
    nextLessons: [],
  },
  {
    id: 5,
    nameKey: "teacherListPage.teachers.olenaMelnyk",
    subjectKey: "subjects.english",
    color: "#ffb300",
    termsKey: "teacherListPage.modal.contract",
    date: "31/12/27",
    status: "online",
    email: "omelnyk@onlineschool.com",
    nextLessons: [],
  },
];

export default function InstructorListPage() {
  const { t } = useTranslation();
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(1);

  const selectedTeacher =
    MOCK_TEACHERS.find((teacher) => teacher.id === selectedTeacherId) ?? null;

  return (
    <div className={styles.dashboardContainer}>
      <main className={styles.mainContent}>
        <section className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h1 className={styles.pageTitle}>
              {t("instructorListPage.title")}
            </h1>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.teachersTable}>
              <thead>
                <tr>
                  <th>{t("instructorListPage.table.teacherName")}</th>
                  <th>{t("instructorListPage.table.subject")}</th>
                  <th>{t("instructorListPage.table.workTerms")}</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TEACHERS.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className={
                      selectedTeacherId === teacher.id ? styles.selectedRow : ""
                    }
                    onClick={() => setSelectedTeacherId(teacher.id)}
                  >
                    <td className={styles.teacherNameCell}>
                      <div className={styles.tableAvatar}>
                        {t(teacher.nameKey)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      {t(teacher.nameKey)}
                    </td>
                    <td>
                      <span className={styles.subjectBadge}>
                        <span
                          className={styles.dot}
                          style={{ backgroundColor: teacher.color }}
                        ></span>
                        {t(teacher.subjectKey)}
                      </span>
                    </td>
                    <td className={styles.termsCell}>
                      <span className={styles.termsIcon}>📋</span>
                      <span className={styles.termsText}>
                        {t(teacher.termsKey)}
                      </span>
                      <span
                        className={`${styles.dateText} ${teacher.alert ? styles.alertDate : ""}`}
                      >
                        {teacher.date.startsWith("teacherListPage")
                          ? t(teacher.date)
                          : teacher.date}{" "}
                        {teacher.alert && "⚠️"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {selectedTeacher && (
          <aside className={styles.detailsSidebar}>
            <button
              className={styles.closeSidebarBtn}
              onClick={() => setSelectedTeacherId(null)}
            >
              ✕
            </button>

            <div className={styles.sidebarHeader}>
              <h2>{t(selectedTeacher.nameKey)}</h2>
              <span className={styles.statusIndicator}></span>
            </div>

            <div className={styles.sidebarEmail}>
              ✉️ {selectedTeacher.email}
            </div>

            <div className={styles.nextLessonsSection}>
              <h3>{t("instructorListPage.details.nextLessons")}</h3>
              {selectedTeacher.nextLessons.length > 0 ? (
                <p className={styles.lessonsList}>
                  {selectedTeacher.nextLessons.join(", ")}
                </p>
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
