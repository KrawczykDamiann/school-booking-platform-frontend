import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.scss";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", label: "EN", flag: "🇬🇧" },
    { code: "pl", label: "PL", flag: "🇵🇱" },
    { code: "ua", label: "UA", flag: "🇺🇦" },
  ];

  // Change language in i18next state and persist it in localStorage
  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("app_lang", lng);
    window.dispatchEvent(new Event("app-language-changed"));
  };

  const currentLang =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <div className="language-switcher">
      <div className="language-switcher__current">
        <span className="language-switcher__flag">{currentLang.flag}</span>
        <span className="language-switcher__label">{currentLang.label}</span>
      </div>

      <ul className="language-switcher__dropdown">
        {languages
          .filter((lang) => lang.code !== i18n.language)
          .map((lang) => (
            <li key={lang.code} className="language-switcher__item">
              <button
                className="language-switcher__btn"
                onClick={() => changeLang(lang.code)}
              >
                <span className="language-switcher__flag">{lang.flag}</span>
                <span className="language-switcher__label">{lang.label}</span>
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
