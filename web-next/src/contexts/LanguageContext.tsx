"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { en } from "../locales/en";
import { it } from "../locales/it";
import { tr } from "../locales/tr";
import { es } from "../locales/es";
import {
  buildLocalizedPath,
  DEFAULT_LOCALE,
  isSupportedLocale,
  parseLocalizedPathname,
  type SupportedLocale,
} from "@/lib/i18n/locale-utils";

type Translations = typeof en;

interface LanguageContextType {
  language: SupportedLocale;
  setLanguage: (lang: string) => void;
  localizePath: (path: string) => string;
  t: Translations;
  isLoading: boolean;
}

const translations: Record<SupportedLocale, Translations> = {
  en,
  it,
  tr,
  es,
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: SupportedLocale;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  // Resolve initial language synchronously on the server from initialLocale
  const [language, setLanguageState] = useState<SupportedLocale>(initialLocale);

  // Sync with URL prefix on client navigation (/tr/*, /es/*, /it/*, or prefix-free en)
  useEffect(() => {
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : pathname || "/";
    const { locale } = parseLocalizedPathname(currentPath);
    if (locale !== language) {
      setLanguageState(locale);
    }
  }, [pathname, language]);

  const changeLanguage = useCallback(
    (nextLangRaw: string) => {
      const nextLang: SupportedLocale = isSupportedLocale(nextLangRaw)
        ? nextLangRaw
        : DEFAULT_LOCALE;
      setLanguageState(nextLang);

      if (typeof window !== "undefined") {
        const targetPath = buildLocalizedPath(
          window.location.pathname,
          nextLang
        );
        const search = window.location.search || "";
        router.push(`${targetPath}${search}`);
      }
    },
    [router]
  );

  const localizePath = useCallback(
    (path: string) => {
      return buildLocalizedPath(path, language);
    },
    [language]
  );

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        localizePath,
        t,
        isLoading: false,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
