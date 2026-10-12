"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AppLanguage } from "@/lib/i18n/language";
import { makeT, type TFunction } from "@/lib/i18n/translate";

const LanguageContext = createContext<AppLanguage>("en");
const SetLanguageContext = createContext<(language: AppLanguage) => void>(() => {});

export function LanguageProvider({
  language,
  children,
}: {
  language: AppLanguage;
  children: React.ReactNode;
}) {
  const [current, setCurrent] = useState(language);
  useEffect(() => {
    setCurrent(language);
  }, [language]);

  return (
    <SetLanguageContext.Provider value={setCurrent}>
      <LanguageContext.Provider value={current}>{children}</LanguageContext.Provider>
    </SetLanguageContext.Provider>
  );
}

export function useAppLanguage(): AppLanguage {
  return useContext(LanguageContext);
}

export function useSetAppLanguage(): (language: AppLanguage) => void {
  return useContext(SetLanguageContext);
}

export function useT(): TFunction {
  const language = useAppLanguage();
  return useMemo(() => makeT(language), [language]);
}
