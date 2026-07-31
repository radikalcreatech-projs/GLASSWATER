import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

export type Page = 'home' | 'about' | 'services' | 'projects' | 'insights' | 'faq' | 'reviews' | 'contact' | 'careers' | 'portal' | 'post' | 'admin';

interface NavigationContextType {
  currentPage: Page;
  currentPostSlug: string | null;
  navigate: (page: Page, data?: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const validPages: Page[] = ['home', 'about', 'services', 'projects', 'insights', 'faq', 'reviews', 'contact', 'careers', 'portal', 'post', 'admin'];

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const hash = window.location.hash.replace('#', '') as Page;
    return validPages.includes(hash) ? hash : 'home';
  });
  const [currentPostSlug, setCurrentPostSlug] = useState<string | null>(null);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '') as Page;
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
        if (hash !== 'post') setCurrentPostSlug(null);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((page: Page, data?: string) => {
    setCurrentPage(page);
    if (data) {
      setCurrentPostSlug(data);
    } else if (page !== 'post') {
      setCurrentPostSlug(null);
    }
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <NavigationContext.Provider value={{ currentPage, currentPostSlug, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}