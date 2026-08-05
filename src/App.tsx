/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { WizardModal } from './components/WizardModal';
import { ToastContainer } from './components/ToastContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { I18nProvider, useI18n } from './context/I18nContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { ToastProvider } from './context/ToastContext';
import { MessageCircle, FileText } from 'lucide-react';
import { sanitizeWhatsAppUrl } from './utils/url';
import { getForms } from './cms';

// --- Lazy-loaded Pages (each becomes its own async chunk) ---
const HomePage     = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const AboutPage    = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const InsightsPage = lazy(() => import('./pages/InsightsPage').then(m => ({ default: m.InsightsPage })));
const FAQPage      = lazy(() => import('./pages/FAQPage').then(m => ({ default: m.FAQPage })));
const ReviewsPage  = lazy(() => import('./pages/ReviewsPage').then(m => ({ default: m.ReviewsPage })));
const ContactPage  = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const CareersPage  = lazy(() => import('./pages/CareersPage').then(m => ({ default: m.CareersPage })));
const PortalPage   = lazy(() => import('./pages/PortalPage').then(m => ({ default: m.PortalPage })));
const PostPage            = lazy(() => import('./pages/PostPage').then(m => ({ default: m.PostPage })));
const ProjectDetailPage   = lazy(() => import('./pages/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })));
const AdminPage    = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));

/** Minimal spinner shown while a lazy page chunk is loading */
function PageSkeleton() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-gold border-t-transparent animate-spin" />
    </div>
  );
}

function PageRenderer({ onOpenWizard }: { onOpenWizard: () => void }) {
  const { currentPage } = useNavigation();

  return (
    <Suspense fallback={<PageSkeleton />}>
      {(() => {
        switch (currentPage) {
          case 'home':     return <HomePage onOpenWizard={onOpenWizard} />;
          case 'about':    return <AboutPage />;
          case 'services': return <ServicesPage />;
          case 'projects': return <ProjectsPage />;
          case 'insights': return <InsightsPage />;
          case 'contact':  return <ContactPage />;
          case 'portal':   return <PortalPage />;
          case 'post':     return <PostPage />;
          case 'project':  return <ProjectDetailPage />;
          case 'faq':      return <FAQPage />;
          case 'reviews':  return <ReviewsPage />;
          case 'careers':  return <CareersPage />;
          case 'admin':    return <AdminPage />;
          default:         return <HomePage onOpenWizard={onOpenWizard} />;
        }
      })()}
    </Suspense>
  );
}

function MainApp() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const { settings } = useSettings();
  const { t, lang } = useI18n();
  const forms = getForms(lang);

  useEffect(() => {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) keys.push(k);
      }

      for (const key of keys) {
        if (key && key.startsWith('glasswater_')) {
          let val = localStorage.getItem(key);
          if (val && (val.includes('cloudinary.com') || val.includes('/images/'))) {
            val = val.replace(/https:\/\/res\.cloudinary\.com\/[^"'\s]*/g, (match: string) => {
              if (match.includes('IMG-20260705-WA0089_f3agy0')) return 'https://lh3.googleusercontent.com/d/17OEVNBh2mvO3MNCzogUGhSgTuTHh2BQk';
              if (match.includes('IMG-20260705-WA0092_q6v7sc')) return 'https://lh3.googleusercontent.com/d/16rYbGyUo4aXCqVO3fsKTyL4NI7Ww8rnI';
              if (match.includes('IMG-20260705-WA0094_dqxgcr')) return 'https://lh3.googleusercontent.com/d/1yybAmLVE2csJ7mUpp1kqgYMA_Jsk4aeZ';
              if (match.includes('logoglasswater')) return 'https://lh3.googleusercontent.com/d/17P2w-kaeNW06Xb5OTU1UK-sRLSV4RUsy';
              if (match.includes('download_1_rehu5v')) return 'https://lh3.googleusercontent.com/d/1OIlJfC6l_24rlCK1Yo_Iqcsih3SAyH6c';
              return match;
            });

            val = val.replace(/\/images\/[a-zA-Z0-9_-]+\.jpg/g, (match: string) => {
              if (match.includes('bathroom-tub')) return 'https://lh3.googleusercontent.com/d/17OEVNBh2mvO3MNCzogUGhSgTuTHh2BQk';
              if (match.includes('kitchen-sink')) return 'https://lh3.googleusercontent.com/d/16rYbGyUo4aXCqVO3fsKTyL4NI7Ww8rnI';
              if (match.includes('water-filter')) return 'https://lh3.googleusercontent.com/d/1yybAmLVE2csJ7mUpp1kqgYMA_Jsk4aeZ';
              if (match.includes('logo')) return 'https://lh3.googleusercontent.com/d/17P2w-kaeNW06Xb5OTU1UK-sRLSV4RUsy';
              if (match.includes('bathroom-shower')) return 'https://lh3.googleusercontent.com/d/1OIlJfC6l_24rlCK1Yo_Iqcsih3SAyH6c';
              if (match.includes('pipes')) return 'https://lh3.googleusercontent.com/d/12t2BvS2Yw52abLkC9cHlaEkLlhFf020p';
              return match;
            });

            localStorage.setItem(key, val);
          }
        }
      }
    } catch (e) {
      console.error('Migration error:', e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg-body flex flex-col font-sans">
      <Header onOpenSearch={() => setIsSearchOpen(true)} onOpenWizard={() => setIsWizardOpen(true)} />

      <main className="flex-1 mt-[54px] sm:mt-[70px] md:mt-[80px] print:mt-0">
        <PageRenderer onOpenWizard={() => setIsWizardOpen(true)} />
      </main>

      <Footer />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <WizardModal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />

      {/* Floating Action Buttons */}
      <button
        onClick={() => setIsWizardOpen(true)}
        className="fixed bottom-[90px] md:bottom-[100px] right-4 md:right-6 bg-gold text-white px-4 py-2.5 md:px-6 md:py-4 rounded-full font-semibold shadow-custom hover:scale-105 hover:bg-navy transition-all z-50 flex items-center gap-2 md:gap-3 print:hidden"
      >
        <FileText size={16} className="md:w-5 md:h-5" /> <span className="uppercase tracking-widest text-[0.6rem] md:text-sm">{forms.quoteButtonLabel}</span>
      </button>

      <a
        href={sanitizeWhatsAppUrl(settings.whatsapp)}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-custom hover:scale-110 hover:bg-[#128C7E] transition-all z-50 print:hidden"
        aria-label={t('whatsapp.chat')}
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <SettingsProvider>
          <NavigationProvider>
            <ToastProvider>
              <MainApp />
              <ToastContainer />
            </ToastProvider>
          </NavigationProvider>
        </SettingsProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}