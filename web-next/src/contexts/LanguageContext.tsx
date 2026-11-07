"use client";


import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { en } from '../locales/en';
import { it } from '../locales/it';
import { tr } from '../locales/tr';
import { es } from '../locales/es';

type Translations = typeof en;

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: Translations;
  isLoading: boolean;
}

const translations: Record<string, Translations> = {
  en,
  it,
  tr,
  es
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');
  const [t, setT] = useState<Translations>(translations.en);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch translations from database
  const fetchTranslationsFromDB = async (lang: string) => {
    try {
      setIsLoading(true);
      // Temporarily use local translations as backend API for translations is not yet implemented
      // If a backend API for translations is implemented, it can be fetched here using axios.
      // Example: const response = await axios.get(`${API_BASE_URL}/api/translations?lang=${lang}`);
      // return response.data;
      return translations[lang] || translations.en;
    } catch (error) {
      console.error('Error loading translations:', error);
      return translations[lang] || translations.en;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
      fetchTranslationsFromDB(savedLanguage).then(setT);
    } else {
      fetchTranslationsFromDB('en').then(setT);
    }
  }, []);

  const changeLanguage = async (lang: string) => {
    if (translations[lang]) {
      setLanguage(lang);
      const newTranslations = await fetchTranslationsFromDB(lang);
      setT(newTranslations);
      localStorage.setItem('language', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
