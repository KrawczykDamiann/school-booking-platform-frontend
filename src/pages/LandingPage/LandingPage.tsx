import { Link } from "react-router-dom";
import styles from "./LandingPage.module.scss";
import { Button } from "../../components/ui/Button/Button";

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
          <Link to="/booking" className={styles.linkWrapper}>
            <Button variant="primary">Book a lesson</Button>
          </Link>

          <Link to="/" className={styles.linkWrapper}>
            <Button variant="secondary">Manage booking</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
