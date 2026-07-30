import { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { getFaqs } from '../data';
import { ChevronDown } from 'lucide-react';

export function FAQPage() {
  const { t, lang } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <section className="py-8 md:py-12 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy mb-4">{t('faq.title')}</h1>
          <p className="text-xl text-text-secondary">{t('faq.sub')}</p>
        </div>

        <div className="flex flex-col gap-3">
          {getFaqs(lang).map((faq, idx) => (
            <div key={idx} className="bg-bg-card border border-light-gray rounded-md overflow-hidden shadow-sm">
              <button 
                className="w-full px-6 py-4 flex justify-between items-center text-left font-semibold text-navy hover:bg-light-gray/50 transition-colors"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                {faq.q}
                <ChevronDown 
                  size={20} 
                  className={`text-gold transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}
                />
              </button>
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-text-secondary">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
