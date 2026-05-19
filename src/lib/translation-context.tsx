"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import fr from '@/messages/fr.json';
import en from '@/messages/en.json';

type Lang = 'fr' | 'en';

const translations: Record<Lang, any> = { fr, en };

interface TranslationContextType {
  lang: Lang;
  t: (key: string) => string;
  setLang: (lang: Lang) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr');

  useEffect(() => {
    const stored = localStorage.getItem('site-lang') as Lang | null;
    if (stored === 'fr' || stored === 'en') {
      setLangState(stored);
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('site-lang', newLang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <TranslationContext.Provider value={{ lang, t, setLang }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}
