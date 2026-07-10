import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useNavigation, Page } from '../context/NavigationContext';
import { useSettings } from '../context/SettingsContext';

export function Header({ onOpenSearch }: { onOpenSearch: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();
  const { currentPage, navigate } = useNavigation();
  const { settings } = useSettings();

  const navLinks: { page: Page; label: string }[] = [
    { page: 'home', label: 'Home' },
    { page: 'about', label: 'About Us' },
    { page: 'services', label: 'Services' },
    { page: 'projects', label: 'Portfolio' },
    { page: 'insights', label: 'Insights' },
    { page: 'reviews', label: 'Reviews' },
    { page: 'contact', label: 'Contact' }
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-custom z-[1000] py-4 transition-all print:hidden">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center flex-nowrap gap-2 md:gap-4">
        
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate('home')}
        >
          <img src={settings.logoUrl} alt="Glasswater" className="h-[40px] md:h-[50px] w-auto block object-contain" />
          <div className="flex flex-col leading-none">
            <div className="font-serif text-[1.2rem] md:text-[1.6rem] font-bold text-navy tracking-tight">
              GLASSWATER<span className="text-gold">.</span>
            </div>
            <div className="font-sans text-[0.55rem] md:text-[0.65rem] font-normal text-steel-blue block tracking-widest mt-[2px]">
              FIT-OUTS & CO. LTD.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 order-2 lg:order-none ml-auto lg:ml-0">
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center text-text-primary hover:text-gold transition-colors"
            onClick={onOpenSearch}
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          
          <button className="lg:hidden text-text-primary p-1" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => navigate(link.page)}
              className={`font-sans font-semibold text-[0.8rem] uppercase tracking-widest whitespace-nowrap transition-colors ${currentPage === link.page ? 'text-gold' : 'text-text-primary hover:text-gold'}`}
            >
              {link.label}
            </button>
          ))}
          <button 
            onClick={() => navigate('portal')}
            className="bg-gold text-white px-6 py-2.5 rounded font-semibold hover:bg-navy transition-colors ml-4 uppercase tracking-widest text-sm"
          >
            Portal
          </button>
        </nav>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl px-6 py-6 flex flex-col gap-6 border-t border-gray-100">
          {navLinks.map((link) => (
            <button
              key={link.page}
              className={`font-sans font-semibold text-left uppercase tracking-widest text-sm ${currentPage === link.page ? 'text-gold' : 'text-text-primary hover:text-gold'}`}
              onClick={() => {
                navigate(link.page);
                setIsOpen(false);
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              navigate('portal');
              setIsOpen(false);
            }}
            className="bg-gold text-white px-6 py-3.5 rounded font-semibold hover:bg-navy inline-block text-center mt-4 uppercase tracking-widest text-sm"
          >
            Portal
          </button>
        </nav>
      )}
    </header>
  );
}
