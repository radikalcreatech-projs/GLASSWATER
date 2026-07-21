import { useI18n } from '../context/I18nContext';
import { ArrowRight } from 'lucide-react';

export function Projects() {
  const { t } = useI18n();
  const projects = [
    {
      title: 'Commercial Office Tower',
      subtitle: 'Accra Financial Hub',
      desc: 'Full interior fit‑out and MEP works',
      tag: 'Commercial',
    },
    {
      title: 'Hospitality Renovation',
      subtitle: 'Labadi Beach Resort',
      desc: 'Complete refurbishment and swimming pool engineering',
      tag: 'Hospitality',
    },
    {
      title: 'Industrial Warehouse',
      subtitle: 'Tema Industrial Park',
      desc: 'Construction, waterproofing and finishing',
      tag: 'Industrial',
    },
  ];

  return (
    <section id="projects" className="py-20 bg-light-gray">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-2">{t('comp.projects.title')}</h2>
          <p className="text-steel-blue text-lg">{t('comp.projects.sub')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj, idx) => (
            <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm hover:-translate-y-1.5 hover:shadow-lg transition-all group">
              <div 
                className="h-48 flex items-center justify-center text-white font-medium text-lg relative"
                style={{
                  backgroundImage: 'linear-gradient(135deg, var(--color-steel-blue) 0%, var(--color-navy) 100%)'
                }}
              >
                {proj.subtitle}
              </div>
              <div className="p-6">
                <h3 className="font-sans font-semibold text-navy text-xl">{proj.title}</h3>
                <p className="text-steel-blue text-[0.95rem] mt-1.5 mb-3">{proj.desc}</p>
                <span className="inline-block bg-light-gray px-3 py-1 rounded-full text-xs font-semibold text-steel-blue mb-3">
                  {proj.tag}
                </span>
                <div className="mt-2">
                  <a href="#" className="inline-flex items-center gap-1.5 text-gold font-semibold hover:text-navy transition-colors">
                    View Details <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
