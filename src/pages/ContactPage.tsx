import { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { Phone, MessageCircle, Mail, MapPin, Facebook, Linkedin, Instagram, Loader, CheckCircle2 } from 'lucide-react';
import { sanitizeWhatsAppUrl, sanitizeSocialUrl } from '../utils/url';
import { validateField, patterns } from '../components/FormField';
import { notify } from '../utils/notifications';

export function ContactPage() {
  const { t } = useI18n();
  const { settings } = useSettings();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state for validation
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const fieldErrors = validateFormField(field, formValues[field as keyof typeof formValues]);
    if (fieldErrors) {
      setErrors(prev => ({ ...prev, [field]: fieldErrors }));
    }
  };

  const validateFormField = (field: string, value: string): string | null => {
    switch (field) {
      case 'name':
        return validateField(value, { required: true, minLength: 2 });
      case 'email':
        return validateField(value, { required: true, pattern: patterns.email });
      case 'phone':
        if (!value.trim()) return null;
        return validateField(value, { pattern: patterns.phone });
      case 'message':
        return null;
      default:
        return null;
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};

    for (const field of ['name', 'email']) {
      newTouched[field] = true;
      const error = validateFormField(field, formValues[field as keyof typeof formValues]);
      if (error) newErrors[field] = error;
    }
    if (formValues.phone.trim()) {
      newTouched['phone'] = true;
      const phoneErr = validateFormField('phone', formValues.phone);
      if (phoneErr) newErrors['phone'] = phoneErr;
    }

    setErrors(newErrors);
    setTouched(prev => ({ ...prev, ...newTouched }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) {
      addToast('error', 'Please fix the errors in the form.', 4000);
      return;
    }

    setIsSubmitting(true);

    const { name, email, phone, service, message } = formValues;
    const enquiryData = { name, email, phone, service, message, timestamp: new Date().toISOString() };

    // Save to localStorage as permanent backup
    try {
      const saved = localStorage.getItem('glasswater_enquiries');
      const enquiries = saved ? JSON.parse(saved) : [];
      enquiries.unshift(enquiryData);
      localStorage.setItem('glasswater_enquiries', JSON.stringify(enquiries.slice(0, 50)));
    } catch { /* localStorage may be unavailable */ }

    // Fire Telegram notification in background
    notify('contact', { name, email, phone, service, message }).catch(() => {});

    setIsSubmitting(false);

    // Always show in-page confirmation
    setSubmitted(true);
    setFormValues({ name: '', email: '', phone: '', service: '', message: '' });
    setErrors({});
    setTouched({});
    addToast('success', 'Your enquiry has been received! We will respond within 24 hours.', 5000);
  };

  const inputClass = "w-full p-4 border border-light-gray rounded font-sans text-base mb-2 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-bg-body text-text-primary transition-all";
  const errorInputClass = "w-full p-4 border rounded font-sans text-base mb-2 focus:outline-none focus:ring-1 bg-bg-body text-text-primary transition-all input-error";

  return (
    <div className="animate-in fade-in duration-500">
      <section className="py-6 md:py-10 px-6 border border-gold m-3 sm:m-4 lg:m-6 rounded-xl bg-white">
        <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4 md:mb-8 max-w-3xl mx-auto">
          <img src={settings.contactImageUrl} alt="Contact Icon" className="w-full max-w-xs md:max-w-sm lg:max-w-md mx-auto mb-4 md:mb-8 object-contain" />
          <h2 className="uppercase tracking-[0.3em] text-gold text-sm font-semibold mb-4">{t('contact.get_in_touch')}</h2>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-navy mb-6 md:mb-8">{t('contact.title')}</h1>
          <p className="text-xl text-text-secondary leading-relaxed">{t('contact.sub')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {submitted ? (
            /* Confirmation state */
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-custom flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-navy mb-4">Thank You!</h3>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                Your enquiry has been received. Our team will review your message and respond within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-gold text-white px-8 py-3 rounded font-semibold uppercase tracking-widest hover:bg-navy transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
                <a
                  href={`mailto:${settings.email}`}
                  className="border border-navy/20 text-navy px-8 py-3 rounded font-semibold uppercase tracking-widest hover:bg-navy hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Mail size={16} /> Email us directly
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-lg shadow-custom" noValidate>
              <div className="mb-2">
                <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">
                  Full Name<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text" name="name" placeholder="Full Name"
                  value={formValues.name} onChange={e => handleChange('name', e.target.value)} onBlur={() => handleBlur('name')}
                  className={touched.name && errors.name ? errorInputClass : inputClass}
                />
                {touched.name && errors.name && (
                  <p className="text-xs text-red-600 font-medium mb-3 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full shrink-0" />{errors.name}
                  </p>
                )}
              </div>

              <div className="mb-2">
                <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">
                  Email Address<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email" name="email" placeholder="Email Address"
                  value={formValues.email} onChange={e => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')}
                  className={touched.email && errors.email ? errorInputClass : inputClass}
                />
                {touched.email && errors.email && (
                  <p className="text-xs text-red-600 font-medium mb-3 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full shrink-0" />{errors.email}
                  </p>
                )}
              </div>

              <div className="mb-2">
                <label className="block text-xs font-semibold text-navy mb-2 uppercase tracking-widest">Phone Number</label>
                <input
                  type="tel" name="phone" placeholder="Phone Number"
                  value={formValues.phone} onChange={e => handleChange('phone', e.target.value)} onBlur={() => handleBlur('phone')}
                  className={touched.phone && errors.phone ? errorInputClass : inputClass}
                />
                {touched.phone && errors.phone && (
                  <p className="text-xs text-red-600 font-medium mb-3 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full shrink-0" />{errors.phone}
                  </p>
                )}
              </div>

              <select
                name="service" value={formValues.service} onChange={e => handleChange('service', e.target.value)}
                className={`${inputClass} mb-2`}
              >
                <option value="">{t('contact.service')}</option>
                <option>{t('contact.opt_eng')}</option>
                <option>{t('contact.opt_const')}</option>
                <option>{t('contact.opt_int')}</option>
                <option>{t('contact.opt_fin')}</option>
                <option>{t('contact.opt_water')}</option>
                <option>{t('contact.opt_pool')}</option>
                <option>{t('contact.opt_fm')}</option>
                <option>{t('contact.opt_other')}</option>
              </select>

              <textarea
                name="message" placeholder="Tell us about your project..." rows={6}
                value={formValues.message} onChange={e => handleChange('message', e.target.value)}
                className={`${inputClass} resize-y`}
              ></textarea>

              <button
                type="submit" disabled={isSubmitting}
                className="bg-gold text-white px-10 py-4 rounded font-semibold uppercase tracking-widest hover:bg-navy transition-colors w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? <><Loader size={16} className="animate-spin" /> Sending...</> : t('contact.send')}
              </button>
            </form>
          )}

          <div className="flex flex-col justify-center">
            <h3 className="font-serif font-bold text-3xl text-navy mb-4">{t('contact.info')}</h3>
            <p className="text-steel-blue mb-6 md:mb-8 text-lg leading-relaxed max-w-md">{t('contact.infop')}</p>

            <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-light-gray rounded-full flex items-center justify-center shrink-0 text-gold"><Phone size={24} /></div>
                <span className="text-text-primary text-xl font-medium">{settings.phone}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-light-gray rounded-full flex items-center justify-center shrink-0 text-gold"><Mail size={24} /></div>
                <span className="text-text-primary text-xl font-medium">{settings.email}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-[#25D366]/10 rounded-full flex items-center justify-center shrink-0 text-[#25D366]"><MessageCircle size={24} /></div>
                <a href={sanitizeWhatsAppUrl(settings.whatsapp)} target="_blank" rel="noreferrer" className="text-[#25D366] text-xl font-semibold hover:underline">{t('whatsapp.chat')}</a>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-light-gray rounded-full flex items-center justify-center shrink-0 text-gold mt-1"><MapPin size={24} /></div>
                <span className="text-text-primary text-xl font-medium leading-relaxed whitespace-pre-line">{settings.address}</span>
              </div>
            </div>

            <div>
              <h4 className="font-serif font-bold text-2xl text-navy mb-4 md:mb-6">{t('contact.follow')}</h4>
              <div className="flex gap-4">
                <a href={sanitizeSocialUrl(settings.facebook)} target="_blank" rel="noreferrer" className="w-14 h-14 border border-light-gray rounded-full flex items-center justify-center text-navy hover:border-gold hover:bg-gold hover:text-white transition-all hover:-translate-y-1">
                  <Facebook size={24} />
                </a>
                <a href={sanitizeSocialUrl(settings.instagram)} target="_blank" rel="noreferrer" className="w-14 h-14 border border-light-gray rounded-full flex items-center justify-center text-navy hover:border-gold hover:bg-gold hover:text-white transition-all hover:-translate-y-1">
                  <Instagram size={24} />
                </a>
                <a href={sanitizeSocialUrl(settings.linkedin)} target="_blank" rel="noreferrer" className="w-14 h-14 border border-light-gray rounded-full flex items-center justify-center text-navy hover:border-gold hover:bg-gold hover:text-white transition-all hover:-translate-y-1">
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