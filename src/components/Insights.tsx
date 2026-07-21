import { useI18n } from '../context/I18nContext';
import { ArrowRight } from 'lucide-react';

export function Insights() {
  const { t } = useI18n();
  const insights = [
    {
      category: 'DIY Tips',
      title: 'Temporary fixes for leaky roofs',
      desc: 'Quick, safe measures to protect your property until professional help arrives.',
    },
    {
      category: 'Maintenance',
      title: 'Preventive maintenance for facility managers',
      desc: 'Extend the life of your building systems with our proven checklist.',
    },
    {
      category: 'Construction',
      title: 'Waterproofing best practices',
      desc: 'Ensure durability in West Africa’s climate with modern waterproofing techniques.',
    },
  ];

  return (
    <section id="insights" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-2">{t('comp.insights.title')}</h2>
          <p className="text-steel-blue text-lg">{t('comp.insights.sub')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insights.map((insight, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg border-l-4 border-gold shadow-sm hover:shadow-md transition-shadow">
              <div className="text-[0.75rem] uppercase tracking-widest text-gold font-semibold mb-2">
                {insight.category}
              </div>
              <h3 className="font-sans font-semibold text-lg text-navy mb-2">{insight.title}</h3>
              <p className="text-steel-blue text-[0.95rem] mb-4">
                {insight.desc}
              </p>
              <a href="#" className="inline-flex items-center gap-1.5 text-gold font-semibold text-[0.9rem] hover:text-navy transition-colors">
                Read more <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
