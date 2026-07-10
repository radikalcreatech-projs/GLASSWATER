import { useI18n } from '../context/I18nContext';

export function PortalPage() {
  const { t } = useI18n();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <section className="py-8 md:py-12 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy mb-4">{t('portal.title')}</h1>
          <p className="text-xl text-text-secondary">{t('portal.sub')}</p>
        </div>
        
        <div className="bg-navy p-10 md:p-16 rounded-lg text-center max-w-3xl mx-auto shadow-custom">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">{t('portal.login')}</h2>
          <p className="text-lg text-light-gray mb-6 md:mb-8">{t('portal.enter')}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input 
              type="text" 
              placeholder="Reference Number" 
              className="w-full sm:w-[300px] p-3.5 border-none rounded font-sans text-base focus:outline-none focus:ring-2 focus:ring-gold bg-white text-text-primary"
            />
            <button className="bg-gold text-white px-8 py-3.5 rounded font-semibold uppercase tracking-wide hover:bg-white hover:text-navy transition-colors w-full sm:w-auto">
              {t('portal.loginbtn')}
            </button>
          </div>
          
          <p className="mt-8 text-concrete-gray text-sm">{t('portal.demo')}</p>
        </div>
      </section>
    </div>
  );
}
