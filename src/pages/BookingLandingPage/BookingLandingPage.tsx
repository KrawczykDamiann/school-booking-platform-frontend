import React, { useEffect, useState } from "react";
import styles from "./BookingLandingPage.module.scss";
import { fetchPublicTeachers } from "../../api/teachers";
import type { PublicTeacher } from "../../types/Teacher";

interface TeacherCard {
  uuid: string;
  name: string;
  avatarPlaceholder: string;
}

const toTeacherCard = (teacher: PublicTeacher): TeacherCard => ({
  uuid: teacher.uuid,
  name: `${teacher.firstName} ${teacher.lastName}`.trim(),
  avatarPlaceholder:
    `${teacher.firstName.charAt(0)}${teacher.lastName.charAt(0)}`.toUpperCase(),
});

export const BookingLandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState<TeacherCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTeachers() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchPublicTeachers(0, 100);

        if (isMounted) {
          setTeachers(data.content.map(toTeacherCard));
        }
      } catch {
        if (isMounted) {
          setError(
            "Unable to load instructors right now. Please try again later.",
          );
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={styles.landingContainer}>
      {/* Public Header Navigation */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          Less<span>io</span>
        </div>
        <nav className={styles.navLinks}>
          <a href="#how-it-works">How it works</a>
          <a href="#teachers">Find Teachers</a>
          <button className={styles.loginBtn}>Sign In</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Find the perfect tutor for your needs</h1>
          <p>
            Book 1-on-1 online lessons with certified instructors and manage
            your schedule effortlessly.
          </p>

          {/* Search Bar Wrapper */}
          <form onSubmit={handleSearch} className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search by teacher's name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Find Tutors</button>
          </form>
        </div>
      </section>

      {/* Main Content: Teachers Grid */}
      <main id="teachers" className={styles.mainContent}>
        <div className={styles.sectionHeader}>
          <h2>Available Instructors</h2>
          {!isLoading && !error && (
            <p>Showing {filteredTeachers.length} available tutors</p>
          )}
        </div>

        {isLoading && <p>Loading instructors...</p>}
        {error && <p>{error}</p>}

        {!isLoading && !error && (
          <div className={styles.teachersGrid}>
            {filteredTeachers.map((teacher) => (
              <div key={teacher.uuid} className={styles.teacherCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.avatarCircle}>
                    {teacher.avatarPlaceholder}
                  </div>
                  <div>
                    <h3>{teacher.name}</h3>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button
                    className={styles.bookBtn}
                    onClick={() => alert(`Redirecting to book ${teacher.name}`)}
                  >
                    Book a Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
