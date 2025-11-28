import React, { createContext, useContext, useState, useEffect } from "react";
import { it } from "../lang/translations_it";
import { en } from "../lang/translations_en";

export const translations = { it, en };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "it");

  const toggleLang = () => {
    const newLang = lang === "it" ? "en" : "it";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  const t = (key) => {
    const parts = key.split(".");
    let result = translations[lang];

    for (const part of parts) {
      if (!result || !result[part]) return key;
      result = result[part];
    }

    return result;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
