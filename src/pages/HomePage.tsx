import { useEffect, useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { useNavigation } from '../context/NavigationContext';
import { CheckCircle2, Building2, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { projects, posts, defaultReviews } from '../data';
import { RainCanvas } from '../components/RainCanvas';

export function HomePage() {
  const { t } = useI18n();
  const { navigate } = useNavigation();
  const [reviews, setReviews] = useState<any[]>([]);
  const [localProjects, setLocalProjects] = useState(projects);
  const [localPosts, setLocalPosts] = useState(posts);

  useEffect(() => {
    const saved = localStorage.getItem('glasswater_reviews');
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) {}
    } else {
      setReviews(defaultReviews);
      localStorage.setItem('glasswater_reviews', JSON.stringify(defaultReviews));
    }
    try {
      const p = localStorage.getItem("glasswater_projects");
      if (p) setLocalProjects(JSON.parse(p));
    } catch (e) {}
    try {
      const postsStr = localStorage.getItem("glasswater_posts");
      if (postsStr) setLocalPosts(JSON.parse(postsStr));
    } catch (e) {}
  }, []);

  return (
    <div className="bg-white">
      {/* Cinematic Hero */}
      <section className="relative h-[80vh] min-h-[500px] py-20 flex items-center justify-center px-6 overflow-hidden border border-gold m-3 sm:m-4 lg:m-6 rounded-xl">
        {/* Background Rain Effect */}
        <div className="absolute inset-0 z-0">
          <RainCanvas />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-body to-transparent opacity-90 pointer-events-none"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center mt-10">
          <h1 
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-navy leading-tight mb-6 md:mb-8"
            dangerouslySetInnerHTML={{ __html: t('home.hero.title') }}
          />
          <p className="text-xl sm:text-2xl text-steel-blue mb-6 md:mb-8 md:mb-12 font-light max-w-3xl mx-auto leading-relaxed">
            {t('home.hero.sub')}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={() => navigate('contact')}
              className="bg-gold text-white px-10 py-4 rounded font-semibold uppercase tracking-widest hover:bg-navy transition-all shadow-custom"
            >
              {t('home.hero.cta1')}
            </button>
            <button 
              onClick={() => navigate('projects')}
              className="bg-white/80 backdrop-blur border border-navy/20 text-navy px-10 py-4 rounded font-semibold uppercase tracking-widest hover:bg-navy hover:text-white transition-all shadow-custom"
            >
              {t('home.hero.cta2')}
            </button>
          </div>
        </div>
      </section>

      {/* Trusted By / Statistics */}
      <section className="bg-navy border border-gold m-3 sm:m-4 lg:m-6 rounded-xl text-white py-6 text-center relative z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="flex flex-col items-center justify-center gap-3">
            <CheckCircle2 className="text-gold w-8 h-8" /> 
            <span className="font-serif text-3xl font-bold">150+</span>
            <span className="text-steel-blue uppercase tracking-widest text-xs font-semibold">Projects Completed</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-3">
            <Building2 className="text-gold w-8 h-8" /> 
            <span className="font-serif text-3xl font-bold">50+</span>
            <span className="text-steel-blue uppercase tracking-widest text-xs font-semibold">Commercial & Industrial</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-3">
            <Star className="text-gold w-8 h-8" /> 
            <span className="font-serif text-3xl font-bold">98%</span>
            <span className="text-steel-blue uppercase tracking-widest text-xs font-semibold">Client Satisfaction</span>
          </div>
        </div>
      </section>

      {/* About Section - Lots of whitespace */}
      <section className="py-10 md:py-16 px-6 bg-white border border-gold m-3 sm:m-4 lg:m-6 rounded-xl">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="uppercase tracking-[0.3em] text-gold text-sm font-semibold mb-6">About Us</h2>
          <h3 className="font-serif text-4xl sm:text-5xl font-bold text-navy mb-6 md:mb-8 leading-tight">
            Building the Future with Precision
          </h3>
          <p className="text-lg text-steel-blue max-w-3xl mx-auto leading-relaxed mb-6 md:mb-8 md:mb-12">
            {t('about.desc')}
          </p>
          <button 
            onClick={() => navigate('about')}
            className="bg-transparent border border-gold text-gold px-10 py-4 rounded font-semibold uppercase tracking-widest hover:bg-gold hover:text-white transition-all"
          >
            {t('home.quick.read')}
          </button>
        </div>
      </section>

      {/* Featured Projects - Large Images */}
      <section className="py-10 md:py-16 px-6 bg-light-gray border border-gold m-3 sm:m-4 lg:m-6 rounded-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 md:mb-8 gap-6">
            <div>
              <h2 className="uppercase tracking-[0.3em] text-gold text-sm font-semibold mb-4">Featured Work</h2>
              <h3 className="font-serif text-4xl sm:text-5xl font-bold text-navy">Premium Projects</h3>
            </div>
            <button 
              onClick={() => navigate('projects')}
              className="group flex items-center gap-3 text-navy font-semibold uppercase tracking-widest hover:text-gold transition-colors"
            >
              View Portfolio <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {localProjects.slice(0, 3).map(p => (
              <div key={p.id} className="bg-white rounded-lg overflow-hidden shadow-custom hover:-translate-y-2 transition-all cursor-pointer group" onClick={() => navigate('projects')}>
                <div 
                  className="h-72 md:h-96 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${p.image}')` }}
                />
                <div className="p-10 relative bg-white z-10">
                  <h4 className="font-serif font-bold text-2xl text-navy mb-3">{p.title}</h4>
                  <p className="text-steel-blue text-sm uppercase tracking-widest font-semibold mb-6">{p.category}</p>
                  <p className="text-text-secondary mb-6 md:mb-8 line-clamp-2">{p.description}</p>
                  <span className="inline-flex items-center gap-2 text-gold font-semibold uppercase tracking-widest text-sm group-hover:text-navy transition-colors">
                    Explore Project <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      {reviews.length > 0 && (
        <section className="py-10 md:py-16 px-6 bg-navy text-white border border-gold m-3 sm:m-4 lg:m-6 rounded-xl">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="uppercase tracking-[0.3em] text-gold text-sm font-semibold mb-4">Testimonials</h2>
              <h3 className="font-serif text-4xl sm:text-5xl font-bold">Client Feedback</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {reviews.slice(0, 3).map((r, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-lg shadow-custom relative">
                  <div className="text-gold text-2xl tracking-widest mb-4">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}
                  </div>
                  <p className="text-light-gray/90 mb-6 md:mb-8 text-lg italic leading-relaxed font-light">"{r.text}"</p>
                  <div>
                    <h4 className="font-serif font-bold text-xl">{r.name}</h4>
                    {r.location && <p className="text-gold text-xs uppercase tracking-widest font-semibold mt-2">{r.location}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => navigate('reviews')}
                className="bg-gold text-white px-8 py-3.5 rounded font-semibold uppercase tracking-widest hover:bg-white hover:text-navy transition-all shadow-custom cursor-pointer text-sm"
              >
                Write a Review
              </button>
              <button 
                onClick={() => navigate('reviews')}
                className="bg-white/10 border border-white/20 text-white px-8 py-3.5 rounded font-semibold uppercase tracking-widest hover:bg-gold hover:text-white transition-all shadow-custom cursor-pointer text-sm"
              >
                View All Reviews
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Insights */}
      <section className="py-10 md:py-16 px-6 bg-white border border-gold m-3 sm:m-4 lg:m-6 rounded-xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="uppercase tracking-[0.3em] text-gold text-sm font-semibold mb-4">Insights & News</h2>
            <h3 className="font-serif text-4xl sm:text-5xl font-bold text-navy">Knowledge Centre</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {localPosts.slice(0, 3).map(post => (
              <div 
                key={post.slug} 
                className="group cursor-pointer"
                onClick={() => navigate('post', post.slug)}
              >
                <div className="overflow-hidden rounded-lg mb-6 md:mb-8 shadow-custom">
                  <div 
                    className="h-72 md:h-96 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${post.coverImage}')` }}
                  />
                </div>
                <div className="text-sm uppercase tracking-widest text-gold font-semibold mb-4">
                  {post.category}
                </div>
                <h4 className="font-serif font-bold text-2xl text-navy mb-4 group-hover:text-gold transition-colors">{post.title}</h4>
                <p className="text-text-secondary text-lg mb-6 leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-navy font-semibold uppercase tracking-widest text-sm group-hover:text-gold transition-colors">
                  Read Article <ArrowRight size={16} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
