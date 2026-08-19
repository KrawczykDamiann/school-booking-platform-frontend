import { useTranslation } from "react-i18next";
import styles from "./LandingPage.module.scss";
import { Button } from "../../components/ui/Button/Button";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.landingContainer}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>{t("landingPage.title")}</h1>
        <p className={styles.subtitle}>{t("landingPage.subtitle")}</p>
        
        <div className={styles.actions}>
          {/* TODO: Integrate with the new Booking Landing Page routing */}
          <Link to="/booking-calendar" className={styles.linkWrapper}>
            <Button variant="primary">{t("landingPage.bookLesson")}</Button>
          </Link>
          
          <Link to="/" className={styles.linkWrapper}>
            <Button variant="secondary">
              {t("landingPage.manageBooking")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}