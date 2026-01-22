import { CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../storeApi/storeApi';
import type { DashboardSubscription, ActiveSubscription, Subscription } from '../../types/types';
import { getLocalizedName, getLocalizedDescription } from '../../utils/localization';

interface SubscriptionCardProps {
  subscription: DashboardSubscription | ActiveSubscription | null;
  availableSubscriptions: Subscription[];
  formatDate: (dateString: string) => string;
}

const SubscriptionCard = ({ subscription, availableSubscriptions, formatDate }: SubscriptionCardProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();

  const isActive = subscription && (
    subscription.status === 'active' || 
    (subscription as DashboardSubscription).is_active === true
  );
  const subInfo = (subscription as any)?.subscription || subscription;
  
  if (isActive && subInfo) {
    return (
      <div className={`border rounded-xl shadow-sm hover:shadow-md transition-shadow ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-[#114C5A]/20'
      }`}>
        <div className={`p-5 border-b flex items-center justify-between ${
          isDarkMode ? 'border-slate-700' : 'border-[#114C5A]/10'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDarkMode ? 'bg-[#114C5A]/20 text-[#FFB200]' : 'bg-[#114C5A]/10 text-[#114C5A]'
            }`}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-[#114C5A]'
              }`}>
                {getLocalizedName(subInfo, { preferredLanguage: i18n.language === 'ar' ? 'ar' : 'en' }) || t('dashboard.subscription.subscriptionName')}
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('dashboard.subscription.fullControl')}
              </p>
            </div>
          </div>
          <span className="text-xs px-2 py-1 bg-[#FFB200]/10 text-[#FFB200] rounded border border-[#FFB200]/30">
              {t('dashboard.subscription.active')}
            </span>
        </div>

        <div className="p-5 space-y-4">
          <div className={`border rounded-lg p-4 ${
            isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-[#114C5A]/5 border-[#114C5A]/10'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('dashboard.subscription.expiryDate')}
              </span>
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {subscription.expires_at ? formatDate(subscription.expires_at) : t('dashboard.subscription.permanent')}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('dashboard.subscriptions.timeRemaining')}
              </span>
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>75%</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${
              isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
            }`}>
              <div className="w-3/4 h-full bg-[#114C5A] rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="p-5 pt-0">
          <button
            onClick={() => navigate('/admin/subscriptions')}
            className="w-full bg-[#114C5A] hover:bg-[#114C5A]/90 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            <span>{t('dashboard.subscription.manage')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const defaultSubscription = availableSubscriptions.find(sub => sub.price === '0.00') || availableSubscriptions[0];
  
  return (
    <div className={`border rounded-xl shadow-sm hover:shadow-md transition-shadow ${
      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-[#114C5A]/20'
    }`}>
      <div className={`p-5 border-b flex items-center justify-between ${
        isDarkMode ? 'border-slate-700' : 'border-[#114C5A]/10'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDarkMode ? 'bg-[#114C5A]/20 text-[#FFB200]' : 'bg-[#114C5A]/10 text-[#114C5A]'
          }`}>
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            {defaultSubscription ? (
              <>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#114C5A]'}`}>
                  {getLocalizedName(defaultSubscription, { preferredLanguage: i18n.language === 'ar' ? 'ar' : 'en' })}
                </h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {getLocalizedDescription(defaultSubscription, { preferredLanguage: i18n.language === 'ar' ? 'ar' : 'en' }) || t('dashboard.subscription.availablePackage')}
                </p>
              </>
            ) : (
              <>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#114C5A]'}`}>
                  {t('dashboard.subscription.noActive')}
                </h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t('dashboard.subscription.subscribeNow')}
                </p>
              </>
            )}
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded border ${
          isDarkMode ? 'bg-slate-700 text-gray-300 border-slate-600' : 'bg-gray-100 text-gray-700 border-gray-300'
        }`}>
            {t('dashboard.subscription.inactive')}
          </span>
      </div>
      
      <div className="p-5 space-y-4">
        {defaultSubscription ? (
          <>
            <div className={`border rounded-lg p-4 ${
              isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-[#114C5A]/5 border-[#114C5A]/10'
            }`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('dashboard.subscriptions.price') || 'السعر'}
                  </span>
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {defaultSubscription.price} {t('dashboard.stats.currency')}
                  </span>
                </div>
                <div className={`h-px ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'}`}></div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('dashboard.subscriptions.duration') || 'مدة الاشتراك'}
                  </span>
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {defaultSubscription.duration_type === 'month' || defaultSubscription.duration_type === 'monthly' 
                      ? t('dashboard.subscriptions.monthly')
                      : defaultSubscription.duration_type === '3months'
                      ? t('dashboard.subscriptions.threeMonths')
                      : defaultSubscription.duration_type === '6months'
                      ? t('dashboard.subscriptions.sixMonths')
                      : defaultSubscription.duration_type === 'year' || defaultSubscription.duration_type === 'yearly'
                      ? t('dashboard.subscriptions.yearly')
                      : defaultSubscription.duration_type}
                  </span>
                </div>
              </div>
            </div>
            <div className={`border rounded-lg p-4 ${
              isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-[#114C5A]/5 border-[#114C5A]/10'
            }`}>
              <p className={`text-sm leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {t('dashboard.subscription.subscribeNow')}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 border ${
              isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-100 border-gray-300'
            }`}>
              <AlertCircle className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </div>
            <h4 className={`text-base font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{t('dashboard.subscription.noActive')}</h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('dashboard.subscription.subscribeNow')}
            </p>
          </div>
        )}
      </div>
      
      <div className="p-5 pt-0">
        <button
          onClick={() => navigate('/admin/subscriptions')}
          className="w-full bg-[#114C5A] hover:bg-[#114C5A]/90 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
        >
          <span>{t('dashboard.subscription.browse')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
