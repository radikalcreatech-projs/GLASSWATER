import React from "react";
import { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { Phone, MessageCircle, Mail, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react';

export function ContactPage() {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const service = formData.get('service') as string;
    const message = formData.get('message') as string;

    const subject = encodeURIComponent(`New Website Enquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}
Email: ${email}
Phone: ${phone}
Service Interest: ${service}

Message:
${message}
`);

    window.location.href = `mailto:glasswaterfits@gmail.com?subject=${subject}&body=${body}`;

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    form.reset();
  };

  const inputClass = "w-full p-4 border border-light-gray rounded font-sans text-base mb-6 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-bg-body text-text-primary transition-all";

  return (
    <div className="animate-in fade-in duration-500">
      <section className="py-8 md:py-12 px-6 border border-gold m-3 sm:m-4 lg:m-6 rounded-xl bg-white">
        <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-10 max-w-3xl mx-auto">
          <img src="https://lh3.googleusercontent.com/d/1eOKbap3UVyhpSfsQyZoZXUd1LGjgLn72" alt="Contact Icon" className="w-full max-w-xs md:max-w-sm lg:max-w-md mx-auto mb-6 md:mb-10 object-contain" />
          <h2 className="uppercase tracking-[0.3em] text-gold text-sm font-semibold mb-4">Get In Touch</h2>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-navy mb-6 md:mb-8">{t('contact.title')}</h1>
          <p className="text-xl text-text-secondary leading-relaxed">{t('contact.sub')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <form onSubmit={handleSubmit} className="bg-white p-12 rounded-lg shadow-custom">
            <input type="text" name="name" placeholder="Full Name" required className={inputClass} />
            <input type="email" name="email" placeholder="Email Address" required className={inputClass} />
            <input type="tel" name="phone" placeholder="Phone Number" className={inputClass} />
            <select name="service" className={inputClass}>
              <option value="">Service Interest</option>
              <option>Engineering</option>
              <option>Construction</option>
              <option>Interior Fit‑Out</option>
              <option>Finishing Works</option>
              <option>Waterproofing</option>
              <option>Swimming Pool Engineering</option>
              <option>Facilities Management</option>
              <option>Other</option>
            </select>
            <textarea name="message" placeholder="Tell us about your project..." rows={6} className={`${inputClass} resize-y`}></textarea>
            <button type="submit" className="bg-gold text-white px-10 py-4 rounded font-semibold uppercase tracking-widest hover:bg-navy transition-colors w-full mt-2">
              {t('contact.send')}
            </button>
            {submitted && <p className="text-green-600 font-medium mt-6 text-center">Thank you for your enquiry. Our team will respond within 24 hours.</p>}
          </form>

          <div className="flex flex-col justify-center">
            <h3 className="font-serif font-bold text-3xl text-navy mb-4">{t('contact.info')}</h3>
            <p className="text-steel-blue mb-6 md:mb-8 md:mb-12 text-lg leading-relaxed max-w-md">{t('contact.infop')}</p>
            
            <div className="space-y-8 mb-6 md:mb-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-light-gray rounded-full flex items-center justify-center shrink-0 text-gold"><Phone size={24} /></div>
                <span className="text-text-primary text-xl font-medium">0248284384</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-light-gray rounded-full flex items-center justify-center shrink-0 text-gold"><Mail size={24} /></div>
                <span className="text-text-primary text-xl font-medium">glasswaterfits@gmail.com</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-[#25D366]/10 rounded-full flex items-center justify-center shrink-0 text-[#25D366]"><MessageCircle size={24} /></div>
                <a href="https://wa.me/2330248284384" target="_blank" rel="noreferrer" className="text-[#25D366] text-xl font-semibold hover:underline">Chat on WhatsApp</a>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-light-gray rounded-full flex items-center justify-center shrink-0 text-gold mt-1"><MapPin size={24} /></div>
                <span className="text-text-primary text-xl font-medium leading-relaxed">Agbogba Junction, Abokobi,<br />Accra, Ghana</span>
              </div>
            </div>

            <div>
              <h4 className="font-serif font-bold text-2xl text-navy mb-6">{t('contact.follow')}</h4>
              <div className="flex gap-4">
                <a href="https://facebook.com/glasswater" target="_blank" rel="noreferrer" className="w-14 h-14 border border-light-gray rounded-full flex items-center justify-center text-navy hover:border-gold hover:bg-gold hover:text-white transition-all hover:-translate-y-1">
                  <Facebook size={24} />
                </a>
                <a href="https://instagram.com/glasswater" target="_blank" rel="noreferrer" className="w-14 h-14 border border-light-gray rounded-full flex items-center justify-center text-navy hover:border-gold hover:bg-gold hover:text-white transition-all hover:-translate-y-1">
                  <Instagram size={24} />
                </a>
                <a href="https://linkedin.com/company/glasswater" target="_blank" rel="noreferrer" className="w-14 h-14 border border-light-gray rounded-full flex items-center justify-center text-navy hover:border-gold hover:bg-gold hover:text-white transition-all hover:-translate-y-1">
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
