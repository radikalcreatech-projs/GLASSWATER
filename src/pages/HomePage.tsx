import { useEffect, useState, useRef } from 'react';
import type { Key } from 'react';
import { useI18n } from '../context/I18nContext';
import { useNavigation } from '../context/NavigationContext';
import { CheckCircle2, Building2, Star, ArrowRight } from 'lucide-react';
import { getProjects, getPosts, defaultReviews } from '../data';
import { getHomeHero, getHomeAbout } from '../cms';
import { RainCanvas } from '../components/RainCanvas';

type Project = { id: string; title: string; category: string; description: string; image: string; [key: string]: unknown };
type Post = { slug: string; title: string; date: string; excerpt: string; category: string; coverImage: string; content: string; [key: string]: unknown };

/** Lazy-loading project card for the home page */
function LazyProjectCard({ p, onClick }: { key?: Key; p: Project; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [bgUrl, setBgUrl] = useState('');

  useEffect(() => {
    const el = ref.current;
    if (!el || !p.image) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setBgUrl(p.image); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [p.image]);

  return (
    <div className="min-w-[85%] sm:min-w-[70%] md:min-w-0 snap-center bg-white rounded-lg overflow-hidden shadow-custom hover:-translate-y-2 transition-all cursor-pointer group" onClick={onClick}>
      <div
        ref={ref}
        className="aspect-square md:aspect-auto md:h-72 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 bg-light-gray"
        style={bgUrl ? { backgroundImage: `url('${bgUrl}')` } : undefined}
      />
      <div className="p-6 relative bg-white z-10">
        <h4 className="font-serif font-bold text-xl text-navy mb-2">{p.title}</h4>
        <p className="text-steel-blue text-[0.65rem] uppercase tracking-widest font-semibold mb-3">{p.category}</p>
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">{p.description}</p>
        <span className="inline-flex items-center gap-2 text-gold font-semibold uppercase tracking-widest text-[0.65rem] group-hover:text-navy transition-colors">
          Explore Project <ArrowRight size={14} />
        </span>
      </div>
    </div>
  );
}

/** Lazy-loading post card for the home page */
function LazyPostCard({ post, onClick }: { key?: Key; post: Post; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [bgUrl, setBgUrl] = useState('');

  useEffect(() => {
    const el = ref.current;
    if (!el || !post.coverImage) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setBgUrl(post.coverImage); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [post.coverImage]);

  return (
    <div className="min-w-[85%] sm:min-w-[70%] md:min-w-0 snap-center group cursor-pointer" onClick={onClick}>
      <div ref={ref} className="overflow-hidden rounded-lg mb-4 shadow-custom">
        <div
          className="aspect-square bg-cover bg-center transition-transform duration-700 group-hover:scale-105 bg-light-gray"
          style={bgUrl ? { backgroundImage: `url('${bgUrl}')` } : undefined}
        />
      </div>
      <div className="text-[0.65rem] uppercase tracking-widest text-gold font-semibold mb-2">{post.category}</div>
      <h4 className="font-serif font-bold text-xl text-navy mb-2 group-hover:text-gold transition-colors">{post.title}</h4>
      <p className="text-text-secondary text-sm mb-4 leading-relaxed line-clamp-2">{post.excerpt}</p>
      <span className="inline-flex items-center gap-2 text-navy font-semibold uppercase tracking-widest text-[0.65rem] group-hover:text-gold transition-colors">
        Read Article <ArrowRight size={14} />
      </span>
    </div>
  );
}

export function HomePage() {
  const { t, lang } = useI18n();
  const { navigate } = useNavigation();
  const [reviews, setReviews] = useState<any[]>([]);
  const [localProjects, setLocalProjects] = useState(getProjects(lang));
  const [localPosts, setLocalPosts] = useState(getPosts(lang));
  const hero = getHomeHero(lang);
  const homeAbout = getHomeAbout(lang);

  useEffect(() => {
    const saved = localStorage.getItem('glasswater_reviews');
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) { console.error('Failed to load reviews:', e); }
    } else {
      setReviews(defaultReviews);
      localStorage.setItem('glasswater_reviews', JSON.stringify(defaultReviews));
    }
    try {
      const p = localStorage.getItem("glasswater_projects");
      if (p) {
        const parsed = JSON.parse(p);
        if (Array.isArray(parsed)) {
          setLocalProjects([...parsed.filter((p: any) => !getProjects(lang).find(dp => dp.id === p.id)), ...getProjects(lang)]);
        } else {
          setLocalProjects(getProjects(lang));
        }
      } else { setLocalProjects(getProjects(lang)); }
    } catch (e) { console.error('Failed to load projects:', e); setLocalProjects(getProjects(lang)); }
    try {
      const postsStr = localStorage.getItem("glasswater_posts");
      if (postsStr) {
        const parsed = JSON.parse(postsStr);
        if (Array.isArray(parsed)) {
          setLocalPosts([...parsed.filter((p: any) => !getPosts(lang).find(dp => dp.slug === p.slug)), ...getPosts(lang)]);
        } else {
          setLocalPosts(getPosts(lang));
        }
      } else { setLocalPosts(getPosts(lang)); }
    } catch (e) { console.error('Failed to load posts:', e); setLocalPosts(getPosts(lang)); }
  }, [lang]);

  return (
    <div className="bg-white">
      {/* Cinematic Hero */}
      <section className="relative h-auto md:h-[80vh] min-h-[380px] md:min-h-[500px] py-10 md:py-20 flex items-center justify-center px-4 md:px-6 overflow-hidden border border-gold m-3 sm:m-4 lg:m-6 rounded-xl">
        {/* Background Rain Effect */}
        <div className="absolute inset-0 z-0">
          <RainCanvas />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-body to-transparent opacity-90 pointer-events-none"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center my-4 md:my-10">
          <h1 
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-navy leading-tight mb-4 md:mb-8"
            dangerouslySetInnerHTML={{ __html: hero.headingHtml }}
          />
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-steel-blue mb-5 md:mb-12 font-light max-w-3xl mx-auto leading-relaxed line-clamp-3 md:line-clamp-none">
            {hero.subheading}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-6">
            <button 
              onClick={() => navigate('contact')}
              className="w-full sm:w-auto bg-gold text-white px-5 py-3 md:px-10 md:py-4 rounded font-semibold uppercase tracking-wider md:tracking-widest hover:bg-navy transition-all shadow-custom text-xs md:text-sm"
            >
              {hero.cta1Text}
            </button>
            <button 
              onClick={() => navigate('projects')}
              className="w-full sm:w-auto bg-white/80 backdrop-blur border border-navy/20 text-navy px-5 py-3 md:px-10 md:py-4 rounded font-semibold uppercase tracking-wider md:tracking-widest hover:bg-navy hover:text-white transition-all shadow-custom text-xs md:text-sm"
            >
              {hero.cta2Text}
            </button>
          </div>
        </div>
      </section>

      {/* Trusted By / Statistics */}
      <section className="bg-navy border border-gold m-3 sm:m-4 lg:m-6 rounded-xl text-white py-5 md:py-10 text-center relative z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto px-2 md:px-4 grid grid-cols-3 gap-1 sm:gap-2 md:gap-8">
          <div className="flex flex-col items-center justify-center gap-1 md:gap-2">
            <CheckCircle2 className="text-gold w-4.5 h-4.5 md:w-8 md:h-8" /> 
            <span className="font-serif text-lg sm:text-2xl md:text-3xl font-bold">{hero.statsProjects}</span>
            <span className="text-steel-blue uppercase tracking-widest text-[0.5rem] sm:text-[0.65rem] md:text-xs font-semibold">{hero.statsProjectsLabel}</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 md:gap-2">
            <Building2 className="text-gold w-4.5 h-4.5 md:w-8 md:h-8" /> 
            <span className="font-serif text-lg sm:text-2xl md:text-3xl font-bold">{hero.statsCommercial}</span>
            <span className="text-steel-blue uppercase tracking-widest text-[0.5rem] sm:text-[0.65rem] md:text-xs font-semibold">{hero.statsCommercialLabel}</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 md:gap-2">
            <Star className="text-gold w-4.5 h-4.5 md:w-8 md:h-8" /> 
            <span className="font-serif text-lg sm:text-2xl md:text-3xl font-bold">{hero.statsSatisfaction}</span>
            <span className="text-steel-blue uppercase tracking-widest text-[0.5rem] sm:text-[0.65rem] md:text-xs font-semibold">{hero.statsSatisfactionLabel}</span>
          </div>
        </div>
      </section>

      {/* About Section - Lots of whitespace */}
      <section className="py-8 md:py-12 px-4 bg-white border border-gold m-3 sm:m-4 lg:m-6 rounded-xl">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="uppercase tracking-[0.3em] text-gold text-xs font-semibold mb-4">{t('home.about_label')}</h2>
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4 leading-tight">
            {homeAbout.heading}
          </h3>
          <p className="text-base md:text-lg text-steel-blue max-w-3xl mx-auto leading-relaxed mb-6 line-clamp-4 md:line-clamp-none">
            {homeAbout.description}
          </p>
          <button 
            onClick={() => navigate('about')}
            className="bg-transparent border border-gold text-gold px-8 py-3 rounded font-semibold uppercase tracking-widest hover:bg-gold hover:text-white transition-all text-xs"
          >
            {homeAbout.readMoreLabel}
          </button>
        </div>
      </section>

      {/* Featured Projects - Large Images */}
      <section className="py-8 md:py-12 px-4 md:px-6 bg-light-gray border border-gold m-3 sm:m-4 lg:m-6 rounded-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div>
              <h2 className="uppercase tracking-[0.3em] text-gold text-xs font-semibold mb-2">{t('home.feat_work')}</h2>
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-navy">{t('home.prem_proj')}</h3>
            </div>
            <button 
              onClick={() => navigate('projects')}
              className="group flex items-center gap-2 text-navy text-xs font-semibold uppercase tracking-widest hover:text-gold transition-colors"
            >
              View Portfolio <ArrowRight className="group-hover:translate-x-1 transition-transform w-4 h-4" />
            </button>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible no-scrollbar">
            {localProjects.slice(0, 3).map(p => (
              <LazyProjectCard key={p.id} p={p as Project} onClick={() => { const slug = (p as any).slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'); window.location.hash = `#project?slug=${slug}`; }} />
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      {reviews.length > 0 && (
        <section className="py-8 md:py-12 px-4 md:px-6 bg-navy text-white border border-gold m-3 sm:m-4 lg:m-6 rounded-xl">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="uppercase tracking-[0.3em] text-gold text-xs font-semibold mb-2">{t('home.testi')}</h2>
              <h3 className="font-serif text-3xl md:text-4xl font-bold">{t('home.client_feed')}</h3>
            </div>
            
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible no-scrollbar">
              {reviews.slice(0, 3).map((r, i) => (
                <div key={i} className="min-w-[85%] sm:min-w-[70%] md:min-w-0 snap-center bg-white/5 border border-white/10 p-6 md:p-8 rounded-lg shadow-custom relative">
                  <div className="text-gold text-xl tracking-widest mb-3">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}
                  </div>
                  <p className="text-light-gray/90 mb-4 text-sm md:text-base italic leading-relaxed font-light">"{r.text}"</p>
                  <div>
                    <h4 className="font-serif font-bold text-lg">{r.name}</h4>
                    {r.location && <p className="text-gold text-[0.65rem] uppercase tracking-widest font-semibold mt-1">{r.location}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button 
                onClick={() => navigate('reviews')}
                className="bg-gold text-white px-6 py-2.5 rounded font-semibold uppercase tracking-widest hover:bg-white hover:text-navy transition-all shadow-custom cursor-pointer text-[0.75rem]"
              >
                Write a Review
              </button>
              <button 
                onClick={() => navigate('reviews')}
                className="bg-white/10 border border-white/20 text-white px-6 py-2.5 rounded font-semibold uppercase tracking-widest hover:bg-gold hover:text-white transition-all shadow-custom cursor-pointer text-[0.75rem]"
              >
                View All Reviews
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Insights */}
      <section className="py-8 md:py-12 px-4 md:px-6 bg-white border border-gold m-3 sm:m-4 lg:m-6 rounded-xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="uppercase tracking-[0.3em] text-gold text-xs font-semibold mb-2">Insights & News</h2>
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-navy">{t('home.know_centre')}</h3>
          </div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible no-scrollbar">
            {localPosts.slice(0, 3).map(post => (
              <LazyPostCard key={post.slug} post={post as Post} onClick={() => navigate('post', post.slug)} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}