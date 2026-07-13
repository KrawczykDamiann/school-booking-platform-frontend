import styles from "./Header.module.scss";
import { Link, useLocation } from "react-router-dom";
import studentIcon from "../../assets/student.svg";
import dashboardIcon from "../../assets/dashboard.svg";
import moreIcon from "../../assets/more.svg";

type HeaderProps = {
  onLoginClick?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { pathname } = useLocation();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        Less<span className={styles.accent}>io</span>
      </Link>
      <nav className={styles.nav}>
        <div className={styles.navLinkWrapper}>
          <img
            src={studentIcon}
            alt="Student icon"
            className={styles.navLinkIcon}
          />
          <Link
            to="/booking-calendar"
            className={`${styles.navLink} ${pathname === "/booking-calendar" ? styles.navLinkActive : ""}`}
          >
            Book a lesson
          </Link>
        </div>
        <div className={styles.navLinkWrapper}>
          <img
            src={dashboardIcon}
            alt="Dashboard icon"
            className={styles.navLinkIcon}
          />
          <Link to="#" className={styles.navLink}>
            Manage Booking
          </Link>
        </div>
        <div className={styles.navLinkWrapper}>
          <img src={moreIcon} alt="More icon" className={styles.navLinkIcon} />
          <Link to="#" className={styles.navLink}>
            About us
          </Link>
        </div>
      </nav>
      {/* Przycisk otwierający modal logowania */}
      <button className={styles.loginBtn} onClick={() => onLoginClick()}>
        Student login
      </button>
    </header>
  );
};
