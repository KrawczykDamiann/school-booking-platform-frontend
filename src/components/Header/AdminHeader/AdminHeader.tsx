import styles from "./AdminHeader.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DropdownIcon } from "../../icons/DropdownIcon";
import { AvailabilityIcon } from "../../icons/AvailabilityIcon";
import { StudentsIcon } from "../../icons/StudentsIcon";
import { DashboardIcon } from "../../icons/DashboardIcon";
import { useContext, useEffect, useRef, useState } from "react";
import { tokenService } from "../../../services/tokenService";
import { AuthContext } from "../../../context/AuthContext";

export const AdminHeader: React.FC = () => {
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const { setIsAuthenticated } = useContext(AuthContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    tokenService.removeToken();
    setIsAuthenticated(false);
    navigate("/login/admin");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header className={styles.header}>
      <Link to="/admin" className={styles.logo}>
        Less<span className={styles.accent}>io</span>
      </Link>
      <nav className={styles.nav}>
        <>
          <div
            className={`${styles.navLinkWrapper} ${pathname === "/admin" ? styles.navLinkWrapperActive : ""}`}
          >
            <DashboardIcon size="16" />
            <Link to="/admin" className={styles.navLink}>
              Dashboard
            </Link>
          </div>
          <div
            className={`${styles.navLinkWrapper} ${pathname === "/teachers" ? styles.navLinkWrapperActive : ""}`}
          >
            <AvailabilityIcon size="16" />
            <Link to="/admin/teachers" className={styles.navLink}>
              Teachers
            </Link>
          </div>
          <div
            className={`${styles.navLinkWrapper} ${pathname === "/teachers" ? styles.navLinkWrapperActive : ""}`}
          >
            <StudentsIcon size="16" />
            <Link to="/admin/students" className={styles.navLink}>
              Students
            </Link>
          </div>
        </>
      </nav>
      <div className={styles.rightContainer}>
        <div className={styles.avatar}>VU</div>
        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <button
            className={styles.dropdownTrigger}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className={styles.dropdownText}>VesUp</span>
            <DropdownIcon
              size="12"
              className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.dropdownIconActive : ""}`}
            />
          </button>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <ul className={styles.dropdownMenuList}>
                <li className={styles.dropdownMenuItem}>Settings</li>
                <li className={styles.dropdownMenuItem}>Help</li>
                <li className={styles.dropdownMenuItem}>
                  <button
                    className={styles.dropdownMenuButton}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
