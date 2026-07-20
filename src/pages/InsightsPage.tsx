import { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { useNavigation } from '../context/NavigationContext';
import { posts as defaultPosts } from '../data';
import { ArrowRight } from 'lucide-react';

export function InsightsPage() {
  const { t } = useI18n();
  const { navigate } = useNavigation();
  const [posts, setPosts] = useState(defaultPosts);

  useEffect(() => {
    const saved = localStorage.getItem('glasswater_posts');
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="py-6 md:py-10 px-4 md:px-6 border border-gold m-3 sm:m-4 lg:m-6 rounded-xl bg-white">
        <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 max-w-3xl mx-auto">
          <h2 className="uppercase tracking-[0.3em] text-gold text-xs font-semibold mb-2">Insights & News</h2>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4">Knowledge Centre</h1>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed">Industry trends, company updates, and expert perspectives.</p>
        </div>
        
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible no-scrollbar">
          {posts.map(post => (
            <div 
              key={post.slug} 
              className="min-w-[85%] sm:min-w-[70%] md:min-w-0 snap-center group cursor-pointer"
              onClick={() => navigate('post', post.slug)}
            >
              <div className="relative aspect-square md:aspect-auto md:h-72 mb-4 overflow-hidden rounded-lg">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${post.coverImage}')` }}
                />
                <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-500" />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-navy rounded shadow">
                  {post.category}
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold text-navy mb-2 group-hover:text-gold transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-text-secondary text-sm mb-4 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-gold">{post.date}</span>
                <span className="text-navy group-hover:translate-x-2 transition-transform">
                  <ArrowRight size={16} />
                </span>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>
    </div>
  );
}
