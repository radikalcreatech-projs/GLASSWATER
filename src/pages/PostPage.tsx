import { useI18n } from '../context/I18nContext';
import { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { getPosts } from '../data';
import { ArrowLeft } from 'lucide-react';

export function PostPage() {
  const { t, lang } = useI18n();
  const { currentPostSlug, navigate } = useNavigation();
  const [posts, setPosts] = useState(getPosts(lang));

  useEffect(() => {
    const saved = localStorage.getItem('glasswater_posts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPosts([...parsed.filter((p: any) => !posts.find(dp => dp.slug === p.slug)), ...getPosts(lang)]);
      } catch (e) { console.error('Failed to load glasswater_posts from localStorage:', e); }
    } else {
      setPosts(getPosts(lang));
    }
  }, [lang]);

  const post = getPosts(lang).find(p => p.slug === currentPostSlug);

  if (!post) {
    return (
      <div className="py-6 text-center">
        <p className="text-text-secondary text-xl mb-6">{t('post.not_found')}</p>
        <button 
          className="bg-transparent border border-gold text-gold px-10 py-4 rounded font-semibold uppercase tracking-widest hover:bg-gold hover:text-white transition-all" 
          onClick={() => navigate('insights')}
        >
          ← {t('post.back')}
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 bg-white">
      {/* Article Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end pb-20 px-6 overflow-hidden border border-gold m-3 sm:m-4 lg:m-6 rounded-xl">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${post.coverImage}')` }}
        >
          <div className="absolute inset-0 bg-navy/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-90"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
          <div className="text-sm uppercase tracking-widest text-gold font-semibold mb-6">
            {post.category} &middot; {post.date}
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <button 
            className="flex items-center gap-2 text-gold font-semibold uppercase tracking-widest mb-12 hover:-translate-x-2 transition-transform" 
            onClick={() => navigate('insights')}
          >
            <ArrowLeft size={20} /> {t('post.back')}
          </button>
          
          <div className="prose prose-lg max-w-none text-text-secondary">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('###')) {
                return <h3 key={idx} className="text-2xl font-serif font-bold text-navy mt-12 mb-6">{paragraph.replace('### ', '')}</h3>
              }
              return <p key={idx} className="mb-6 leading-relaxed">{paragraph}</p>
            })}
          </div>

          <div className="mt-20 pt-10 border-t border-light-gray flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-light-gray flex items-center justify-center text-navy font-serif font-bold text-xl">
                GW
              </div>
              <div>
                <div className="font-bold text-navy">{t('post.editorial')}</div>
                <div className="text-sm text-text-secondary">{t('post.experts')}</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button className="px-6 py-3 border border-light-gray rounded hover:border-gold hover:text-gold transition-colors font-semibold uppercase tracking-widest text-sm">
                {t('post.share')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
