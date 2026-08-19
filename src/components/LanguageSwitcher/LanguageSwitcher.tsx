import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSwitcher.module.scss";

interface Language {
  code: string;
  label: string;
}

const languages: Language[] = [
  { code: "en", label: "English" },
  { code: "pl", label: "Polski" },
  { code: "ua", label: "Українська" }, 
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [activeLang, setActiveLang] = useState<string>(() => {
    const match = document.cookie.match(/googtrans=\/[/a-zA-Z]+\/([^/]+)/);
    if (match) {
      const code = match[1];
      return code === "uk" ? "ua" : code; 
    }
    return i18n.resolvedLanguage || i18n.language || "pl";
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    const langCode = lang.code;

    i18n.changeLanguage(langCode);
    localStorage.setItem("app_lang", langCode);
    setActiveLang(langCode);
    setIsOpen(false);

    const googleLangCode = langCode === "ua" ? "uk" : langCode;
    const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    
    if (selectEl) {
      selectEl.value = googleLangCode;
      selectEl.dispatchEvent(new Event("change"));
    }
  };

  const currentLang = languages.find((lang) => lang.code === activeLang) || languages[0];

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button 
        className={styles.switcher} 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        
        <span className={styles.text}>{currentLang.label}</span>
        
        <svg className={`${styles.arrow} ${isOpen ? styles.open : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <ul className={styles.dropdown}>
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                className={`${styles.option} ${activeLang === lang.code ? styles.active : ""}`}
                onClick={() => handleSelect(lang)}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};