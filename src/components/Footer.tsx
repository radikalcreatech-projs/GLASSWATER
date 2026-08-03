import { Phone, MessageCircle, Mail, MapPin, Facebook, Instagram, Linkedin, Music2 } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useNavigation } from '../context/NavigationContext';
import { useSettings } from '../context/SettingsContext';

export function Footer() {
  const { t } = useI18n();
  const { navigate, isTransitioning } = useNavigation();
  const { settings } = useSettings();

  const handleNav = (page: Parameters<typeof navigate>[0]) => {
    if (isTransitioning) return;
    navigate(page);
  };

  return (
    <footer className="bg-navy text-light-gray py-6 md:py-8 print:hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-8 mb-6 md:mb-8">
        <div className="col-span-2 md:col-span-1">
          <h4 className="text-white font-serif font-bold text-xl mb-4 tracking-wide">GLASSWATER<span className="text-gold">.</span></h4>
          <p className="text-steel-blue text-[0.65rem] uppercase tracking-widest font-semibold mb-2">FIT-OUTS & CO. LTD.</p>
          <p className="text-light-gray/70 text-xs leading-relaxed max-w-xs">{t('footer.slogan')}</p>
        </div>
        
        <div className="col-span-2 md:col-span-1">
          <h4 className="text-white font-sans font-semibold mb-4 tracking-widest uppercase text-xs">{t('footer.contact')}</h4>
          <div className="space-y-3 text-light-gray/70 text-xs">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-3 hover:text-gold transition-colors cursor-pointer"><Phone size={16} className="text-gold" /> {settings.phone}</a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-3 hover:text-gold transition-colors cursor-pointer"><Mail size={16} className="text-gold" /> {settings.email}</a>
            <div className="flex items-start gap-3"><MapPin size={16} className="text-gold shrink-0 mt-0.5" /> <span className="leading-relaxed whitespace-pre-line">{settings.address}</span></div>
          </div>
        </div>

        <div className="hidden md:block col-span-1">
          <h4 className="text-white font-sans font-semibold mb-4 tracking-widest uppercase text-xs">{t('footer.links')}</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => handleNav('home')} disabled={isTransitioning} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-[0.65rem] disabled:opacity-50">{t('nav.home')}</button></li>
            <li><button onClick={() => handleNav('about')} disabled={isTransitioning} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-[0.65rem] disabled:opacity-50">{t('nav.about')}</button></li>
            <li><button onClick={() => handleNav('services')} disabled={isTransitioning} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-[0.65rem] disabled:opacity-50">{t('nav.services')}</button></li>
            <li><button onClick={() => handleNav('projects')} disabled={isTransitioning} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-[0.65rem] disabled:opacity-50">{t('nav.projects')}</button></li>
            <li><button onClick={() => handleNav('insights')} disabled={isTransitioning} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-[0.65rem] disabled:opacity-50">{t('nav.insights')}</button></li>
            <li><button onClick={() => handleNav('contact')} disabled={isTransitioning} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-[0.65rem] disabled:opacity-50">{t('nav.contact')}</button></li>
          </ul>
        </div>
        
        <div className="col-span-2 md:col-span-1">
          <h4 className="text-white font-sans font-semibold mb-4 tracking-widest uppercase text-xs">{t('footer.connect')}</h4>
          <div className="flex flex-wrap gap-4 mt-1">
            <a href={settings.whatsapp} target="_blank" rel="noreferrer" aria-label={t('social.whatsapp')} className="text-[#25D366] hover:text-gold transition-colors hover:-translate-y-1">
              <MessageCircle size={20} />
            </a>
            <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label={t('social.facebook')} className="text-light-gray/70 hover:text-gold transition-colors hover:-translate-y-1">
              <Facebook size={20} />
            </a>
            <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label={t('social.instagram')} className="text-light-gray/70 hover:text-gold transition-colors hover:-translate-y-1">
              <Instagram size={20} />
            </a>
            <a href={settings.linkedin} target="_blank" rel="noreferrer" aria-label={t('social.linkedin')} className="text-light-gray/70 hover:text-gold transition-colors hover:-translate-y-1">
              <Linkedin size={20} />
            </a>
            {settings.tiktok && (
              <a href={settings.tiktok} target="_blank" rel="noreferrer" aria-label={t('social.tiktok')} className="text-light-gray/70 hover:text-gold transition-colors hover:-translate-y-1">
                <Music2 size={20} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-4 md:pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-[0.65rem] text-light-gray/50 uppercase tracking-widest">
        <div>&copy; 2026 Glasswater Fit‑Outs &amp; Co. Ltd.</div>
        <div>{t('footer.rights')}</div>
      </div>
    </footer>
  );
}
