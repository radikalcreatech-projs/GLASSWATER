import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations } from '../data';

type Language = 'en' | 'fr';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('glasswater_lang') as Language;
    if (saved && (saved === 'en' || saved === 'fr')) {
      setLangState(saved);
    }
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('glasswater_lang', l);
  };

  const t = (key: string) => {
    return translations[lang]?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
