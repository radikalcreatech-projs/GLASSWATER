import { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { useNavigation } from '../context/NavigationContext';
import { useSettings } from '../context/SettingsContext';
import { getProjects } from '../data';
import { ArrowLeft, MapPin, Calendar, Banknote, MessageCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { safeCssUrl } from '../utils/safeCssUrl';
import { sanitizeWhatsAppUrl } from '../utils/url';

function parseProjectSlug(): string | null {
  const raw = window.location.hash;
  const queryIndex = raw.indexOf('?');
  if (queryIndex === -1) return null;
  const queryString = raw.substring(queryIndex + 1);
  const params = new URLSearchParams(queryString);
  return params.get('slug');
}

export function ProjectDetailPage() {
  const { t, lang } = useI18n();
  const { navigate } = useNavigation();
  const { settings } = useSettings();
  const [project, setProject] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gallery = (project as any)?.gallery || [];

  useEffect(() => {
    const slug = parseProjectSlug();
    if (!slug) {
      setNotFound(true);
      return;
    }

    // Try localStorage first, then fall back to defaults
    const saved = localStorage.getItem('glasswater_projects');
    let allProjects = getProjects(lang);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        allProjects = [...parsed, ...allProjects.filter((p: any) => !parsed.find((op: any) => op.id === p.id))];
      } catch { /* use defaults */ }
    }

    const found = allProjects.find((p: any) => p.slug === slug);
    if (found) {
      setProject(found);
    } else {
      setNotFound(true);
    }
  }, [lang]);

  if (notFound || !project) {
    return (
      <div className="py-24 px-6 text-center">
        <h1 className="font-serif text-3xl font-bold text-navy mb-4">Project Not Found</h1>
        <p className="text-text-secondary mb-8">The case study you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('projects')} className="bg-gold text-white px-8 py-3 rounded font-semibold uppercase tracking-widest hover:bg-navy transition-colors cursor-pointer">
          {t('project.back_to_portfolio')}
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Banner */}
      <div
        className="h-[40vh] md:h-[50vh] bg-cover bg-center relative flex items-end"
        style={{ backgroundImage: `url('${safeCssUrl(project.image)}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-8 md:pb-12 w-full">
          <button
            onClick={() => navigate('projects')}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold uppercase tracking-widest text-xs transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft size={16} /> {t('project.back_to_portfolio')}
          </button>
          <span className="inline-block bg-gold text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-widest mb-3">
            {project.category}
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white">{project.title}</h1>
        </div>
      </div>

      {/* Meta Bar */}
      <div className="bg-navy text-white py-6">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <Banknote size={20} className="text-gold" />
            <div>
              <div className="text-xs uppercase tracking-widest text-light-gray/60">{t('projects.value')}</div>
              <div className="font-bold">{project.value ?? '—'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-gold" />
            <div>
              <div className="text-xs uppercase tracking-widest text-light-gray/60">{t('projects.duration')}</div>
              <div className="font-bold">{project.duration ?? '—'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={20} className="text-gold" />
            <div>
              <div className="text-xs uppercase tracking-widest text-light-gray/60">Location</div>
              <div className="font-bold">{project.category} Sector, Ghana</div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Study Content */}
      <section className="py-10 md:py-16 px-6 border border-gold m-3 sm:m-4 lg:m-6 rounded-xl bg-white">
        <div className="max-w-3xl mx-auto">
          {project.content ? (
            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-navy prose-headings:mt-8 prose-headings:mb-4 prose-p:text-text-secondary prose-p:leading-relaxed prose-li:text-text-secondary prose-li:leading-relaxed prose-strong:text-navy prose-em:text-steel-blue"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          ) : (
            <div className="text-center py-16 text-text-secondary">
              <p className="text-lg">Detailed case study content coming soon.</p>
              <p className="text-sm mt-2">Our team is currently preparing the full project documentation.</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 pt-10 border-t border-light-gray text-center">
            <p className="text-text-secondary mb-6">Interested in a similar project? Let's discuss your requirements.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href={`${sanitizeWhatsAppUrl(settings.whatsapp)}?text=${encodeURIComponent(`Hi Glasswater, I'm interested in the "${project.title}" case study. Can I get a quote or more information?`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] text-white px-10 py-4 rounded font-semibold uppercase tracking-widest hover:bg-[#128C7E] transition-colors shadow-custom cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} /> Inquire on WhatsApp
              </a>
              <button
                onClick={() => navigate('contact')}
                className="bg-gold text-white px-10 py-4 rounded font-semibold uppercase tracking-widest hover:bg-navy transition-colors shadow-custom cursor-pointer"
              >
                Start Your Project
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Strip */}
      {gallery.length > 0 && (
        <section className="py-8 px-6 m-3 sm:m-4 lg:m-6">
          <div className="max-w-7xl mx-auto">
            <h3 className="font-serif text-2xl font-bold text-navy mb-6">Project Gallery</h3>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar">
              {gallery.map((url: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="shrink-0 snap-center cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img
                    src={url}
                    alt={`${project.title} - Photo ${idx + 1}`}
                    className="h-48 md:h-64 w-auto rounded-lg object-cover bg-light-gray"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && gallery.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-[4000] flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white cursor-pointer z-10"
          >
            <X size={32} />
          </button>

          {gallery.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : gallery.length - 1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white cursor-pointer z-10"
            >
              <ChevronLeft size={40} />
            </button>
          )}

          <img
            src={gallery[lightboxIndex]}
            alt={`${project.title} - Photo ${lightboxIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {gallery.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex < gallery.length - 1 ? lightboxIndex + 1 : 0); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white cursor-pointer z-10"
            >
              <ChevronRight size={40} />
            </button>
          )}

          <div className="absolute bottom-6 text-white/60 text-sm">
            {lightboxIndex + 1} / {gallery.length}
          </div>
        </div>
      )}
    </div>
  );
}
