import { useI18n } from '../context/I18nContext';
import { useSettings } from '../context/SettingsContext';
import { getServices } from '../cms';
import { Settings, HardHat, Sofa, Paintbrush, Droplets, Waves, Building2, MessageCircle } from 'lucide-react';
import { sanitizeWhatsAppUrl } from '../utils/url';

// Map icon names to Lucide icon components
const iconMap: Record<string, React.ComponentType<any>> = {
  Settings, HardHat, Sofa, Paintbrush, Droplets, Waves, Building2,
};

export function ServicesPage() {
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const cms = getServices(lang);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="py-8 bg-bg-section px-4 md:px-6 border border-gold m-3 sm:m-4 lg:m-6 rounded-xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 max-w-3xl mx-auto">
            <h2 className="uppercase tracking-[0.3em] text-gold text-xs font-semibold mb-2">{t('services.caps')}</h2>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4">{cms.title}</h1>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed">{cms.subtitle}</p>
          </div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible no-scrollbar">
            {(cms.items.length > 0 ? cms.items : []).map((service, idx) => {
              const IconComponent = iconMap[service.iconName] || Settings;
              return (
                <div key={idx} className="min-w-[85%] sm:min-w-[70%] md:min-w-0 snap-center bg-white p-6 md:p-8 rounded-lg shadow-custom hover:-translate-y-2 transition-all group">
                  <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-gold mb-4 md:mb-6 stroke-[1.5]" />
                  <h3 className="font-serif font-bold text-xl text-navy mb-3">{service.title}</h3>
                  <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-4">{service.description}</p>
                  <a
                    href={`${sanitizeWhatsAppUrl(settings.whatsapp)}?text=${encodeURIComponent(`Hi Glasswater, I'm interested in your ${service.title} service. Can you provide more information?`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#25D366] text-xs font-semibold uppercase tracking-wider hover:text-[#128C7E] transition-colors"
                  >
                    <MessageCircle size={14} /> Inquire Now
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}