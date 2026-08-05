import { useI18n } from '../context/I18nContext';
import { getAboutPage } from '../cms';

export function AboutPage() {
  const { t, lang } = useI18n();
  const cms = getAboutPage(lang);

  return (
    <div className="animate-in fade-in duration-500">
      <section className="py-6 md:py-10 px-4 md:px-6 border border-gold m-3 sm:m-4 lg:m-6 rounded-xl bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="uppercase tracking-[0.3em] text-gold text-xs font-semibold mb-4">{t('about.label')}</h2>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4 leading-tight">{cms.title}</h1>
            <p className="text-base sm:text-lg text-steel-blue max-w-4xl mx-auto leading-relaxed line-clamp-4 md:line-clamp-none">
              {cms.description}
            </p>
          </div>

          <div className="mb-8 md:mb-10">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy mb-6 text-center">{t('about.values')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {cms.values.map((val, i) => (
                <div key={val} className="relative p-4 md:p-6 rounded-lg text-center overflow-hidden group"
                  style={{ background: i % 2 === 0 ? 'var(--color-navy)' : 'var(--color-steel-blue)' }}
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gold rounded-l-lg" />
                  <div className="font-serif font-bold text-sm md:text-base text-white leading-snug">
                    {val}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center max-w-4xl mx-auto bg-light-gray p-6 md:p-12 rounded-lg shadow-custom">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy mb-4">{cms.visionTitle}</h2>
            <p className="text-base md:text-xl text-steel-blue font-light leading-relaxed italic">
              "{cms.visionText}"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}