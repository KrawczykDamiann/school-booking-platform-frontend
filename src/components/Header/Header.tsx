import styles from "./Header.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AvailabilityIcon } from "../icons/AvailabilityIcon";
import { StudentsIcon } from "../icons/StudentsIcon";
import { DashboardIcon } from "../icons/DashboardIcon";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { AuthContext } from "../../context/AuthContext";
import { UserDropdown } from "./UserDropdown/UserDropdown";
import { Button } from "../ui/Button/Button";

type NavigationItem = {
  id: number;
  label: string;
  to: string;
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
};
const adminNavigation: NavigationItem[] = [
  { id: 1, label: "Dashboard", to: "/admin", icon: DashboardIcon },
  { id: 2, label: "Teachers", to: "/admin/teachers", icon: AvailabilityIcon },
  { id: 3, label: "Students", to: "/admin/students", icon: StudentsIcon },
];

const studentNavigation: NavigationItem[] = [
  { id: 1, label: "Book a lesson", to: "/booking", icon: StudentsIcon },
  { id: 2, label: "Manage Booking", to: "/", icon: DashboardIcon },
];

type HeaderProps = {
  onLoginClick?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const { isAuthenticated, userType, logout } = useContext(AuthContext);

  const navigation = userType === "admin" ? adminNavigation : studentNavigation;

  const homePath = userType === "admin" ? "/admin" : "/";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();

    if (userType === "admin") {
      navigate("/login/admin");
    } else {
        navigate("/login");
    }
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
      <Link to={homePath} className={styles.logo}>
        Less<span className={styles.accent}>io</span>
      </Link>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <li
                key={item.id}
                className={`${styles.navItem} ${pathname === item.to ? styles.navItemActive : ""}`}
              >
                <Icon size={16} />
                <Link to={item.to} className={styles.navLink}>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {isAuthenticated ? (
        <div className={styles.rightContainer}>
          {userType === "admin" && <div className={styles.avatar}>VU</div>}
          <UserDropdown
            name={userType === "admin" ? "VesUp" : "student@example.com"}
            dropdownRef={dropdownRef}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            handleLogout={handleLogout}
          />
        </div>
      ) : (
        <div>
          <Button variant="secondary" onClick={() => onLoginClick?.()}>
            Student login
          </Button>
        </div>
      )}
    </header>
  );
};
