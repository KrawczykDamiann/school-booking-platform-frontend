import React, { useState, useEffect, useRef } from "react";
import styles from "./Header.module.scss";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import studentIcon from "../../assets/student.svg";
import dashboardIcon from "../../assets/dashboard.svg";
import moreIcon from "../../assets/more.svg";

type HeaderProps = {
  onLoginClick?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const { t, i18n } = useTranslation();

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
            <div className={styles.navLinkWrapper}>
              <img
                src={dashboardIcon}
                alt="Dashboard icon"
                className={styles.navLinkIcon}
              />
              <Link
                to="/admin/dashboard"
                className={`${styles.navLink} ${pathname === "/admin/dashboard" ? styles.navLinkActive : ""}`}
              >
                {t("header.dashboard")}
              </Link>
            </div>
            <div className={styles.navLinkWrapper}>
              <img
                src={studentIcon}
                alt="Teachers icon"
                className={styles.navLinkIcon}
              />
              <Link
                to="/admin/teachers"
                className={`${styles.navLink} ${pathname === "/admin/teachers" ? styles.navLinkActive : ""}`}
              >
                {t("header.teachers")}
              </Link>
            </div>
            <div className={styles.navLinkWrapper}>
              <img
                src={studentIcon}
                alt="Students icon"
                className={styles.navLinkIcon}
              />
              <Link
                to="/admin/students"
                className={`${styles.navLink} ${pathname === "/admin/students" ? styles.navLinkActive : ""}`}
              >
                {t("header.students")}
              </Link>
            </div>
            <div className={styles.navLinkWrapper}>
              <img
                src={moreIcon}
                alt="More icon"
                className={styles.navLinkIcon}
              />
              <Link to="#" className={styles.navLink}>
                {t("header.moreOptions")}
              </Link>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
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
                {t("header.bookLesson")}
              </Link>
            </div>
            <div className={styles.navLinkWrapper}>
              <img
                src={dashboardIcon}
                alt="Dashboard icon"
                className={styles.navLinkIcon}
              />
              <Link to="#" className={styles.navLink}>
                {t("header.manageBooking")}
              </Link>
            </div>
            <div className={styles.navLinkWrapper}>
              <img
                src={moreIcon}
                alt="More icon"
                className={styles.navLinkIcon}
              />
              <Link to="#" className={styles.navLink}>
                {t("header.aboutUs")}
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
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {activeLang.toUpperCase()}{" "}
            <span className={styles.dropdownArrow}>▼</span>
          </button>

          {isDropdownOpen && (
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

        {isAdmin ? (
          <div className={styles.adminProfileWrapper}>
            <div className={styles.avatar}>VU</div>
            <span className={styles.profileName}>VesUp</span>
            <span className={styles.dropdownArrow}>▼</span>
          </div>
        ) : (
          <button className={styles.loginBtn} onClick={() => onLoginClick?.()}>
            {t("header.studentLogin")}
          </button>
        )}
      </div>
    </header>
  );
};
