"use client";

import { createContext, useState, useEffect, ReactNode, useMemo } from "react";
import translationsEn from '@/locales/en';
import translationsId from '@/locales/id';

type Language = "en" | "id";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: typeof translationsEn;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const storedLang = localStorage.getItem("language") as Language | null;
    if (storedLang && (storedLang === 'en' || storedLang === 'id')) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };
  
  const translations = useMemo(() => {
    return language === 'id' ? translationsId : translationsEn;
  }, [language]);

  const value = {
    language,
    setLanguage,
    translations
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
