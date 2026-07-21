import { useI18n } from '../context/I18nContext';

export function AboutPage() {
  const { t } = useI18n();

  const values = [
    'Precision', 'Integrity', 'Safety', 'Innovation', 
    'Quality', 'Professionalism', 'Accountability', 'Reliability'
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <section className="py-6 md:py-10 px-4 md:px-6 border border-gold m-3 sm:m-4 lg:m-6 rounded-xl bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="uppercase tracking-[0.3em] text-gold text-xs font-semibold mb-4">{t('about.label')}</h2>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4 leading-tight">{t('about.title')}</h1>
            <p className="text-base sm:text-lg text-steel-blue max-w-4xl mx-auto leading-relaxed">
              {t('about.desc')}
            </p>
          </div>

          <div className="mb-8 md:mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy mb-6 text-center">{t('about.values')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {values.map(val => (
                <div key={val} className="bg-white border border-light-gray p-4 md:p-6 rounded-lg text-center shadow-custom">
                  <div className="font-serif font-bold text-sm md:text-lg text-navy">
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center max-w-4xl mx-auto bg-light-gray p-6 md:p-12 rounded-lg shadow-custom">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy mb-4">{t('about.vision')}</h2>
            <p className="text-base md:text-xl text-steel-blue font-light leading-relaxed italic">
              "{t('about.visiontext')}"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
