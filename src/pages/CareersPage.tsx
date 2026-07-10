import { useI18n } from '../context/I18nContext';
import { Info } from 'lucide-react';

export function CareersPage() {
  const { t } = useI18n();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <section className="py-8 md:py-12 px-6 max-w-7xl mx-auto">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy mb-6 md:mb-8 text-center">{t('careers.title')}</h1>
        
        <div className="bg-bg-section p-10 md:p-16 rounded-lg text-center max-w-3xl mx-auto shadow-sm">
          <Info className="w-16 h-16 text-gold mx-auto mb-6" />
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">{t('careers.novac')}</h2>
          <p className="text-xl text-text-secondary mb-6 leading-relaxed">
            {t('careers.novacp')}
          </p>
          <p 
            className="text-lg text-text-primary"
            dangerouslySetInnerHTML={{ __html: t('careers.cv') }}
          />
        </div>
      </section>
    </div>
  );
}
