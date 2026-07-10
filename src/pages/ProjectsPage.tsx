import { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { projects as defaultProjects } from '../data';
import { ArrowRight } from 'lucide-react';

export function ProjectsPage() {
  const { t } = useI18n();
  const [projects, setProjects] = useState(defaultProjects);

  useEffect(() => {
    const saved = localStorage.getItem('glasswater_projects');
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="py-8 md:py-12 px-6 border border-gold m-3 sm:m-4 lg:m-6 rounded-xl bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 md:mb-10 max-w-3xl mx-auto">
            <h2 className="uppercase tracking-[0.3em] text-gold text-sm font-semibold mb-4">Portfolio</h2>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-navy mb-6 md:mb-8">{t('projects.title')}</h1>
            <p className="text-xl text-text-secondary leading-relaxed">{t('projects.sub')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {projects.map(p => (
            <div key={p.id} className="bg-white rounded-lg overflow-hidden shadow-custom hover:-translate-y-2 transition-all cursor-pointer group">
              <div 
                className="h-72 md:h-96 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${p.image}')` }}
              />
              <div className="p-10 relative bg-white z-10">
                <div className="text-sm uppercase tracking-widest text-gold font-semibold mb-4 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-gold"></span>
                  {p.category}
                </div>
                <h3 className="font-serif text-2xl font-bold text-navy mb-4 group-hover:text-gold transition-colors">{p.title}</h3>
                <p className="text-text-secondary leading-relaxed mb-8">{p.desc}</p>
                
                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-light-gray/50 mb-8">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-text-secondary mb-1">Value</div>
                    <div className="font-bold text-navy">{p.value}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-text-secondary mb-1">Duration</div>
                    <div className="font-bold text-navy">{p.duration}</div>
                  </div>
                </div>
                <div className="flex items-center text-gold font-semibold uppercase tracking-widest text-sm group-hover:translate-x-2 transition-transform">
                  View Case Study <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>
    </div>
  );
}
