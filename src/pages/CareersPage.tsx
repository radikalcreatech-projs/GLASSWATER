import { useI18n } from '../context/I18nContext';
import { getCareers } from '../cms';
import { Info, Briefcase } from 'lucide-react';

export function CareersPage() {
  const { t, lang } = useI18n();
  const cms = getCareers(lang);
  const hasOpenVacancies = cms.vacancies.some(v => v.isOpen);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <section className="py-8 md:py-12 px-6 max-w-7xl mx-auto">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy mb-6 md:mb-8 text-center">{cms.title}</h1>
        
        {hasOpenVacancies ? (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {cms.vacancies.filter(v => v.isOpen).map((vacancy) => (
              <div key={vacancy.id} className="bg-bg-section p-6 md:p-8 rounded-lg shadow-sm border border-light-gray">
                <div className="flex items-start gap-4">
                  <Briefcase className="w-8 h-8 text-gold shrink-0 mt-1" />
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-navy mb-2">{vacancy.title}</h2>
                    <p className="text-text-secondary leading-relaxed">{vacancy.description}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-center mt-4">
              <p 
                className="text-lg text-text-primary"
                dangerouslySetInnerHTML={{ __html: cms.cvEmailText }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-bg-section p-10 md:p-16 rounded-lg text-center max-w-3xl mx-auto shadow-sm">
            <Info className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="font-serif text-3xl font-bold text-navy mb-4">{cms.noVacanciesTitle}</h2>
            <p className="text-xl text-text-secondary mb-6 leading-relaxed">
              {cms.noVacanciesText}
            </p>
            <p 
              className="text-lg text-text-primary"
              dangerouslySetInnerHTML={{ __html: cms.cvEmailText }}
            />
          </div>
        )}
      </section>
    </div>
  );
}