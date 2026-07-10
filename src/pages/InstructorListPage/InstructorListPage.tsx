import { useState } from "react";
import styles from "./InstructorListPage.module.scss";

interface Teacher {
  id: number;
  name: string;
  subject: string;
  color: string;
  terms: string;
  date: string;
  status: string;
  email: string;
  nextLessons: string[];
  alert?: boolean;
}

const MOCK_TEACHERS: Teacher[] = [
  { id: 1, name: "Kataryna Novak", subject: "Chemistry", color: "#2f80ed", terms: "Contract", date: "Without term", status: "online", email: "knowakchemistry@onlineschool.com", nextLessons: ["30/06 at 14:00", "15:00", "17:00"] },
  { id: 2, name: "Andrii Shevchenko", subject: "Maths", color: "#00bfa5", terms: "Freelance", date: "Without term", status: "online", email: "ashevchenko@onlineschool.com", nextLessons: [] },
  { id: 3, name: "Sofia Koval", subject: "Physics", color: "#4caf50", terms: "Contract", date: "26/06/26", alert: true, status: "offline", email: "skoval@onlineschool.com", nextLessons: [] },
  { id: 4, name: "Natalia Ivanenko", subject: "Biology", color: "#9c27b0", terms: "Contract", date: "31/8/27", status: "online", email: "nivanenko@onlineschool.com", nextLessons: [] },
  { id: 5, name: "Olena Melnyk", subject: "Literature", color: "#ffb300", terms: "Contract", date: "31/12/27", status: "online", email: "omelnyk@onlineschool.com", nextLessons: [] },
];

export default function InstructorListPage() {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(MOCK_TEACHERS[0]);

  return (
    <div className={styles.dashboardContainer}>
      {/* Top navigation bar */}
      <header className={styles.topNav}>
        <div className={styles.logo}>
          Less<span className={styles.logoAccent}>io</span>
        </div>
        <nav className={styles.menuLinks}>
          <button className={styles.navLink}>Dashboard</button>
          <button className={`${styles.navLink} ${styles.activeLink}`}>Teachers</button>
          <button className={styles.navLink}>Students</button>
          <button className={styles.navLink}>More options ▾</button>
        </nav>
        <div className={styles.userProfile}>
          <div className={styles.avatarCircle}>VU</div>
          <span className={styles.username}>VesUp ▾</span>
        </div>
      </header>

      <main className={styles.mainContent}>
        
        {/* Left section: Teachers catalog for student */}
        <section className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h1 className={styles.pageTitle}>Teachers</h1>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.teachersTable}>
              <thead>
                <tr>
                  <th>Teacher's name</th>
                  <th>Subject</th>
                  <th>Work terms & Due date</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TEACHERS.map((teacher) => (
                  <tr 
                    key={teacher.id}
                    className={selectedTeacher?.id === teacher.id ? styles.selectedRow : ""}
                    onClick={() => setSelectedTeacher(teacher)}
                  >
                    <td className={styles.teacherNameCell}>
                      <div className={styles.tableAvatar}>
                        {teacher.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      {teacher.name}
                    </td>
                    <td>
                      <span className={styles.subjectBadge}>
                        <span className={styles.dot} style={{ backgroundColor: teacher.color }}></span>
                        {teacher.subject}
                      </span>
                    </td>
                    <td className={styles.termsCell}>
                      <span className={styles.termsIcon}>📋</span>
                      <span className={styles.termsText}>{teacher.terms}</span>
                      <span className={`${styles.dateText} ${teacher.alert ? styles.alertDate : ""}`}>
                        {teacher.date} {teacher.alert && "⚠️"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right section: Sidebar details panel */}
        {selectedTeacher && (
          <aside className={styles.detailsSidebar}>
            <button className={styles.closeSidebarBtn} onClick={() => setSelectedTeacher(null)}>✕</button>
            
            <div className={styles.sidebarHeader}>
              <h2>{selectedTeacher.name}</h2>
              <span className={styles.statusIndicator}></span>
            </div>
            
            <div className={styles.sidebarEmail}>
              ✉️ {selectedTeacher.email}
            </div>

            <div className={styles.nextLessonsSection}>
              <h3>Next lessons:</h3>
              {selectedTeacher.nextLessons.length > 0 ? (
                <p className={styles.lessonsList}>
                  {selectedTeacher.nextLessons.join(", ")}
                </p>
              ) : (
                <p className={styles.noLessons}>No lessons scheduled</p>
              )}
            </div>

            <button className={styles.teacherPageLink}>
              Teacher's page →
            </button>
          </aside>
        )}

      </main>
    </div>
  );
}
