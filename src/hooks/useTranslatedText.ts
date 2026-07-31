import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { translateText } from "../i18n";

export function useTranslatedText(value: string, enabled = true) {
  const { i18n } = useTranslation();
  const [translatedValue, setTranslatedValue] = useState(value);

  useEffect(() => {
    let isMounted = true;

    if (!enabled || !value) {
      setTranslatedValue(value);
      return () => {
        isMounted = false;
      };
    }

    setTranslatedValue(value);

    translateText(value, i18n.language || "en").then((translated) => {
      if (isMounted) {
        setTranslatedValue(translated || value);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [enabled, value, i18n.language]);

  return translatedValue;
}
