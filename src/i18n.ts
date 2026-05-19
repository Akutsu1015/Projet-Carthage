import fr from './messages/fr.json';
import en from './messages/en.json';

const translations = { fr, en };

export function getTranslation(lang: 'fr' | 'en') {
  return translations[lang];
}

export type TranslationKey = keyof typeof fr;
