import { useI18n } from '../context/I18nContext';
import { Settings, HardHat, Sofa, Paintbrush, Droplets, Waves, Building2 } from 'lucide-react';

export function ServicesPage() {
  const { t } = useI18n();

  const services = [
    { icon: Settings, titleKey: 'services.eng', descKey: 'services.engp' },
    { icon: HardHat, titleKey: 'services.const', descKey: 'services.constp' },
    { icon: Sofa, titleKey: 'services.fit', descKey: 'services.fitp' },
    { icon: Paintbrush, titleKey: 'services.fin', descKey: 'services.finp' },
    { icon: Droplets, titleKey: 'services.water', descKey: 'services.waterp' },
    { icon: Waves, titleKey: 'services.pool', descKey: 'services.poolp' },
    { icon: Building2, titleKey: 'services.fm', descKey: 'services.fmp' }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="py-8 bg-bg-section px-4 md:px-6 border border-gold m-3 sm:m-4 lg:m-6 rounded-xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 max-w-3xl mx-auto">
            <h2 className="uppercase tracking-[0.3em] text-gold text-xs font-semibold mb-2">{t('services.caps')}</h2>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4">{t('services.title')}</h1>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed">{t('services.sub')}</p>
          </div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible no-scrollbar">
            {services.map((service, idx) => (
              <div key={idx} className="min-w-[85%] sm:min-w-[70%] md:min-w-0 snap-center bg-white p-6 md:p-8 rounded-lg shadow-custom hover:-translate-y-2 transition-all">
                <service.icon className="w-8 h-8 md:w-10 md:h-10 text-gold mb-4 md:mb-6 stroke-[1.5]" />
                <h3 className="font-serif font-bold text-xl text-navy mb-3">{t(service.titleKey)}</h3>
                <p className="text-text-secondary text-sm md:text-base leading-relaxed">{t(service.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
