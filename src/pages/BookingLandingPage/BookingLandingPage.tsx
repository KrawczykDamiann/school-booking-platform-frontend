import React, { useState } from 'react';
import styles from './BookingLandingPage.module.scss';

interface TeacherCard {
  id: number;
  name: string;
  subject: string;
  rating: number;
  pricePerHour: number;
  avatarPlaceholder: string;
}

const MOCK_TEACHERS: TeacherCard[] = [
  { id: 1, name: 'Kataryna Novak', subject: 'Chemistry', rating: 4.9, pricePerHour: 60, avatarPlaceholder: 'KN' },
  { id: 2, name: 'Andrii Shevchenko', subject: 'Maths', rating: 5.0, pricePerHour: 75, avatarPlaceholder: 'AS' },
  { id: 3, name: 'Sofia Koval', subject: 'Physics', rating: 4.8, pricePerHour: 65, avatarPlaceholder: 'SK' },
  { id: 4, name: 'Nataliia Ivanenko', subject: 'Biology', rating: 4.7, pricePerHour: 55, avatarPlaceholder: 'NI' },
];

export const BookingLandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Ready for backend API filtering integration
  };

  const filteredTeachers = MOCK_TEACHERS.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || t.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className={styles.landingContainer}>
      {/* Public Header Navigation */}
      <header className={styles.navbar}>
        <div className={styles.logo}>Less<span>io</span></div>
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
          <p>Book 1-on-1 online lessons with certified instructors and manage your schedule effortlessly.</p>
          
          {/* Search Bar Wrapper */}
          <form onSubmit={handleSearch} className={styles.searchBar}>
            <input 
              type="text" 
              placeholder="Search by teacher's name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
              <option value="All">All Subjects</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Maths">Maths</option>
              <option value="Physics">Physics</option>
              <option value="Biology">Biology</option>
            </select>
            <button type="submit">Find Tutors</button>
          </form>
        </div>
      </section>

      {/* Main Content: Teachers Grid */}
      <main id="teachers" className={styles.mainContent}>
        <div className={styles.sectionHeader}>
          <h2>Available Instructors</h2>
          <p>Showing {filteredTeachers.length} top-rated tutors</p>
        </div>

        <div className={styles.teachersGrid}>
          {filteredTeachers.map((teacher) => (
            <div key={teacher.id} className={styles.teacherCard}>
              <div className={styles.cardHeader}>
                <div className={styles.avatarCircle}>{teacher.avatarPlaceholder}</div>
                <div>
                  <h3>{teacher.name}</h3>
                  <span className={styles.subjectTag}>{teacher.subject}</span>
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.infoRow}>
                  <span>Rating:</span>
                  <span className={styles.rating}>⭐ {teacher.rating}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Price:</span>
                  <span className={styles.price}>${teacher.pricePerHour}/h</span>
                </div>
              </div>
              <div className={styles.cardActions}>
                <button className={styles.bookBtn} onClick={() => alert(`Redirecting to book ${teacher.name}`)}>
                  Book a Lesson
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
