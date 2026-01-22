import { useState, useEffect, useCallback } from 'react';
import PricingCard from '../PricingCard';
import { useThemeStore } from '../../storeApi/store/theme.store';
import { useTranslation } from 'react-i18next';
import { getSubscriptions, type Subscription } from '../../storeApi/api/home.api';
import { Loader2 } from 'lucide-react';
import { getLocalizedName, getLocalizedDescription } from '../../utils/localization';

const PricingSection = () => {
  const { isDarkMode } = useThemeStore();
  const { t, i18n } = useTranslation();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const locale = i18n.language === 'ar' ? 'ar' : 'en';
      const response = await getSubscriptions(locale);
      if (response.success && response.data?.subscriptions) {
        // Filter only active subscriptions
        const activeSubscriptions = response.data.subscriptions.filter(sub => sub.is_active);
        setSubscriptions(activeSubscriptions);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Refetch when language changes
  useEffect(() => {
    const handleLanguageChanged = async () => {
      await fetchSubscriptions();
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchSubscriptions]);

  // Convert API data to plan format
  const plans = subscriptions.map((subscription) => ({
    id: subscription.id,
    name: getLocalizedName(subscription, { preferredLanguage: i18n.language === 'ar' ? 'ar' : 'en' }),
    description: getLocalizedDescription(subscription, { preferredLanguage: i18n.language === 'ar' ? 'ar' : 'en' }),
    price: parseFloat(subscription.price).toLocaleString(i18n.language === 'ar' ? 'ar-SA' : 'en-US'),
    currency: 'SAR',
    features: subscription.features,
    isPopular: subscription.is_pro, // Use is_pro to determine popular plan
  }));

  return (
    <section className={`py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-[#114C5A]'
      }`}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-auto bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -ml-48 -mb-32"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-5 md:mb-6 leading-tight px-2">
            {t('pricing.title') || (i18n.language === 'ar' ? 'اختر الباقة المناسبة لك' : 'Choose the Right Plan for You')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 font-thin leading-relaxed max-w-3xl mx-auto px-4">
            {t('pricing.subtitle') || (i18n.language === 'ar' ? 'باقات مرنة تتيح لك الاستفادة من خدمات متكاملة وحلول ذكية حسب حجم مشروعك واحتياجاتك.' : 'Flexible plans that allow you to benefit from integrated services and smart solutions according to your project size and needs.')}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        ) : plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-white/80 text-lg">
              {t('dashboard.subscriptions.noPackages') || (i18n.language === 'ar' ? 'لا توجد باقات متاحة حالياً' : 'No packages available at the moment')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
