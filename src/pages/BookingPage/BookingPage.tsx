import { Link } from "react-router-dom";
import styles from "./BookingPage.module.scss";
import { BookingFeature } from "../../features/booking/BookingFeature";
import { ReturnIcon } from "../../components/icons/ReturnIcon";
import { useTranslation } from "react-i18next";

export const BookingPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.bookingPage}>
      <div className={styles.bookingPageHeader}>
        <Link to="/" className={styles.returnLink}>
          <ReturnIcon size={24} />
        </Link>
        <h2 className={styles.title}>{t("bookingPage.title")}</h2>
      </div>
      <BookingFeature />
    </section>
  );
};