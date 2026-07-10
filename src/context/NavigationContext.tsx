import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Page = 'home' | 'about' | 'services' | 'projects' | 'insights' | 'faq' | 'reviews' | 'contact' | 'careers' | 'portal' | 'post' | 'admin';

interface NavigationContextType {
  currentPage: Page;
  currentPostSlug: string | null;
  navigate: (page: Page, data?: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentPostSlug, setCurrentPostSlug] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as Page;
      const validPages: Page[] = ['home', 'about', 'services', 'projects', 'insights', 'faq', 'reviews', 'contact', 'careers', 'portal', 'post', 'admin'];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    handleHashChange();
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: Page, data?: string) => {
    setCurrentPage(page);
    if (data) {
      setCurrentPostSlug(data);
    } else if (page !== 'post') {
      setCurrentPostSlug(null);
    }
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
