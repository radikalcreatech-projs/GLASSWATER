import { useI18n } from '../context/I18nContext';
export function Hero() {
  const { t } = useI18n();
  return (
    <section id="home" className="mt-[72px] py-20 lg:py-24 bg-gradient-to-br from-light-gray to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="text-center lg:text-left">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-tight mb-4">{t('hero.title1')}<br />
            <i className="font-normal text-steel-blue">{t('hero.title2')}</i>
          </h1>
          <p className="text-xl text-steel-blue mb-8 max-w-lg mx-auto lg:mx-0">{t('hero.desc')}</p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <a href="#contact" className="inline-block bg-gold text-white px-8 py-3 rounded font-semibold uppercase tracking-wide hover:bg-navy hover:-translate-y-0.5 hover:shadow-lg transition-all">{t('hero.btn1')}</a>
            <a href="#projects" className="inline-block bg-transparent border-2 border-gold text-gold px-8 py-3 rounded font-semibold uppercase tracking-wide hover:bg-gold hover:text-white transition-colors">{t('hero.btn2')}</a>
          </div>
        </div>
        <div className="bg-concrete-gray h-[400px] rounded-lg flex items-center justify-center text-white text-xl relative bg-steel-blue"
             style={{
               backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffffff" width="80px" height="80px"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>')`,
               backgroundSize: '80px',
               backgroundRepeat: 'no-repeat',
               backgroundPosition: 'center'
             }}>
          <div className="absolute bottom-5 right-5 bg-navy text-white px-4 py-2 rounded text-sm font-medium">{t('hero.badge')}</div>
        </div>
      </div>
    </section>
  );
}
