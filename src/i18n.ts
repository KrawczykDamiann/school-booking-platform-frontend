import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import enTranslation from "./locales/en.json";
import plTranslation from "./locales/pl.json";
import uaTranslation from "./locales/ua.json";

const savedLanguage = localStorage.getItem("app_lang") || "en";

export const translateText = async (
  text: string,
  targetLang = savedLanguage,
) => {
  if (!text) return "";

  const lang = targetLang === "ua" ? "uk" : targetLang;

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`,
    );
    const data = await response.json();
    const translated =
      data?.[0]?.map((item: string[]) => item[0]).join("") ?? text;
    return translated || text;
  } catch (error) {
    console.error("Translation failed:", error);
    return text;
  }
};

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      pl: { translation: plTranslation },
      ua: { translation: uaTranslation },
    },
    lng: savedLanguage,
    fallbackLng: "en",
    supportedLngs: ["en", "pl", "ua"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
