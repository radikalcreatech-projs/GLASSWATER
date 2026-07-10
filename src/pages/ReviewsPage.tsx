import React from "react";
import { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';

interface Review {
  name: string;
  location: string;
  rating: number;
  text: string;
  date: number;
}

export function ReviewsPage() {
  const { t } = useI18n();
  const [reviews, setReviews] = useState<Review[]>([]);
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('glasswater_reviews');
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse reviews');
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rating || !text) {
      alert('Please fill in all required fields.');
      return;
    }
    const newReview = { name, location, rating: parseInt(rating), text, date: Date.now() };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('glasswater_reviews', JSON.stringify(updated));
    alert('Thank you for your review!');
    setName('');
    setLocation('');
    setRating('');
    setText('');
  };

  const inputClass = "w-full p-4 border border-light-gray rounded font-sans text-base mb-6 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-bg-body text-text-primary transition-all";

  return (
    <div className="animate-in fade-in duration-500">
      <section className="py-8 md:py-12 px-6 border border-gold m-3 sm:m-4 lg:m-6 rounded-xl bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 md:mb-8 max-w-2xl mx-auto">
            <h2 className="uppercase tracking-[0.3em] text-gold text-sm font-semibold mb-4">Feedback</h2>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-navy mb-6 md:mb-8">{t('reviews.title')}</h1>
            <p className="text-xl text-text-secondary leading-relaxed">{t('reviews.sub')}</p>
          </div>


        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-6 md:mb-8 md:mb-12 bg-white p-12 rounded-lg shadow-custom">
          <input type="text" placeholder="Your Name" required className={inputClass} value={name} onChange={e => setName(e.target.value)} />
          <input type="text" placeholder="Your Location (e.g., Accra)" className={inputClass} value={location} onChange={e => setLocation(e.target.value)} />
          <select required className={inputClass} value={rating} onChange={e => setRating(e.target.value)}>
            <option value="">Rating</option>
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★ (4)</option>
            <option value="3">★★★ (3)</option>
            <option value="2">★★ (2)</option>
            <option value="1">★ (1)</option>
          </select>
          <textarea rows={5} placeholder="Write your review..." required className={`${inputClass} resize-y`} value={text} onChange={e => setText(e.target.value)}></textarea>
          <button type="submit" className="bg-gold text-white px-10 py-4 rounded font-semibold uppercase tracking-widest hover:bg-navy transition-colors w-full mt-2">
            {t('reviews.submit')}
          </button>
        </form>

        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl font-bold text-navy mb-6 md:mb-8 md:mb-12 text-center">{t('reviews.latest')}</h2>
          {reviews.length === 0 ? (
            <p className="text-center text-text-secondary text-lg">No reviews yet. Be the first to share your experience!</p>
          ) : (
            <div className="flex flex-col gap-8">
              {reviews.map((r, i) => (
                <div key={i} className="bg-white p-10 rounded-lg shadow-custom relative">
                  <div className="text-gold text-2xl tracking-widest mb-4">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}
                  </div>
                  <p className="text-text-secondary mb-6 text-lg italic leading-relaxed">"{r.text}"</p>
                  <div>
                    <h4 className="font-serif font-bold text-xl text-navy">{r.name}</h4>
                    {r.location && <p className="text-steel-blue text-xs uppercase tracking-widest font-semibold mt-2">{r.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </section>
    </div>
  );
}
