import { Link } from "react-router-dom";
import styles from "./BookingPage.module.scss";
import { BookingFeature } from "../../features/booking/BookingFeature";
import { ReturnIcon } from "../../components/icons/ReturnIcon";

export const BookingPage: React.FC = () => {
  return (
    <section className={styles.bookingPage}>
      <Link to="/" className={styles.returnLink}>
        <ReturnIcon size={24} />
        Select a lesson to book
      </Link>
      <BookingFeature />
    </section>
  );
};
