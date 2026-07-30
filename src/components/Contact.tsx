import { useSettings } from '../context/SettingsContext';
import { useI18n } from '../context/I18nContext';
import React from "react";
import { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Facebook, Linkedin, Instagram, Youtube } from 'lucide-react';

export function Contact() {
  const { t } = useI18n();
  const { settings } = useSettings();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-2">{t('comp.contact.title')}</h2>
          <p className="text-steel-blue text-lg">{t('comp.contact.sub')}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder={t('comp.contact.name')} 
              required 
              className="w-full px-4 py-3 border border-gray-200 rounded font-sans text-base focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
            />
            <input 
              type="email" 
              placeholder={t('comp.contact.email')} 
              required 
              className="w-full px-4 py-3 border border-gray-200 rounded font-sans text-base focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
            />
            <input 
              type="tel" 
              placeholder={t('comp.contact.phone')} 
              required 
              className="w-full px-4 py-3 border border-gray-200 rounded font-sans text-base focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
            />
            <select 
              className="w-full px-4 py-3 border border-gray-200 rounded font-sans text-base focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white text-gray-500"
            >
              <option value="">{t('comp.contact.service')}</option>
              <option>{t('comp.contact.opt1')}</option>
              <option>{t('comp.contact.opt2')}</option>
              <option>{t('comp.contact.opt3')}</option>
              <option>{t('comp.contact.opt4')}</option>
              <option>{t('comp.contact.opt5')}</option>
              <option>{t('comp.contact.opt6')}</option>
              <option>{t('comp.contact.opt7')}</option>
            </select>
            <textarea 
              placeholder={t('comp.contact.msg')} 
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded font-sans text-base focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-y"
            ></textarea>
            <button type="submit" className="bg-gold text-white px-8 py-3 rounded font-semibold uppercase tracking-wide hover:bg-navy transition-colors self-start mt-2">
              {t('comp.contact.btn')}
            </button>
            {submitted && <p className="text-green-600 font-medium mt-2">{t('comp.contact.success')}</p>}
          </form>

          <div>
            <h3 className="font-sans font-semibold text-2xl text-navy mb-2">{t('comp.contact.touch')}</h3>
            <p className="text-steel-blue mb-8">{t('comp.contact.resp')}</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <Phone className="text-gold w-6 h-6 shrink-0" />
                <span className="text-charcoal">{settings.phone}</span>
              </div>
              <div className="flex items-center gap-4">
                <MessageCircle className="text-gold w-6 h-6 shrink-0" />
                <span className="text-charcoal">{settings.whatsapp}</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="text-gold w-6 h-6 shrink-0" />
                <span className="text-charcoal">{settings.email}</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="text-gold w-6 h-6 shrink-0" />
                <span className="text-charcoal whitespace-pre-line">{settings.address}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <a href={settings.facebook} target="_blank" rel="noreferrer" className="w-11 h-11 bg-light-gray rounded-full flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all">
                <Facebook size={20} />
              </a>
              <a href={settings.linkedin} target="_blank" rel="noreferrer" className="w-11 h-11 bg-light-gray rounded-full flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all">
                <Linkedin size={20} />
              </a>
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="w-11 h-11 bg-light-gray rounded-full flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
