import { useState } from 'react';
import { Menu, X, Search, Moon, Sun, Globe } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useNavigation, Page } from '../context/NavigationContext';
import { useSettings } from '../context/SettingsContext';
import { useDarkMode } from '../hooks/useDarkMode';

export function Header({ onOpenSearch, onOpenWizard }: { onOpenSearch: () => void; onOpenWizard: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, lang, setLang } = useI18n();
  const { currentPage, navigate } = useNavigation();
  const { settings } = useSettings();
  const { isDark, toggle } = useDarkMode();

  const navLinks: { page: Page; key: string }[] = [
    { page: 'home', key: 'nav.home' },
    { page: 'about', key: 'nav.about' },
    { page: 'services', key: 'nav.services' },
    { page: 'projects', key: 'nav.projects' },
    { page: 'insights', key: 'nav.insights' },
    { page: 'reviews', key: 'nav.reviews' },
    { page: 'contact', key: 'nav.contact' }
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-custom z-[1000] py-2 md:py-4 transition-all print:hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center flex-nowrap gap-2 md:gap-4">
        
        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer" 
          onClick={() => navigate('home')}
        >
          <img src={settings.logoUrl} alt="Glasswater" className="h-[28px] sm:h-[36px] md:h-[50px] w-auto block object-contain" />
          <div className="flex flex-col leading-none">
            <div className="font-serif text-[0.95rem] sm:text-[1.1rem] md:text-[1.6rem] font-bold text-navy tracking-tight">
              GLASSWATER<span className="text-gold">.</span>
            </div>
            <div className="font-sans text-[0.45rem] sm:text-[0.5rem] md:text-[0.65rem] font-normal text-steel-blue block tracking-widest mt-[1px] md:mt-[2px]">
              FIT-OUTS & CO. LTD.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-4 order-2 lg:order-none ml-auto lg:ml-0">
          <button 
            className="flex items-center justify-center text-text-primary hover:text-gold transition-colors font-sans text-[0.65rem] md:text-[0.7rem] font-bold uppercase tracking-widest whitespace-nowrap px-2"
            onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
            aria-label="Toggle Language"
            title={t('lang.switch')}
          >
            {t('lang.switch')}
          </button>
          
          <button 
            className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-text-primary hover:text-gold transition-colors"
            onClick={toggle}
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-text-primary hover:text-gold transition-colors"
            onClick={onOpenSearch}
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          
          <button className="lg:hidden text-text-primary p-1" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => navigate(link.page)}
              className={`font-sans font-semibold text-[0.8rem] uppercase tracking-widest whitespace-nowrap transition-colors ${currentPage === link.page ? 'text-gold' : 'text-text-primary hover:text-gold'}`}
            >
              {t(link.key)}
            </button>
          ))}
          <button 
            onClick={() => navigate('portal')}
            className="bg-gold text-white px-6 py-2.5 rounded font-semibold hover:bg-navy transition-colors ml-4 uppercase tracking-widest text-[0.75rem] md:text-sm"
          >
            {t('nav.portal')}
          </button>
        </nav>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl px-5 py-5 flex flex-col gap-4 border-t border-gray-100">
          {navLinks.map((link) => (
            <button
              key={link.page}
              className={`font-sans font-semibold text-left uppercase tracking-widest text-[0.7rem] sm:text-[0.75rem] ${currentPage === link.page ? 'text-gold' : 'text-text-primary hover:text-gold'}`}
              onClick={() => {
                navigate(link.page);
                setIsOpen(false);
              }}
            >
              {t(link.key)}
            </button>
          ))}
          <div className="grid grid-cols-2 gap-3 mt-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => {
                navigate('portal');
                setIsOpen(false);
              }}
              className="bg-navy text-white py-2.5 rounded font-semibold hover:bg-gold transition-colors text-center uppercase tracking-widest text-[0.65rem] sm:text-xs"
            >
              {t('nav.portal')}
            </button>
            <button
              onClick={() => {
                onOpenWizard();
                setIsOpen(false);
              }}
              className="bg-gold text-white py-2.5 rounded font-semibold hover:bg-navy transition-colors text-center uppercase tracking-widest text-[0.65rem] sm:text-xs"
            >
              Request Quote
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
