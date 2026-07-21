import { useI18n } from '../context/I18nContext';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { projects, posts, faqs } from '../data';

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const { navigate } = useNavigation();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const performSearch = () => {
    const results = [];
    const q = query.toLowerCase().trim();
    if (!q) return results;

    // Search projects
    projects.forEach(p => {
      if (p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) {
        results.push({ type: 'Project', title: p.title, desc: p.description, link: 'projects', slug: null });
      }
    });
    // Search services
    const serviceNames = ['Engineering Services', 'Construction Services', 'Interior Fit‑Out', 'Finishing Works', 'Waterproofing & Protection', 'Swimming Pool Engineering', 'Facilities Management'];
    serviceNames.forEach(s => {
      if (s.toLowerCase().includes(q)) {
        results.push({ type: 'Service', title: s, desc: 'Learn more about this service.', link: 'services', slug: null });
      }
    });
    // Search blog posts
    posts.forEach(p => {
      if (p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) {
        results.push({ type: 'Article', title: p.title, desc: p.excerpt, link: 'insights', slug: p.slug });
      }
    });
    // Search FAQs
    faqs.forEach(f => {
      if (f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)) {
        results.push({ type: 'FAQ', title: f.q, desc: f.a, link: 'faq', slug: null });
      }
    });
    return results;
  };

  const results = performSearch();

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/60 z-[2000] flex justify-center items-start pt-[120px]" onClick={onClose}>
      <div className="bg-white w-[90%] max-w-[700px] rounded-lg p-6 max-h-[70vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.3)] relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-text-primary hover:text-gold transition-colors" onClick={onClose}>
          <X size={24} />
        </button>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, services, articles..." 
          className="w-full p-3.5 pr-10 border-2 border-light-gray rounded-md text-lg mb-4 focus:outline-none focus:border-gold transition-colors"
          autoFocus
        />
        <div>
          {query && results.length === 0 && (
            <p className="text-text-secondary">{t('search.no_results')}</p>
          )}
          {results.map((r, i) => (
            <div 
              key={i} 
              className="py-3 border-b border-light-gray cursor-pointer hover:bg-light-gray/50 px-2 -mx-2 rounded transition-colors"
              onClick={() => {
                if (r.link === 'insights' && r.slug) {
                  navigate('post', r.slug);
                } else {
                  navigate(r.link as any);
                }
                onClose();
              }}
            >
              <h4 className="font-sans font-semibold">{r.title}</h4>
              <p className="text-text-secondary text-sm my-1">{r.desc}</p>
              <span className="text-gold text-xs font-medium">{r.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
