import { useI18n } from '../context/I18nContext';
import { Check } from 'lucide-react';

export function About() {
  const { t } = useI18n();
  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-2">{t('comp.about.title')}</h2>
          <p className="text-steel-blue text-lg">{t('comp.about.sub')}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-lg text-charcoal mb-6">
              {t('comp.about.desc')}
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <Check className="text-gold w-5 h-5 shrink-0" />
                <span>{t('comp.about.vals1')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-gold w-5 h-5 shrink-0" />
                <span>{t('comp.about.vals2')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="text-gold w-5 h-5 shrink-0" />
                <span>{t('comp.about.vision')}</span>
              </li>
            </ul>
            <a href="#" className="inline-block bg-gold text-white px-8 py-3 rounded font-semibold uppercase tracking-wide hover:bg-navy hover:-translate-y-0.5 hover:shadow-lg transition-all">
              {t('comp.about.learn')}
            </a>
          </div>
          <div 
            className="bg-light-gray rounded-lg h-[300px]"
            style={{
              backgroundImage: `linear-gradient(45deg, var(--color-concrete-gray) 25%, transparent 25%), linear-gradient(-45deg, var(--color-concrete-gray) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--color-concrete-gray) 75%), linear-gradient(-45deg, transparent 75%, var(--color-concrete-gray) 75%)`,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}
          ></div>
        </div>
      </div>
    </section>
  );
}
