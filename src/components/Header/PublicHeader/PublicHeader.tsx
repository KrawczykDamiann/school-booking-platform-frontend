import styles from "./PublicHeader.module.scss";
import { Link, useLocation } from "react-router-dom";
import { DashboardIcon } from "../../icons/DashboardIcon";
import { StudentsIcon } from "../../icons/StudentsIcon";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

type HeaderProps = {
  onLoginClick?: () => void;
};

export const PublicHeader: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { pathname } = useLocation();
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <header className={styles.header}>
      <Link to={isAuthenticated ? "/admin" : "/"} className={styles.logo}>
        Less<span className={styles.accent}>io</span>
      </Link>
      <nav className={styles.nav}>
        <div
          className={`${styles.navLinkWrapper} ${pathname === "/teachers" ? styles.navLinkWrapperActive : ""}`}
        >
          <StudentsIcon size="16" />
          <Link to="/booking" className={styles.navLink}>
            Book a lesson
          </Link>
        </div>
        <div
          className={`${styles.navLinkWrapper} ${pathname === "/admin" ? styles.navLinkWrapperActive : ""}`}
        >
          <DashboardIcon size="16" />
          <Link to="/" className={styles.navLink}>
            Manage Booking
          </Link>
        </div>
      </nav>
      {/* Przycisk otwierający modal logowania */}
      <button className={styles.loginBtn} onClick={() => onLoginClick?.()}>
        Student login
      </button>
    </header>
  );
};
