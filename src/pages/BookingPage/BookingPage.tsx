import { Link } from "react-router-dom";
import styles from "./BookingPage.module.scss";
import returnBlackIcon from "../../assets/return.svg";
import { BookingFeature } from "../../features/booking/BookingFeature";

export const BookingPage: React.FC = () => {
  return (
    <section className={styles.bookingPage}>
      <Link to="/" className={styles.returnLink}>
        <img
          src={returnBlackIcon}
          alt="Return icon"
          className={styles.returnIcon}
        />
        Select a lesson to book
      </Link>
      <BookingFeature />
    </section>
  );
};
