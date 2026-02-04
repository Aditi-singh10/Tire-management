import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "./translation";

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: (key, vars) => key,
});

const getNestedValue = (obj, path) =>
  path.split(".").reduce((acc, part) => acc?.[part], obj);

const formatString = (value, vars = {}) =>
  Object.entries(vars).reduce(
    (acc, [key, replacement]) =>
      acc.replaceAll(`{${key}}`, replacement ?? ""),
    value
  );

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = useMemo(
    () => (key, vars) => {
      const selected = translations[language] || translations.en;
      const fallback = translations.en;
      const value = getNestedValue(selected, key) ?? getNestedValue(fallback, key);
      if (!value) return key;
      return typeof value === "string" ? formatString(value, vars) : value;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);