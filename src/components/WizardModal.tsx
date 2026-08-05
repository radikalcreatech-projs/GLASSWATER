import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Loader } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { validateField, patterns } from './FormField';
import { notify } from '../utils/notifications';
import { getForms } from '../cms';

export function WizardModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const { t, lang } = useI18n();
  const { settings } = useSettings();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const forms = getForms(lang);

  const [formData, setFormData] = useState({
    type: '', address: '', area: '', floors: '', age: '',
    scope: '', budget: '', startDate: '', urgency: '',
    name: '', email: '', phone: '', contactMethod: 'email',
    electrical: false, plumbing: false, carpentry: false, painting: false,
  });

  if (!isOpen) return null;

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
    }
  };

  const blurField = (key: string) => {
    setTouched(prev => ({ ...prev, [key]: true }));
    const error = validateStepField(key, (formData as any)[key]);
    if (error) setErrors(prev => ({ ...prev, [key]: error }));
  };

  const validateStepField = (key: string, value: string): string | null => {
    switch (key) {
      case 'name': return validateField(value, { required: true, minLength: 2 });
      case 'email': return validateField(value, { required: true, pattern: patterns.email });
      case 'phone': return value.trim() ? validateField(value, { pattern: patterns.phone }) : null;
      case 'type': return validateField(value, { required: true });
      default: return null;
    }
  };

  const handleNext = () => {
    if (step === 1 && !formData.type) {
      setTouched(prev => ({ ...prev, type: true }));
      setErrors(prev => ({ ...prev, type: t('validation.required') }));
      return;
    }
    setStep(s => Math.min(6, s + 1));
  };

  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};

    for (const field of ['type', 'name', 'email']) {
      newTouched[field] = true;
      const error = validateStepField(field, (formData as any)[field]);
      if (error) newErrors[field] = error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(prev => ({ ...prev, ...newTouched }));
      addToast('error', 'Please fill in all required fields.', 4000);
      return;
    }

    setIsSubmitting(true);

    const serviceChecks = [];
    if (formData.electrical) serviceChecks.push('Electrical');
    if (formData.plumbing) serviceChecks.push('Plumbing');
    if (formData.carpentry) serviceChecks.push('Carpentry');
    if (formData.painting) serviceChecks.push('Painting');

    const subject = encodeURIComponent(`New Project Quote Request from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Preferred Contact Method: ${formData.contactMethod}

-- Project Details --
Type: ${formData.type}
Scope: ${formData.scope}

-- Services Needed --
${serviceChecks.length ? serviceChecks.join(', ') : 'Not specified'}

-- Property Details --
Address/Location: ${formData.address}
Area: ${formData.area}
Floors: ${formData.floors}
Building Age: ${formData.age}

-- Budget & Timeline --
Estimated Budget: ${formData.budget}
Target Start Date: ${formData.startDate}
Urgency: ${formData.urgency}

-- Files --
Note: Please email any photos, plans, or documents to ${settings.email || 'glasswaterfits@gmail.com'} after submitting this request. Reference your name in the subject line.
`);

    const mailtoUrl = `mailto:${settings.email || 'glasswaterfits@gmail.com'}?subject=${subject}&body=${body}`;

    notify('consultation', {
      name: formData.name,
      type: formData.type,
      budget: formData.budget,
      urgency: formData.urgency,
      address: formData.address,
    }).catch((e) => console.error('Telegram notification failed:', e));
    addToast('success', t('toast.form_submitted'), 6000);

    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 400);

    onClose();
    setStep(1);
    setIsSubmitting(false);
    setFormData({ type: '', address: '', area: '', floors: '', age: '', scope: '', budget: '', startDate: '', urgency: '', name: '', email: '', phone: '', contactMethod: 'email', electrical: false, plumbing: false, carpentry: false, painting: false });
  };

  const toggleCheckbox = (key: string) => {
    setFormData(prev => ({ ...prev, [key]: !(prev as any)[key] }));
  };

  const inputClass = "w-full p-3 border border-light-gray rounded font-sans text-base mb-2 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-bg-body text-text-primary";
  const errorInputClass = "w-full p-3 border rounded font-sans text-base mb-2 focus:outline-none focus:ring-2 focus:ring-gold/20 bg-bg-body text-text-primary input-error";

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/60 z-[3000] flex justify-center items-center p-5" onClick={onClose}>
      <div className="bg-white max-w-[700px] w-full rounded-xl p-8 max-h-[90vh] overflow-y-auto relative shadow-[0_20px_60px_rgba(0,0,0,0.3)]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-5 text-text-primary hover:text-gold transition-colors cursor-pointer" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 className="font-serif text-2xl font-bold text-navy mb-6">{t('wizard.title')}</h2>

        <div className="flex justify-between mb-8 overflow-x-auto">
          {forms.wizardStepLabels.map((label, num) => (
            <div
              key={num}
              className={`flex-1 text-center py-2 border-b-4 text-sm font-semibold whitespace-nowrap px-2 ${step === num + 1 ? 'border-gold text-navy' : 'border-light-gray text-text-secondary'}`}
            >
              {num + 1}. {label}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="font-sans font-semibold text-xl mb-4">{t('wizard.step1')}</h3>
            <select
              className={touched.type && errors.type ? errorInputClass : inputClass}
              value={formData.type}
              onChange={e => updateForm('type', e.target.value)}
              onBlur={() => blurField('type')}
            >
              <option value="">{t('wizard.type_select')}</option>
              {forms.wizardTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {touched.type && errors.type && (
              <p className="text-xs text-red-600 font-medium mb-3">{errors.type}</p>
            )}
            <div className="flex justify-between mt-6">
              <span></span>
              <button className="bg-gold text-white px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-navy transition-colors cursor-pointer" onClick={handleNext}>
                {t('wizard.next')} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="font-sans font-semibold text-xl mb-4">{t('wizard.step2')}</h3>
            <input type="text" className={inputClass} placeholder={t('wizard.address')} value={formData.address} onChange={e => updateForm('address', e.target.value)} />
            <input type="number" className={inputClass} placeholder={t('wizard.area')} value={formData.area} onChange={e => updateForm('area', e.target.value)} />
            <input type="number" className={inputClass} placeholder={t('wizard.floors')} value={formData.floors} onChange={e => updateForm('floors', e.target.value)} />
            <input type="number" className={inputClass} placeholder={t('wizard.age')} value={formData.age} onChange={e => updateForm('age', e.target.value)} />
            <div className="flex justify-between mt-6">
              <button className="bg-light-gray text-navy px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-gray-300 transition-colors cursor-pointer" onClick={handlePrev}>
                <ArrowLeft size={16} /> {t('wizard.prev')}
              </button>
              <button className="bg-gold text-white px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-navy transition-colors cursor-pointer" onClick={handleNext}>
                {t('wizard.next')} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="font-sans font-semibold text-xl mb-4">{t('wizard.step3')}</h3>
            <textarea className={`${inputClass} resize-y h-24`} placeholder={t('wizard.scope_desc')} value={formData.scope} onChange={e => updateForm('scope', e.target.value)}></textarea>
            <div className="flex gap-4 flex-wrap mb-4">
              {forms.wizardScopeChecks.map(check => (
                <label key={check.value} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-gold focus:ring-gold" checked={!!(formData as any)[check.value]} onChange={() => toggleCheckbox(check.value)} />
                  {check.label}
                </label>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <button className="bg-light-gray text-navy px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-gray-300 transition-colors cursor-pointer" onClick={handlePrev}>
                <ArrowLeft size={16} /> {t('wizard.prev')}
              </button>
              <button className="bg-gold text-white px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-navy transition-colors cursor-pointer" onClick={handleNext}>
                {t('wizard.next')} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="font-sans font-semibold text-xl mb-4">{t('wizard.step4')}</h3>
            <select className={inputClass} value={formData.budget} onChange={e => updateForm('budget', e.target.value)}>
              <option value="">{t('wizard.budget_select')}</option>
              {forms.wizardBudgetOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <input type="date" className={inputClass} placeholder={t('wizard.start')} value={formData.startDate} onChange={e => updateForm('startDate', e.target.value)} />
            <select className={inputClass} value={formData.urgency} onChange={e => updateForm('urgency', e.target.value)}>
              <option value="">{t('wizard.urgency_select')}</option>
              {forms.wizardUrgencyOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="flex justify-between mt-6">
              <button className="bg-light-gray text-navy px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-gray-300 transition-colors cursor-pointer" onClick={handlePrev}>
                <ArrowLeft size={16} /> {t('wizard.prev')}
              </button>
              <button className="bg-gold text-white px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-navy transition-colors cursor-pointer" onClick={handleNext}>
                {t('wizard.next')} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 5 — Files (CMS-driven instructions) */}
        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="font-sans font-semibold text-xl mb-4">{t('wizard.step5')}</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-4" dangerouslySetInnerHTML={{ __html: forms.wizardFileInstructions }} />
            <div className="flex justify-between mt-6">
              <button className="bg-light-gray text-navy px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-gray-300 transition-colors cursor-pointer" onClick={handlePrev}>
                <ArrowLeft size={16} /> {t('wizard.prev')}
              </button>
              <button className="bg-gold text-white px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-navy transition-colors cursor-pointer" onClick={handleNext}>
                {t('wizard.next')} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 6 */}
        {step === 6 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="font-sans font-semibold text-xl mb-4">{t('wizard.step6')}</h3>
            <input
              type="text"
              className={touched.name && errors.name ? errorInputClass : inputClass}
              placeholder={t('wizard.fullname')}
              value={formData.name}
              onChange={e => updateForm('name', e.target.value)}
              onBlur={() => blurField('name')}
            />
            {touched.name && errors.name && <p className="text-xs text-red-600 font-medium mb-3">{errors.name}</p>}

            <input
              type="email"
              className={touched.email && errors.email ? errorInputClass : inputClass}
              placeholder={t('wizard.email')}
              value={formData.email}
              onChange={e => updateForm('email', e.target.value)}
              onBlur={() => blurField('email')}
            />
            {touched.email && errors.email && <p className="text-xs text-red-600 font-medium mb-3">{errors.email}</p>}

            <input type="tel" className={inputClass} placeholder={t('wizard.phone')} value={formData.phone} onChange={e => updateForm('phone', e.target.value)} />
            <select className={inputClass} value={formData.contactMethod} onChange={e => updateForm('contactMethod', e.target.value)}>
              <option value="email">{t('wizard.email')}</option>
              <option value="phone">{t('wizard.phone')}</option>
              <option value="whatsapp">{t('wizard.whatsapp')}</option>
            </select>
            <div className="flex justify-between mt-6">
              <button className="bg-light-gray text-navy px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-gray-300 transition-colors cursor-pointer" onClick={handlePrev}>
                <ArrowLeft size={16} /> {t('wizard.prev')}
              </button>
              <button
                className="bg-gold text-white px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-navy transition-colors cursor-pointer disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader size={16} className="animate-spin" /> : null}
                {isSubmitting ? t('loading.saving') : t('wizard.submit')}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}