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
      <section className="py-10 bg-bg-section px-6 border border-gold m-3 sm:m-4 lg:m-6 rounded-xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 md:mb-10 max-w-3xl mx-auto">
            <h2 className="uppercase tracking-[0.3em] text-gold text-sm font-semibold mb-4">Capabilities</h2>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-navy mb-6 md:mb-8">{t('services.title')}</h1>
            <p className="text-xl text-text-secondary leading-relaxed">{t('services.sub')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {services.map((service, idx) => (
              <div key={idx} className="bg-white p-10 rounded-lg shadow-custom hover:-translate-y-2 transition-all">
                <service.icon className="w-12 h-12 text-gold mb-6 md:mb-8 stroke-[1.5]" />
                <h3 className="font-serif font-bold text-2xl text-navy mb-4">{t(service.titleKey)}</h3>
                <p className="text-text-secondary leading-relaxed">{t(service.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
