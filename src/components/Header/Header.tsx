import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./Header.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "../ui/Button/Button";
import { AvailabilityIcon } from "../icons/AvailabilityIcon";
import { StudentsIcon } from "../icons/StudentsIcon";
import { DashboardIcon } from "../icons/DashboardIcon";
import { UserDropdown } from "./UserDropdown/UserDropdown";

type HeaderProps = {
  onLoginClick?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { userType, logout, isAuthenticated } = useContext(AuthContext);

  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Read language state from Google cookie, fallback to i18next or 'pl'
  const [activeLang, setActiveLang] = useState<string>(() => {
    const match = document.cookie.match(/googtrans=\/[/a-zA-Z]+\/([^/]+)/);
    if (match) {
      const code = match[1];
      return code === "uk" ? "ua" : code; // Map Google's 'uk' back to local 'ua'
    }
    return i18n.resolvedLanguage || i18n.language || "pl";
  });

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

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("app_lang", langCode);
    setActiveLang(langCode);
    setIsDropdownOpen(false);

    // Map local 'ua' key to official 'uk' for Google Translate widget
    const googleLangCode = langCode === "ua" ? "uk" : langCode;
    const selectEl = document.querySelector(
      ".goog-te-combo",
    ) as HTMLSelectElement;
    if (selectEl) {
      selectEl.value = googleLangCode;
      selectEl.dispatchEvent(new Event("change"));
    }
  };

  const languages = [
    { code: "en", label: "EN" },
    { code: "pl", label: "PL" },
    { code: "ua", label: "UA" },
  ];
  return (
    <header className={`${styles.header} ${isAdmin ? styles.headerAdmin : ""}`}>
      <Link to="/" className={styles.logo}>
        Less<span className={styles.accent}>io</span>
      </Link>

      <nav className={styles.nav}>
        {isAdmin ? (
          <React.Fragment>
            <div
              className={`${styles.navItem} ${pathname === "/admin/dashboard" ? styles.navItemActive : ""}`}
            >
              <DashboardIcon size={16} />
              <Link to="/admin/dashboard" className={styles.navLink}>
                {t("header.dashboard")}
              </Link>
            </div>
            <div
              className={`${styles.navItem} ${pathname === "/admin/teachers" ? styles.navItemActive : ""}`}
            >
              <AvailabilityIcon size={16} />
              <Link to="/admin/teachers" className={styles.navLink}>
                {t("header.teachers")}
              </Link>
            </div>
            <div
              className={`${styles.navItem} ${pathname === "/admin/students" ? styles.navItemActive : ""}`}
            >
              <StudentsIcon size={16} />
              <Link to="/admin/students" className={styles.navLink}>
                {t("header.students")}
              </Link>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div
              className={`${styles.navItem} ${pathname === "/booking-calendar" ? styles.navItemActive : ""}`}
            >
              <StudentsIcon size={16} />
              <Link to="/booking-calendar" className={styles.navLink}>
                {t("header.bookLesson")}
              </Link>
            </div>
            <div
              className={`${styles.navItem} ${pathname === "/manage-booking" ? styles.navItemActive : ""}`}
            >
              <DashboardIcon size={16} />
              <Link to="/" className={styles.navLink}>
                {t("header.manageBooking")}
              </Link>
            </div>
          </React.Fragment>
        )}
      </nav>

      <div className={styles.rightSection}>
        {/* Custom Dropdown Language Switcher */}
        <div className={styles.translatorContainer} ref={dropdownRef}>
          <button
            className={styles.activeLangBtn}
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
          >
            {activeLang.toUpperCase()}
            <span className={styles.dropdownArrow}>▼</span>
          </button>

          {isLanguageDropdownOpen && (
            <ul className={styles.langDropdown}>
              {languages
                .filter((lang) => lang.code !== activeLang)
                .map((lang) => (
                  <li key={lang.code}>
                    <button
                      className={styles.dropdownLangBtn}
                      onClick={() => changeLanguage(lang.code)}
                    >
                      {lang.label}
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>

        {isAuthenticated ? (
          <div className={styles.rightSection}>
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
      </div>
    </header>
  );
};
