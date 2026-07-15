import { Link } from "react-router-dom";
import styles from "./LandingPage.module.scss";

export default function LandingPage() {
  return (
    <div className={styles.landingContainer}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          Scheduling
          <br />
          with ease
        </h1>
        <p className={styles.subtitle}>
          Book, reschedule or cancel
          <br />
          lessons in just a few steps.
        </p>
        <div className={styles.actions}>
          {/* TODO: Integrate with the new Booking Landing Page routing */}
          <Link to="/booking" className={styles.primaryBtn}>Book a lesson</Link>
          <button className={styles.secondaryBtn}>Manage booking</button>
        </div>
      </div>
    </div>
  );
}
