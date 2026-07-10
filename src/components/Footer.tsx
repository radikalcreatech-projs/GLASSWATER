import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useNavigation } from '../context/NavigationContext';
import { useSettings } from '../context/SettingsContext';

export function Footer() {
  const { t } = useI18n();
  const { navigate } = useNavigation();
  const { settings } = useSettings();

  return (
    <footer className="bg-navy text-light-gray pt-16 pb-8 print:hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
        <div>
          <h4 className="text-white font-serif font-bold text-2xl mb-6 tracking-wide">GLASSWATER<span className="text-gold">.</span></h4>
          <p className="text-steel-blue text-sm uppercase tracking-widest font-semibold mb-4">FIT-OUTS & CO. LTD.</p>
          <p className="text-light-gray/70 text-sm leading-relaxed max-w-xs">Precision built. Dependably delivered.</p>
        </div>
        
        <div>
          <h4 className="text-white font-sans font-semibold text-lg mb-6 tracking-widest uppercase text-sm">{t('footer.contact')}</h4>
          <div className="space-y-4 text-light-gray/70 text-sm">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-3 hover:text-gold transition-colors cursor-pointer"><Phone size={18} className="text-gold" /> {settings.phone}</a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-3 hover:text-gold transition-colors cursor-pointer"><Mail size={18} className="text-gold" /> {settings.email}</a>
            <div className="flex items-start gap-3"><MapPin size={18} className="text-gold shrink-0 mt-0.5" /> <span className="leading-relaxed whitespace-pre-line">{settings.address}</span></div>
          </div>
        </div>

        <div>
          <h4 className="text-white font-sans font-semibold text-lg mb-6 tracking-widest uppercase text-sm">{t('footer.links')}</h4>
          <ul className="space-y-3 text-sm">
            <li><button onClick={() => navigate('home')} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-xs">Home</button></li>
            <li><button onClick={() => navigate('about')} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-xs">About</button></li>
            <li><button onClick={() => navigate('services')} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-xs">Services</button></li>
            <li><button onClick={() => navigate('projects')} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-xs">Projects</button></li>
            <li><button onClick={() => navigate('insights')} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-xs">Insights</button></li>
            <li><button onClick={() => navigate('contact')} className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-xs">Contact</button></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-sans font-semibold text-lg mb-6 tracking-widest uppercase text-sm">{t('footer.connect')}</h4>
          <div className="flex flex-col gap-3 text-sm">
            <a href={settings.whatsapp} target="_blank" rel="noreferrer" className="text-[#25D366] font-semibold hover:text-gold transition-colors flex items-center gap-2 uppercase tracking-widest text-xs">
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a href={settings.facebook} target="_blank" rel="noreferrer" className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-xs">Facebook</a>
            <a href={settings.instagram} target="_blank" rel="noreferrer" className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-xs">Instagram</a>
            <a href={settings.linkedin} target="_blank" rel="noreferrer" className="text-light-gray/70 hover:text-gold transition-colors uppercase tracking-widest text-xs">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-light-gray/50 uppercase tracking-widest">
        <div>&copy; 2026 Glasswater Fit‑Outs &amp; Co. Ltd.</div>
        <div>All rights reserved.</div>
      </div>
    </footer>
  );
}
