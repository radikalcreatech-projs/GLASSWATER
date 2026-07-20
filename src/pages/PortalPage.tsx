import React, { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { useSettings } from '../context/SettingsContext';
import { FileText, ArrowLeft, Printer, Download, Mail, MapPin, Phone, MessageCircle, ShieldCheck } from 'lucide-react';

export function PortalPage() {
  const { t } = useI18n();
  const { documents, settings } = useSettings();
  const [refCode, setRefCode] = useState('');
  const [retrievedDoc, setRetrievedDoc] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check for ?code= parameter in URL
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const codeParam = params.get('code');
    if (codeParam) {
      setRefCode(codeParam);
      const foundDoc = documents.find(doc => doc.code.toUpperCase() === codeParam.toUpperCase());
      if (foundDoc) {
        setRetrievedDoc(foundDoc);
      } else {
        setErrorMsg(`No document found for Reference Code "${codeParam}".`);
      }
    }
  }, [documents]);

  const handleDownloadPDF = async () => {
    if (!retrievedDoc) return;
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('printable-document');
      const opt = {
        margin:       [10, 10, 10, 10],
        filename:     `${retrievedDoc.code}_${retrievedDoc.clientName}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error('Error generating PDF', e);
      alert('Failed to generate PDF. You can also use the Print button.');
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!refCode.trim()) {
      setErrorMsg('Please enter a valid Reference Number.');
      return;
    }

    const cleanedCode = refCode.trim().toUpperCase();
    const foundDoc = documents.find(doc => doc.code.toUpperCase() === cleanedCode);

    if (foundDoc) {
      setRetrievedDoc(foundDoc);
    } else {
      setErrorMsg(`No document found for Reference Code "${cleanedCode}". Please verify your code and try again.`);
    }
  };

  const handleBackToSearch = () => {
    setRetrievedDoc(null);
    setRefCode('');
    setErrorMsg('');
  };

  const handlePrint = () => {
    window.print();
  };

  // If a document was retrieved, render the gorgeous corporate Waybill/Estimate/Invoice receipt
  if (retrievedDoc) {
    return (
      <div className="animate-in fade-in duration-300 py-6 md:py-12 px-4 sm:px-6 max-w-4xl mx-auto print:py-0 print:px-0">
        
        {/* Back and Print buttons - Hidden when printing */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4 print:hidden">
          <button 
            onClick={handleBackToSearch} 
            className="flex items-center gap-2 text-text-secondary hover:text-navy font-semibold uppercase tracking-widest text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Search Another Code
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={handleDownloadPDF} 
              className="bg-navy/5 border border-navy/20 hover:bg-navy/10 text-navy px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download size={14} /> Download PDF
            </button>
            {retrievedDoc.fileUrl && (
              <a 
                href={retrievedDoc.fileUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-navy/5 border border-navy/20 hover:bg-navy/10 text-navy px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <Download size={14} /> View Attached File
              </a>
            )}
            <button 
              onClick={handlePrint} 
              className="bg-gold hover:bg-navy text-white px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Printer size={14} /> Print
            </button>
          </div>
        </div>

        {/* Corporate Letterhead & Document Card */}
        <div id="printable-document" className="bg-white rounded-xl shadow-custom border border-gold/20 p-8 md:p-12 print:border-none print:shadow-none print:p-0">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-light-gray pb-8 mb-8 gap-6">
            <div className="flex items-center gap-4">
              <img src={settings.logoUrl} alt="Glasswater Logo" className="h-16 w-auto object-contain" />
              <div className="leading-none">
                <div className="font-serif text-2xl font-bold text-navy tracking-tight">GLASSWATER<span className="text-gold">.</span></div>
                <div className="font-sans text-[9px] font-normal text-steel-blue tracking-widest mt-1 uppercase">Fit-Outs &amp; Co. Ltd.</div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-widest mb-2 ${
                retrievedDoc.type === 'Estimate' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                retrievedDoc.type === 'Waybill' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                'bg-green-100 text-green-800 border border-green-200'
              }`}>
                {retrievedDoc.type} Statement
              </span>
              <div className="text-2xl font-mono font-bold text-navy">{retrievedDoc.code}</div>
              <div className="text-xs text-text-secondary mt-1">Date Issued: {retrievedDoc.date}</div>
              {retrievedDoc.dueDate && <div className="text-xs text-text-secondary">Due Date: {retrievedDoc.dueDate}</div>}
            </div>
          </div>

          {/* Parties Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-3 border-b border-light-gray pb-1">Issued By</h4>
              <div className="font-semibold text-navy text-base">Glasswater Fit‑Outs &amp; Co. Ltd.</div>
              <div className="text-sm text-text-secondary space-y-1 mt-2">
                <p className="flex items-start gap-2"><MapPin size={14} className="text-gold shrink-0 mt-0.5" /> <span className="whitespace-pre-line">{settings.address}</span></p>
                <p className="flex items-center gap-2"><Phone size={14} className="text-gold shrink-0" /> <span>{settings.phone}</span></p>
                <p className="flex items-center gap-2"><Mail size={14} className="text-gold shrink-0" /> <span>{settings.email}</span></p>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-3 border-b border-light-gray pb-1">Client Information</h4>
              <div className="font-semibold text-navy text-base">{retrievedDoc.clientName}</div>
              <div className="text-sm text-text-secondary space-y-1 mt-2">
                {retrievedDoc.clientEmail && <p className="flex items-center gap-2"><Mail size={14} className="text-gold shrink-0" /> <span>{retrievedDoc.clientEmail}</span></p>}
                {retrievedDoc.clientPhone && <p className="flex items-center gap-2"><Phone size={14} className="text-gold shrink-0" /> <span>{retrievedDoc.clientPhone}</span></p>}
                <div className="flex items-start gap-2 mt-3 bg-light-gray/40 p-2.5 rounded border border-light-gray/60">
                  <ShieldCheck size={16} className="text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold uppercase text-navy block">System Status</span>
                    <span className="text-xs font-medium text-green-700 uppercase tracking-wider">{retrievedDoc.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Title Banner */}
          <div className="bg-navy text-white p-4 rounded-lg mb-8">
            <span className="text-[9px] font-semibold text-gold uppercase tracking-widest block mb-1">Subject Matter / Scope of Works</span>
            <h3 className="font-serif text-lg font-bold">{retrievedDoc.title}</h3>
          </div>

          {/* Line Items Table */}
          <div className="mb-8">
            <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4 border-b border-light-gray pb-1">Statement of Accounts</h4>
            {retrievedDoc.items.length === 0 ? (
              <div className="text-center py-6 bg-light-gray/30 rounded text-text-secondary text-sm">
                No itemized breakdown is recorded. Please see the attached PDF copy or contact our accounts office.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-light-gray text-navy text-[10px] uppercase tracking-widest font-bold">
                      <th className="p-3">Item Description</th>
                      <th className="p-3 w-20 text-center">Qty</th>
                      <th className="p-3 w-32">Unit Price</th>
                      <th className="p-3 w-36 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-light-gray text-sm">
                    {retrievedDoc.items.map((item: any, i: number) => (
                      <tr key={i} className="hover:bg-light-gray/10">
                        <td className="p-3 text-navy font-medium">{item.description}</td>
                        <td className="p-3 text-center text-text-secondary">{item.quantity}</td>
                        <td className="p-3 text-text-secondary">GHS {Number(item.unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="p-3 text-right font-semibold text-navy">GHS {Number(item.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    {retrievedDoc.discountType && (
                      <tr className="text-sm font-semibold text-text-secondary border-t border-light-gray bg-white">
                        <td colSpan={3} className="p-3 text-right">
                          Discount ({retrievedDoc.discountType === 'percentage' ? `${retrievedDoc.discountValue}%` : 'Fixed'})
                        </td>
                        <td className="p-3 text-right text-red-500">
                          - GHS {retrievedDoc.discountType === 'fixed' 
                            ? Number(retrievedDoc.discountValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : (retrievedDoc.items.reduce((sum: number, item: any) => sum + (Number(item.quantity || 0) * Number(item.unitPrice || 0)), 0) * Number(retrievedDoc.discountValue) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          }
                        </td>
                      </tr>
                    )}
                    <tr className="bg-light-gray/30 font-bold text-base text-navy">
                      <td colSpan={3} className="p-4 text-right border-t border-light-gray">Total Amount:</td>
                      <td className="p-4 text-right text-gold border-t border-light-gray font-mono">
                        GHS {Number(retrievedDoc.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* Payment Details Block */}
          {retrievedDoc.includePaymentDetails && settings.paymentDetails && (
            <div className="bg-navy/5 p-6 rounded-lg border border-navy/10 mb-8">
              <h4 className="text-[10px] font-bold text-navy uppercase tracking-widest mb-2 flex items-center gap-2">
                 Payment Information
              </h4>
              <p className="text-sm text-navy/80 font-mono leading-relaxed whitespace-pre-line">{settings.paymentDetails}</p>
            </div>
          )}

          {/* Notes Block */}
          {retrievedDoc.notes && (
            <div className="bg-light-gray/20 p-6 rounded-lg border border-light-gray mb-8">
              <h4 className="text-[10px] font-bold text-navy uppercase tracking-widest mb-2">Terms &amp; Important Instructions</h4>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{retrievedDoc.notes}</p>
            </div>
          )}

          {/* Footer Notice */}
          <div className="border-t border-light-gray pt-6 text-center text-[10px] text-text-secondary uppercase tracking-widest">
            Thank you for choosing Glasswater. We appreciate your valued business.
          </div>

        </div>

        {/* Client Support Help Section - Hidden when printing */}
        <div className="mt-8 text-center bg-light-gray/40 border border-light-gray rounded-xl p-6 print:hidden">
          <h3 className="font-serif text-lg font-bold text-navy mb-2">Have questions about this Statement?</h3>
          <p className="text-sm text-text-secondary mb-4">Get in touch directly with our support team to verify estimate details or approve work.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href={settings.whatsapp} 
              target="_blank" 
              rel="noreferrer" 
              className="bg-[#25D366] text-white px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-widest hover:bg-[#128C7E] transition-all flex items-center gap-2 shadow-sm"
            >
              <MessageCircle size={16} /> WhatsApp Chat
            </a>
            <a 
              href={`mailto:${settings.email}?subject=Inquiry on document ${retrievedDoc.code}`} 
              className="bg-navy text-white px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-widest hover:bg-gold transition-all flex items-center gap-2 shadow-sm"
            >
              <Mail size={16} /> Email Office
            </a>
          </div>
        </div>

      </div>
    );
  }

  // Otherwise, render the gorgeous search panel
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <section className="py-12 md:py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-navy mb-4">{t('portal.title')}</h1>
          <p className="text-lg sm:text-xl text-text-secondary leading-relaxed">{t('portal.sub')}</p>
        </div>
        
        <div className="bg-navy p-10 md:p-16 rounded-xl text-center max-w-3xl mx-auto shadow-custom border border-gold/30">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">{t('portal.login')}</h2>
          <p className="text-base text-light-gray mb-8">{t('portal.enter')}</p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <input 
              type="text" 
              required
              placeholder="e.g. GW-DEMO" 
              value={refCode}
              onChange={e => setRefCode(e.target.value)}
              className="w-full sm:flex-1 p-4 border-none rounded font-sans text-base focus:outline-none focus:ring-2 focus:ring-gold bg-white text-text-primary uppercase"
            />
            <button type="submit" className="bg-gold text-white px-8 py-4 rounded font-semibold uppercase tracking-widest hover:bg-white hover:text-navy transition-colors w-full sm:w-auto shrink-0 shadow-custom cursor-pointer">
              {t('portal.loginbtn')}
            </button>
          </form>

          {errorMsg && (
            <p className="mt-4 text-red-400 text-sm font-medium bg-red-500/10 p-3 rounded border border-red-500/20 max-w-lg mx-auto">
              {errorMsg}
            </p>
          )}
          
          <p className="mt-8 text-concrete-gray text-xs tracking-wider uppercase">
            {t('portal.demo')} (Try code: <span className="font-bold underline cursor-pointer text-gold hover:text-white transition-colors" onClick={() => { setRefCode('GW-DEMO'); setTimeout(() => handleSearch(), 100); }}>GW-DEMO</span>)
          </p>
        </div>
      </section>
    </div>
  );
}
