"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
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

export function TranslationProvider({ children, initialLang = 'fr' }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const router = useRouter();
  const pathname = usePathname();

  // On mount, we can still sync from localStorage if it differs from initialLang?
  // Actually, next-intl middleware will use Accept-Language or cookie, so initialLang is already correct.
  // We can just keep localStorage as a backup.
  useEffect(() => {
    const stored = localStorage.getItem('site-lang') as Lang | null;
    if (stored && stored !== lang) {
      // If user has a stored preference different from the URL locale, we might want to redirect them, 
      // but to avoid redirect loops on first load, we'll just let next-intl middleware handle cookies.
    }
  }, [lang]);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('site-lang', newLang);
    // document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`; // optional, next-intl uses NEXT_LOCALE by default
    router.replace(pathname, { locale: newLang });
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
