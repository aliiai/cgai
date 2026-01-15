import { CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { DashboardSubscription, ActiveSubscription, Subscription } from '../../types/types';

interface SubscriptionCardProps {
  subscription: DashboardSubscription | ActiveSubscription | null;
  availableSubscriptions: Subscription[];
  formatDate: (dateString: string) => string;
}

const SubscriptionCard = ({ subscription, availableSubscriptions, formatDate }: SubscriptionCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isActive = subscription && (
    subscription.status === 'active' || 
    (subscription as DashboardSubscription).is_active === true
  );
  const subInfo = (subscription as any)?.subscription || subscription;
  
  if (isActive && subInfo) {
    return (
      <div className="bg-white border border-[#114C5A]/20 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <div className="p-5 border-b border-[#114C5A]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#114C5A]/10 rounded-lg flex items-center justify-center text-[#114C5A]">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#114C5A]">
                {subInfo.name || t('dashboard.subscription.subscriptionName')}
              </h3>
              <p className="text-xs text-gray-600">{t('dashboard.subscription.fullControl')}</p>
            </div>
          </div>
          <span className="text-xs px-2 py-1 bg-[#FFB200]/10 text-[#FFB200] rounded border border-[#FFB200]/30">
              {t('dashboard.subscription.active')}
            </span>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-[#114C5A]/5 border border-[#114C5A]/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('dashboard.subscription.expiryDate')}</span>
              <span className="text-sm font-semibold text-gray-900">
                {subscription.expires_at ? formatDate(subscription.expires_at) : t('dashboard.subscription.permanent')}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">{t('dashboard.subscriptions.timeRemaining')}</span>
              <span className="text-sm font-semibold text-gray-900">75%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
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
    <div className="bg-white border border-[#114C5A]/20 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5 border-b border-[#114C5A]/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#114C5A]/10 rounded-lg flex items-center justify-center text-[#114C5A]">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            {defaultSubscription ? (
              <>
                <h3 className="text-lg font-semibold text-[#114C5A]">{defaultSubscription.name}</h3>
                <p className="text-xs text-gray-600">
                  {defaultSubscription.description || t('dashboard.subscription.availablePackage')}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-[#114C5A]">{t('dashboard.subscription.noActive')}</h3>
                <p className="text-xs text-gray-600">{t('dashboard.subscription.subscribeNow')}</p>
              </>
            )}
          </div>
        </div>
        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300">
            {t('dashboard.subscription.inactive')}
          </span>
      </div>
      
      <div className="p-5 space-y-4">
        {defaultSubscription ? (
          <>
            <div className="bg-[#114C5A]/5 border border-[#114C5A]/10 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">السعر</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {defaultSubscription.price} {t('dashboard.stats.currency')}
                  </span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">مدة الاشتراك</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {defaultSubscription.duration_type === 'monthly' ? 'شهري' :
                     defaultSubscription.duration_type === '3months' ? '3 أشهر' :
                     defaultSubscription.duration_type === '6months' ? '6 أشهر' :
                     defaultSubscription.duration_type === 'yearly' ? 'سنوي' : defaultSubscription.duration_type}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-[#114C5A]/5 border border-[#114C5A]/10 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {t('dashboard.subscription.subscribeNow')}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 border border-gray-300">
              <AlertCircle className="w-8 h-8 text-gray-600" />
            </div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">{t('dashboard.subscription.noActive')}</h4>
            <p className="text-sm text-gray-600">{t('dashboard.subscription.subscribeNow')}</p>
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
