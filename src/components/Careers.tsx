import { useI18n } from '../context/I18nContext';
export function Careers() {
  const { t } = useI18n();
  const jobs = [
    { title: 'Senior Project Manager', location: 'Accra, Ghana' },
    { title: 'Interior Designer (Fit‑Out)', location: 'Accra, Ghana' },
    { title: 'Facilities Management Engineer', location: 'Kumasi, Ghana' },
  ];

  return (
    <section id="careers" className="py-20 bg-light-gray">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-2">{t('comp.careers.title')}</h2>
          <p className="text-steel-blue text-lg">{t('comp.careers.sub')}</p>
        </div>
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {jobs.map((job, idx) => (
            <div key={idx} className="bg-white p-5 px-6 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-sm transition-shadow border border-transparent hover:border-gray-200">
              <div>
                <h4 className="font-sans font-semibold text-navy text-lg">{job.title}</h4>
                <span className="text-steel-blue text-[0.95rem]">{job.location}</span>
              </div>
              <a href="#" className="bg-gold text-white px-5 py-2 rounded font-semibold text-sm hover:bg-navy transition-colors whitespace-nowrap">
                Apply Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
