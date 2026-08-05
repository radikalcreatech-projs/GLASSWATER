import { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { getFAQ } from '../cms';
import { ChevronDown } from 'lucide-react';

export function FAQPage() {
  const { lang } = useI18n();
  const faq = getFAQ(lang);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <section className="py-6 md:py-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4">{faq.title}</h1>
          <p className="text-base md:text-xl text-text-secondary">{faq.subtitle}</p>
        </div>

        <div className="flex flex-col gap-3">
          {faq.items.map((faqItem, idx) => (
            <div key={idx} className="bg-bg-card border border-light-gray rounded-md overflow-hidden shadow-sm">
              <button 
                className="w-full px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center text-left font-semibold text-navy hover:bg-light-gray/50 transition-colors text-sm sm:text-base"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="pr-4">{faqItem.q}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-gold transition-transform duration-300 shrink-0 ${openIndex === idx ? 'rotate-180' : ''}`}
                />
              </button>
              <div 
                className={`px-4 sm:px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-96 pb-3 sm:pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed">{faqItem.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}