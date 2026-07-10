import { useState } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

export function WizardModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    type: '', address: '', area: '', floors: '', age: '', scope: '', budget: '', startDate: '', urgency: '', name: '', email: '', phone: '', contactMethod: 'email'
  });

  if (!isOpen) return null;

  const handleNext = () => setStep(s => Math.min(6, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = () => {
    if (!formData.type || !formData.name || !formData.email) {
      alert('Please fill in at least project type, name and email.');
      return;
    }

    const subject = encodeURIComponent(`New Project Quote Request from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Preferred Contact Method: ${formData.contactMethod}

-- Project Details --
Type: ${formData.type}
Scope: ${formData.scope}

-- Property Details --
Address/Location: ${formData.address}
Area: ${formData.area}
Floors: ${formData.floors}
Building Age: ${formData.age}

-- Budget & Timeline --
Estimated Budget: ${formData.budget}
Target Start Date: ${formData.startDate}
Urgency: ${formData.urgency}
`);

    window.location.href = `mailto:glasswaterfits@gmail.com?subject=${subject}&body=${body}`;

    alert('Thank you! Your request has been prepared in your email client. We will contact you shortly.');
    onClose();
    setStep(1);
    setFormData({ type: '', address: '', area: '', floors: '', age: '', scope: '', budget: '', startDate: '', urgency: '', name: '', email: '', phone: '', contactMethod: 'email' });
  };

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const inputClass = "w-full p-3 border border-light-gray rounded font-sans text-base mb-4 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 bg-bg-body text-text-primary";

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/60 z-[3000] flex justify-center items-center p-5" onClick={onClose}>
      <div className="bg-white max-w-[700px] w-full rounded-xl p-8 max-h-[90vh] overflow-y-auto relative shadow-[0_20px_60px_rgba(0,0,0,0.3)]" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-5 text-text-primary hover:text-gold transition-colors" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2 className="font-serif text-2xl font-bold text-navy mb-6">{t('wizard.title')}</h2>
        
        <div className="flex justify-between mb-8 overflow-x-auto">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <div 
              key={num} 
              className={`flex-1 text-center py-2 border-b-4 text-sm font-semibold whitespace-nowrap px-2 ${step === num ? 'border-gold text-navy' : 'border-light-gray text-text-secondary'}`}
            >
              {num}. {['Type', 'Property', 'Scope', 'Budget', 'Uploads', 'Contact'][num-1]}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="font-sans font-semibold text-xl mb-4">{t('wizard.step1')}</h3>
            <select className={inputClass} value={formData.type} onChange={e => updateForm('type', e.target.value)}>
              <option value="">Select type...</option>
              <option value="new-build">New Build</option>
              <option value="renovation">Renovation</option>
              <option value="fit-out">Fit-Out</option>
              <option value="maintenance">Maintenance</option>
              <option value="waterproofing">Waterproofing</option>
            </select>
            <div className="flex justify-between mt-6">
              <span></span>
              <button className="bg-gold text-white px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-navy transition-colors" onClick={handleNext}>
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="font-sans font-semibold text-xl mb-4">{t('wizard.step2')}</h3>
            <input type="text" className={inputClass} placeholder="Address" value={formData.address} onChange={e => updateForm('address', e.target.value)} />
            <input type="number" className={inputClass} placeholder="Floor area (sqm)" value={formData.area} onChange={e => updateForm('area', e.target.value)} />
            <input type="number" className={inputClass} placeholder="Number of floors" value={formData.floors} onChange={e => updateForm('floors', e.target.value)} />
            <input type="number" className={inputClass} placeholder="Property age (years)" value={formData.age} onChange={e => updateForm('age', e.target.value)} />
            <div className="flex justify-between mt-6">
              <button className="bg-light-gray text-navy px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-gray-300 transition-colors" onClick={handlePrev}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="bg-gold text-white px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-navy transition-colors" onClick={handleNext}>
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="font-sans font-semibold text-xl mb-4">{t('wizard.step3')}</h3>
            <textarea className={`${inputClass} resize-y h-24`} placeholder="Describe your needs..." value={formData.scope} onChange={e => updateForm('scope', e.target.value)}></textarea>
            <div className="flex gap-4 flex-wrap mb-4">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-gold focus:ring-gold" /> Electrical</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-gold focus:ring-gold" /> Plumbing</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-gold focus:ring-gold" /> Carpentry</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-gold focus:ring-gold" /> Painting</label>
            </div>
            <div className="flex justify-between mt-6">
              <button className="bg-light-gray text-navy px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-gray-300 transition-colors" onClick={handlePrev}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="bg-gold text-white px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-navy transition-colors" onClick={handleNext}>
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="font-sans font-semibold text-xl mb-4">{t('wizard.step4')}</h3>
            <select className={inputClass} value={formData.budget} onChange={e => updateForm('budget', e.target.value)}>
              <option value="">Select budget range...</option>
              <option value="under-10k">Under GHS 10,000</option>
              <option value="10-50k">GHS 10,000 – 50,000</option>
              <option value="50-100k">GHS 50,000 – 100,000</option>
              <option value="100-500k">GHS 100,000 – 500,000</option>
              <option value="over-500k">Over GHS 500,000</option>
            </select>
            <input type="date" className={inputClass} placeholder="Desired start date" value={formData.startDate} onChange={e => updateForm('startDate', e.target.value)} />
            <select className={inputClass} value={formData.urgency} onChange={e => updateForm('urgency', e.target.value)}>
              <option value="">Urgency...</option>
              <option value="immediate">Immediate (within 1 week)</option>
              <option value="soon">Soon (1-4 weeks)</option>
              <option value="planned">Planned (1-3 months)</option>
            </select>
            <div className="flex justify-between mt-6">
              <button className="bg-light-gray text-navy px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-gray-300 transition-colors" onClick={handlePrev}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="bg-gold text-white px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-navy transition-colors" onClick={handleNext}>
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="font-sans font-semibold text-xl mb-4">{t('wizard.step5')}</h3>
            <input type="file" className={`${inputClass} !py-2`} multiple accept="image/*,.pdf,.dwg" />
            <p className="text-sm text-text-secondary mb-4">Max 5 files (images, PDFs, DWG)</p>
            <div className="flex justify-between mt-6">
              <button className="bg-light-gray text-navy px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-gray-300 transition-colors" onClick={handlePrev}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="bg-gold text-white px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-navy transition-colors" onClick={handleNext}>
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 6 */}
        {step === 6 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="font-sans font-semibold text-xl mb-4">{t('wizard.step6')}</h3>
            <input type="text" className={inputClass} placeholder="Full Name" required value={formData.name} onChange={e => updateForm('name', e.target.value)} />
            <input type="email" className={inputClass} placeholder="Email" required value={formData.email} onChange={e => updateForm('email', e.target.value)} />
            <input type="tel" className={inputClass} placeholder="Phone Number" value={formData.phone} onChange={e => updateForm('phone', e.target.value)} />
            <select className={inputClass} value={formData.contactMethod} onChange={e => updateForm('contactMethod', e.target.value)}>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
            <div className="flex justify-between mt-6">
              <button className="bg-light-gray text-navy px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-gray-300 transition-colors" onClick={handlePrev}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="bg-gold text-white px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-navy transition-colors" onClick={handleSubmit}>
                Submit Request
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
