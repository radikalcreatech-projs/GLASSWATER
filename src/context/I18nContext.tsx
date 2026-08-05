import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'en' | 'fr';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'en') as Language;

  useEffect(() => {
    const saved = localStorage.getItem('glasswater_lang') as Language;
    if (saved && (saved === 'en' || saved === 'fr') && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    }
  }, [i18n]);

  const setLang = (l: Language) => {
    i18n.changeLanguage(l);
    localStorage.setItem('glasswater_lang', l);
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t: (key: string) => t(key) as string }}>
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
