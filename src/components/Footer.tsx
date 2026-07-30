import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useNavigation } from '../context/NavigationContext';
import { useSettings } from '../context/SettingsContext';

export function Footer() {
  const { t } = useI18n();
  const { navigate } = useNavigation();
  const { settings } = useSettings();

  return (
    <footer className="bg-navy text-light-gray py-8 print:hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
        <div>
          <h4 className="text-white font-serif font-bold text-xl mb-4 tracking-wide">GLASSWATER<span className="text-gold">.</span></h4>
          <p className="text-steel-blue text-[0.65rem] uppercase tracking-widest font-semibold mb-2">FIT-OUTS & CO. LTD.</p>
          <p className="text-light-gray/70 text-xs leading-relaxed max-w-xs">{t('footer.slogan')}</p>
        </div>
        
        <div>
          <h4 className="text-white font-sans font-semibold mb-4 tracking-widest uppercase text-xs">{t('footer.contact')}</h4>
          <div className="space-y-3 text-light-gray/70 text-xs">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-3 hover:text-gold transition-colors cursor-pointer"><Phone size={16} className="text-gold" /> {settings.phone}</a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-3 hover:text-gold transition-colors cursor-pointer"><Mail size={16} className="text-gold" /> {settings.email}</a>
            <div className="flex items-start gap-3"><MapPin size={16} className="text-gold shrink-0 mt-0.5" /> <span className="leading-relaxed whitespace-pre-line">{settings.address}</span></div>
          </div>
        </div>

        <div>
          <h4 className="text-white font-sans font-semibold mb-4 tracking-widest uppercase text-xs">{t('footer.links')}</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => navigate('home')} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-[0.65rem]">{t('nav.home')}</button></li>
            <li><button onClick={() => navigate('about')} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-[0.65rem]">{t('nav.about')}</button></li>
            <li><button onClick={() => navigate('services')} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-[0.65rem]">{t('nav.services')}</button></li>
            <li><button onClick={() => navigate('projects')} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-[0.65rem]">{t('nav.projects')}</button></li>
            <li><button onClick={() => navigate('insights')} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-[0.65rem]">{t('nav.insights')}</button></li>
            <li><button onClick={() => navigate('contact')} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-[0.65rem]">{t('nav.contact')}</button></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-sans font-semibold mb-4 tracking-widest uppercase text-xs">{t('footer.connect')}</h4>
          <div className="flex flex-col gap-2 text-xs">
            <a href={settings.whatsapp} target="_blank" rel="noreferrer" className="text-[#25D366] font-semibold hover:text-gold transition-colors flex items-center gap-2 uppercase tracking-widest text-[0.65rem]">
              <MessageCircle size={14} /> {t('social.whatsapp')}
            </a>
            <a href={settings.facebook} target="_blank" rel="noreferrer" className="text-light-gray/70 hover:text-gold transition-colors flex items-center gap-2 uppercase tracking-widest text-[0.65rem]"><Facebook size={14} /> {t('social.facebook')}</a>
            <a href={settings.instagram} target="_blank" rel="noreferrer" className="text-light-gray/70 hover:text-gold transition-colors flex items-center gap-2 uppercase tracking-widest text-[0.65rem]"><Instagram size={14} /> {t('social.instagram')}</a>
            <a href={settings.linkedin} target="_blank" rel="noreferrer" className="text-light-gray/70 hover:text-gold transition-colors flex items-center gap-2 uppercase tracking-widest text-[0.65rem]"><Linkedin size={14} /> {t('social.linkedin')}</a>
            {settings.tiktok && (
              <a href={settings.tiktok} target="_blank" rel="noreferrer" className="text-light-gray/70 hover:text-gold transition-colors flex items-center gap-2 uppercase tracking-widest text-[0.65rem]"><Music2 size={14} /> {t('social.tiktok')}</a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-[0.65rem] text-light-gray/50 uppercase tracking-widest">
        <div>&copy; 2026 Glasswater Fit‑Outs &amp; Co. Ltd.</div>
        <div>{t('footer.rights')}</div>
      </div>
    </footer>
  );
}
