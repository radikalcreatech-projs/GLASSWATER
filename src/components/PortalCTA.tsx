import { useI18n } from '../context/I18nContext';
import { useNavigation } from '../context/NavigationContext';

export function PortalCTA() {
  const { t } = useI18n();
  const { navigate } = useNavigation();

  return (
    <section id="portal" className="bg-navy py-20 text-center">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">{t('portal.title')}</h2>
        <p className="text-light-gray max-w-2xl mx-auto mb-8 text-lg">
          {t('portal.sub')}
        </p>
        <button onClick={() => navigate('portal')} className="inline-block bg-gold text-white px-8 py-3 rounded font-semibold uppercase tracking-wide hover:bg-white hover:text-navy transition-colors cursor-pointer">
          {t('portal.loginbtn')}
        </button>
      </div>
    </section>
  );
}
