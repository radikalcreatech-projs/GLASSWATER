import { useState, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { FileText, ArrowLeft, Printer, Download, Mail, MapPin, Phone, MessageCircle, ShieldCheck, Loader } from 'lucide-react';
import { sanitizeWhatsAppUrl } from '../utils/url';

// Lazy-load html2canvas-pro and jspdf (~600KB savings on initial load)
let html2canvasPro: any = null;
let jsPDF: any = null;
let loadPromise: Promise<void> | null = null;

async function loadPdfLibs() {
  if (!loadPromise) {
    loadPromise = (async () => {
      const [canvasMod, pdfMod] = await Promise.all([
        import('html2canvas-pro'),
        import('jspdf'),
      ]);
      html2canvasPro = canvasMod.default;
      jsPDF = pdfMod.default;
    })();
  }
  await loadPromise;
}

/** Extracts ?code= param from hash-based URL reliably */
function parsePortalCode(): string | null {
  const raw = window.location.hash;
  const queryIndex = raw.indexOf('?');
  if (queryIndex === -1) return null;
  const queryString = raw.substring(queryIndex + 1);
  const params = new URLSearchParams(queryString);
  return params.get('code');
}

export function PortalPage() {
  const { t } = useI18n();
  const { documents, settings } = useSettings();
  const { addToast, removeToast } = useToast();
  const [refCode, setRefCode] = useState('');
  const [retrievedDoc, setRetrievedDoc] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Check for ?code= parameter in URL hash
    const codeParam = parsePortalCode();
    if (codeParam) {
      setRefCode(codeParam);
      const foundDoc = documents.find(doc => doc.code.toUpperCase() === codeParam.toUpperCase());
      if (foundDoc) {
        setRetrievedDoc(foundDoc);
        loadPdfLibs().catch(() => {});
      } else {
        setErrorMsg(`${t('portal.doc_error')} "${codeParam}".`);
      }
    }
  }, [documents, t]);

  const handleDownloadPDF = async () => {
    if (!retrievedDoc || isDownloading) return;
    setIsDownloading(true);
    const loadingToastId = addToast('info', t('loading.generating_pdf'), 0);

    try {
      await loadPdfLibs();

      // Retry DOM readiness up to 3 times with 150ms intervals
      let element: HTMLElement | null = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        await new Promise(resolve => setTimeout(resolve, 150));
        element = document.getElementById('printable-document');
        if (element && element.offsetHeight > 0) break;
      }

      if (!element) {
        removeToast(loadingToastId);
        addToast('error', t('toast.pdf_error'), 5000);
        setIsDownloading(false);
        return;
      }

      // Use html2canvas-pro which supports oklch/oklab CSS color functions
      const canvas = await html2canvasPro(element, {
        scale: 2,
        useCORS: true,
        windowWidth: 1024,
      });

      // Create PDF with jsPDF
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth - 20; // 10mm margin each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10; // top margin

      pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdf.internal.pageSize.getHeight() - 20);

      // Handle multi-page content
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdf.internal.pageSize.getHeight() - 20);
      }

      pdf.save(`${retrievedDoc.code}_${retrievedDoc.clientName}.pdf`);

      removeToast(loadingToastId);
      addToast('success', t('toast.pdf_ready'), 4000);
    } catch (e) {
      console.error('Error generating PDF', e);
      removeToast(loadingToastId);
      addToast('error', t('toast.pdf_error'), 6000);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!refCode.trim()) {
      setErrorMsg(t('validation.enter_code'));
      return;
    }

    const cleanedCode = refCode.trim().toUpperCase();
    const foundDoc = documents.find(doc => doc.code.toUpperCase() === cleanedCode);

    if (foundDoc) {
      setRetrievedDoc(foundDoc);
      loadPdfLibs().catch(() => {});
    } else {
      setErrorMsg(`${t('portal.doc_error')} "${cleanedCode}". ${t('portal.doc_error_verify')}`);
    }
  };

  const handleBackToSearch = () => {
    setRetrievedDoc(null);
    setRefCode('');
    setErrorMsg('');
  };

  const handlePrint = () => {
    addToast('info', t('toast.print_opening'), 2000);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // If a document was retrieved, render the receipt
  if (retrievedDoc) {
    return (
      <div className="animate-in fade-in duration-300 py-6 md:py-10 px-4 sm:px-6 max-w-4xl mx-auto print:py-0 print:px-0 relative">
        {isDownloading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl pointer-events-none">
            <div className="flex flex-col items-center gap-4">
              <Loader className="animate-spin text-gold w-10 h-10" />
              <p className="text-sm text-text-secondary font-medium">{t('loading.generating_pdf')}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center mb-6 gap-4 print:hidden">
          <button
            onClick={handleBackToSearch}
            className="flex items-center gap-2 text-text-secondary hover:text-navy font-semibold uppercase tracking-widest text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> {t('portal.search_another')}
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="bg-navy/5 border border-navy/20 hover:bg-navy/10 text-navy px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? <Loader size={14} className="animate-spin" /> : <Download size={14} />}
              {isDownloading ? t('loading.generating_pdf') : t('portal.download_pdf')}
            </button>
            {retrievedDoc.fileUrl && (
              <a
                href={retrievedDoc.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-navy/5 border border-navy/20 hover:bg-navy/10 text-navy px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <Download size={14} /> {t('portal.view_file')}
              </a>
            )}
            <button
              onClick={handlePrint}
              className="bg-gold hover:bg-navy text-white px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer relative z-10"
            >
              <Printer size={14} /> {t('portal.print')}
            </button>
          </div>
        </div>

        <div id="printable-document" className="bg-white rounded-xl shadow-custom border border-gold/20 p-4 sm:p-6 md:p-12 print:border-none print:shadow-none print:p-0 text-sm">

          <div className="flex flex-col sm:flex-row print:flex-row justify-between items-start sm:items-center print:items-center border-b border-light-gray pb-8 mb-8 gap-6">
            <div className="flex items-center gap-4">
              <img src={settings.logoUrl} alt="Glasswater Logo" className="h-16 w-auto object-contain" />
              <div className="leading-none">
                <div className="font-serif text-xl md:text-2xl font-bold text-navy tracking-tight">{settings.companyName ? settings.companyName.split(' ')[0] : 'GLASSWATER'}</div>
                <div className="font-sans text-[9px] font-normal text-steel-blue tracking-widest mt-1 uppercase">{settings.companyName ? settings.companyName.substring(settings.companyName.indexOf(' ') + 1) : 'Fit-Outs & Co. Ltd.'}</div>
              </div>
            </div>

            <div className="text-left sm:text-right print:text-right">
              <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-widest mb-2 ${
                retrievedDoc.type === 'Estimate' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                retrievedDoc.type === 'Waybill' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                'bg-green-100 text-green-800 border border-green-200'
              }`}>
                {retrievedDoc.type} {t('portal.statement')}
              </span>
              <div className="text-xl md:text-2xl font-mono font-bold text-navy break-all">{retrievedDoc.code}</div>
              <div className="text-xs text-text-secondary mt-1">{t('portal.date_issued')}: {retrievedDoc.date}</div>
              {retrievedDoc.dueDate && <div className="text-xs text-text-secondary">{t('portal.due_date')}: {retrievedDoc.dueDate}</div>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-3 border-b border-light-gray pb-1">{t('portal.issued_by')}</h4>
              <div className="font-semibold text-navy text-base">{settings.companyName || 'Glasswater Fit-Outs & Co. Ltd.'}</div>
              <div className="text-sm text-text-secondary space-y-1 mt-2">
                <p className="flex items-start gap-2"><MapPin size={14} className="text-gold shrink-0 mt-0.5" /> <span className="whitespace-pre-line">{settings.address}</span></p>
                <p className="flex items-center gap-2"><Phone size={14} className="text-gold shrink-0" /> <span>{settings.phone}</span></p>
                <p className="flex items-center gap-2"><Mail size={14} className="text-gold shrink-0" /> <span>{settings.email}</span></p>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-3 border-b border-light-gray pb-1">{t('portal.client_info')}</h4>
              <div className="font-semibold text-navy text-base">{retrievedDoc.clientName}</div>
              <div className="text-sm text-text-secondary space-y-1 mt-2">
                {retrievedDoc.clientEmail && <p className="flex items-center gap-2"><Mail size={14} className="text-gold shrink-0" /> <span>{retrievedDoc.clientEmail}</span></p>}
                {retrievedDoc.clientPhone && <p className="flex items-center gap-2"><Phone size={14} className="text-gold shrink-0" /> <span>{retrievedDoc.clientPhone}</span></p>}
                <div className="flex items-start gap-2 mt-3 bg-light-gray/40 p-2.5 rounded border border-light-gray/60">
                  <ShieldCheck size={16} className="text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold uppercase text-navy block">{t('portal.system_status')}</span>
                    <span className="text-xs font-medium text-green-700 uppercase tracking-wider">{retrievedDoc.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-navy text-white p-4 rounded-lg mb-8">
            <span className="text-[9px] font-semibold text-gold uppercase tracking-widest block mb-1">{t('portal.subject_matter')}</span>
            <h3 className="font-serif text-lg font-bold">{retrievedDoc.title}</h3>
          </div>

          <div className="mb-8">
            <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4 border-b border-light-gray pb-1">{t('portal.statement_accounts')}</h4>
            {retrievedDoc.items.length === 0 ? (
              <div className="text-center py-6 bg-light-gray/30 rounded text-text-secondary text-sm">{t('portal.no_items')}</div>
            ) : (
              <div className="overflow-x-auto print:overflow-visible">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-light-gray text-navy text-[10px] uppercase tracking-widest font-bold">
                      <th className="p-3">{t('portal.item_desc')}</th>
                      <th className="p-3 w-20 text-center">{t('portal.qty')}</th>
                      <th className="p-3 w-32">{t('portal.unit_price')}</th>
                      <th className="p-3 w-36 text-right">{t('portal.line_total')}</th>
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
                        <td colSpan={3} className="p-3 text-right">{t('portal.discount')} ({retrievedDoc.discountType === 'percentage' ? `${retrievedDoc.discountValue}%` : 'Fixed'})</td>
                        <td className="p-3 text-right text-red-500">
                          - GHS {retrievedDoc.discountType === 'fixed' ? Number(retrievedDoc.discountValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : (retrievedDoc.items.reduce((sum: number, item: any) => sum + (Number(item.quantity || 0) * Number(item.unitPrice || 0)), 0) * Number(retrievedDoc.discountValue) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-light-gray/30 font-bold text-base text-navy">
                      <td colSpan={3} className="p-4 text-right border-t border-light-gray">{t('portal.total_amount')}</td>
                      <td className="p-4 text-right text-gold border-t border-light-gray font-mono">
                        GHS {Number(retrievedDoc.totalAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {retrievedDoc.includePaymentDetails && settings.paymentDetails && (
            <div className="bg-navy/5 p-6 rounded-lg border border-navy/10 mb-8">
              <h4 className="text-[10px] font-bold text-navy uppercase tracking-widest mb-2 flex items-center gap-2">{t('portal.payment_info')}</h4>
              <p className="text-sm text-navy/80 font-mono leading-relaxed whitespace-pre-line">{settings.paymentDetails}</p>
            </div>
          )}

          {retrievedDoc.notes && (
            <div className="bg-light-gray/20 p-6 rounded-lg border border-light-gray mb-8">
              <h4 className="text-[10px] font-bold text-navy uppercase tracking-widest mb-2">{t('portal.terms')}</h4>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{retrievedDoc.notes}</p>
            </div>
          )}

          <div className="border-t border-light-gray pt-6 text-center text-[10px] text-text-secondary uppercase tracking-widest">
            {t('portal.thank_you')}
          </div>

        </div>

        <div className="mt-8 text-center bg-light-gray/40 border border-light-gray rounded-xl p-6 print:hidden">
          <h3 className="font-serif text-lg font-bold text-navy mb-2">{t('portal.questions')}</h3>
          <p className="text-sm text-text-secondary mb-4">{t('portal.get_in_touch')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={sanitizeWhatsAppUrl(settings.whatsapp)} target="_blank" rel="noreferrer" className="bg-[#25D366] text-white px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-widest hover:bg-[#128C7E] transition-all flex items-center gap-2 shadow-sm">
              <MessageCircle size={16} /> {t('whatsapp.chat')}
            </a>
            <a href={`mailto:${settings.email}?subject=Inquiry on document ${retrievedDoc.code}`} className="bg-navy text-white px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-widest hover:bg-gold transition-all flex items-center gap-2 shadow-sm">
              <Mail size={16} /> {t('portal.email_office')}
            </a>
          </div>
        </div>

      </div>
    );
  }

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
            <input type="text" required placeholder={t('admin.placeholder') + ' ' + t('admin.code')} value={refCode} onChange={e => setRefCode(e.target.value)} className="w-full sm:flex-1 p-4 border-none rounded font-sans text-base focus:outline-none focus:ring-2 focus:ring-gold bg-white text-text-primary uppercase" />
            <button type="submit" className="bg-gold text-white px-8 py-4 rounded font-semibold uppercase tracking-widest hover:bg-white hover:text-navy transition-colors w-full sm:w-auto shrink-0 shadow-custom cursor-pointer">{t('portal.loginbtn')}</button>
          </form>

          {errorMsg && (
            <p className="mt-4 text-red-400 text-sm font-medium bg-red-500/10 p-3 rounded border border-red-500/20 max-w-lg mx-auto">{errorMsg}</p>
          )}

          <p className="mt-8 text-concrete-gray text-xs tracking-wider uppercase">
            {t('portal.demo')} ( {t('portal.try_code')} <span className="font-bold underline cursor-pointer text-gold hover:text-white transition-colors" onClick={() => { setRefCode('GW-DEMO'); setTimeout(() => handleSearch(), 100); }}>GW-DEMO</span>)
          </p>
        </div>
      </section>
    </div>
  );
}