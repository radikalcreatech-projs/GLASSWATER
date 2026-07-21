import { useI18n } from '../context/I18nContext';
export function Industries() {
  const { t } = useI18n();
  const industries = [
    'Commercial',
    'Hospitality',
    'Healthcare',
    'Education',
    'Government',
    'Residential',
    'Industrial'
  ];

  return (
    <section id="industries" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-2">{t('comp.industries.title')}</h2>
          <p className="text-steel-blue text-lg">{t('comp.industries.sub')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 text-center">
          {industries.map((industry) => (
            <div key={industry} className="bg-light-gray py-6 px-4 rounded-lg font-semibold text-navy transition-all hover:bg-navy hover:text-white hover:scale-105 cursor-default">
              {industry}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
