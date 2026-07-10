import { useState } from "react";
import styles from "./LandingPage.module.scss";
import LoginModal from "../../components/LoginModal/LoginModal";

export default function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className={styles.landingContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>
          Less<span className={styles.accent}>io</span>
        </div>
        <nav className={styles.nav}>
          <button className={styles.navLink}>Book a lesson</button>
          <button className={styles.navLink}>Manage Booking</button>
          <button className={styles.navLink}>About us</button>
        </nav>
        <button 
          className={styles.loginBtn} 
          onClick={() => setIsLoginModalOpen(true)}
        >
          Student login
        </button>
      </header>

      <main className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Scheduling<br />with ease</h1>
          <p className={styles.subtitle}>
            Book, reschedule or cancel<br />lessons in just a few steps.
          </p>
          <div className={styles.actions}>
            {/* TODO: Integrate with the new Booking Landing Page routing */}
            <button className={styles.primaryBtn}>Book a lesson</button>
            <button className={styles.secondaryBtn}>Manage booking</button>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        Powered by... Protected by... Terms of service...
      </footer>

      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </div>
  );
}
