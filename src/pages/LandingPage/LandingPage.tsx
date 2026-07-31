import { useTranslation } from "react-i18next";
import styles from "./LandingPage.module.scss";
export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.landingContainer}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>{t("landingPage.title")}</h1>
        <p className={styles.subtitle}>{t("landingPage.subtitle")}</p>
        <div className={styles.actions}>
          {/* TODO: Integrate with the new Booking Landing Page routing */}
          <button className={styles.primaryBtn}>
            {t("landingPage.bookLesson")}
          </button>
          <button className={styles.secondaryBtn}>
            {t("landingPage.manageBooking")}
          </button>
        </div>
      </div>
    </div>
  );
}
