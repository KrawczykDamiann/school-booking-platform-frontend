import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  type ComponentType,
} from "react";
import styles from "./Header.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "../ui/Button/Button";
import { AvailabilityIcon } from "../icons/AvailabilityIcon";
import { StudentsIcon } from "../icons/StudentsIcon";
import { DashboardIcon } from "../icons/DashboardIcon";
import { UserDropdown } from "./UserDropdown/UserDropdown";
import { PageContainer } from "../PageContainer/PageContainer";
import { ModalContext } from "../../context/ModalContext";

type NavigationItem = {
  id: number;
  translationKey: string;
  to: string;
  icon: ComponentType<{
    size?: number;
    className?: string;
  }>;
};

const adminNavigation: NavigationItem[] = [
  {
    id: 1,
    translationKey: "header.dashboard",
    to: "/admin/dashboard",
    icon: DashboardIcon,
  },
  {
    id: 2,
    translationKey: "header.teachers",
    to: "/admin/teachers",
    icon: AvailabilityIcon,
  },
  {
    id: 3,
    translationKey: "header.students",
    to: "/admin/students",
    icon: StudentsIcon,
  },
];

const studentNavigation: NavigationItem[] = [
  {
    id: 1,
    translationKey: "header.bookLesson",
    to: "/booking-calendar",
    icon: StudentsIcon,
  },
  {
    id: 2,
    translationKey: "header.manageBooking",
    to: "/",
    icon: DashboardIcon,
  },
];

export const Header: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { userType, logout, isAuthenticated, userEmail } =
    useContext(AuthContext);

  const { openModal } = useContext(ModalContext);

  const studentEmail = userEmail ? userEmail : "student@example.com";

  const navigation = userType === "admin" ? adminNavigation : studentNavigation;
  const homePath = userType === "admin" ? "/admin" : "/";

  const { t } = useTranslation();

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

  // Close dropdown when user clicks outside of the element
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <PageContainer>
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
                    {t(item.translationKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.rightSection}>
          {isAuthenticated ? (
            <div className={styles.rightSection}>
              {userType === "admin" && <div className={styles.avatar}>VU</div>}
              <UserDropdown
                name={userType === "admin" ? "VesUp" : studentEmail}
                dropdownRef={dropdownRef}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                handleLogout={handleLogout}
              />
            </div>
          ) : (
            <div>
              <Button
                variant="secondary"
                onClick={() => openModal({ type: "login" })}
              >
                {t("header.studentLogin")}
              </Button>
            </div>
          )}
        </div>
      </header>
    </PageContainer>
  );
};