import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';

export type Page = 'home' | 'about' | 'services' | 'projects' | 'insights' | 'faq' | 'reviews' | 'contact' | 'careers' | 'portal' | 'post' | 'admin';

interface NavigationContextType {
  currentPage: Page;
  currentPostSlug: string | null;
  navigate: (page: Page, data?: string) => void;
  isTransitioning: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const validPages: Page[] = ['home', 'about', 'services', 'projects', 'insights', 'faq', 'reviews', 'contact', 'careers', 'portal', 'post', 'admin'];

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const hash = window.location.hash.replace('#', '') as Page;
    return validPages.includes(hash) ? hash : 'home';
  });
  const [currentPostSlug, setCurrentPostSlug] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Debounce ref prevents duplicate navigations within 500ms
  const lastNavTimeRef = useRef(0);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Cleanup transition timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  const navigate = useCallback((page: Page, data?: string) => {
    const now = Date.now();

    // Guard: ignore clicks within 500ms of the last navigation
    if (now - lastNavTimeRef.current < 500) return;

    lastNavTimeRef.current = now;
    setIsTransitioning(true);

    // Clear previous transition timeout
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);

    // Update hash first, then React state — prevents race condition
    window.location.hash = page;

    // Defer React state update slightly to let hash settle
    requestAnimationFrame(() => {
      setCurrentPage(page);
      if (data) {
        setCurrentPostSlug(data);
      } else if (page !== 'post') {
        setCurrentPostSlug(null);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Release transition lock after animation completes
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    });
  }, []);

  return (
    <NavigationContext.Provider value={{ currentPage, currentPostSlug, navigate, isTransitioning }}>
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