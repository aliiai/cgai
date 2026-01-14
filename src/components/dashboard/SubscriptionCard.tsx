import { CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../storeApi/store/theme.store';
import type { DashboardSubscription, ActiveSubscription, Subscription } from '../../types/types';

interface SubscriptionCardProps {
  subscription: DashboardSubscription | ActiveSubscription | null;
  availableSubscriptions: Subscription[];
  formatDate: (dateString: string) => string;
}

const SubscriptionCard = ({ subscription, availableSubscriptions, formatDate }: SubscriptionCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();

  // التحقق من وجود اشتراك نشط
  // للـ ActiveSubscription: status === 'active'
  // للـ DashboardSubscription: is_active === true أو status === 'active'
  const isActive = subscription && (
    subscription.status === 'active' || 
    (subscription as DashboardSubscription).is_active === true
  );
  // الحصول على معلومات الباقة (قد تكون nested في subscription.subscription)
  const subInfo = (subscription as any)?.subscription || subscription;
  
  if (isActive && subInfo) {
    return (
      <div className={`rounded-[48px] border shadow-sm overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl h-[45vh] overflwo-y-hidden ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700 hover:shadow-slate-900/50' 
          : 'bg-white border-slate-100 hover:shadow-slate-200/50'
      }`}>
        {/* Header */}
        <div className={`p-8 md:p-10 border-b flex items-center justify-between ${
          isDarkMode 
            ? 'border-slate-700 bg-gradient-to-r from-slate-800/50 to-slate-800' 
            : 'border-slate-50 bg-gradient-to-r from-slate-50/50 to-white'
        }`}>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-500 text-white rounded-[20px] flex items-center justify-center shadow-xl shadow-emerald-500/20 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className={`text-2xl font-black tracking-tight ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>{subInfo.name || t('dashboard.subscription.subscriptionName')}</h3>
              <p className={`text-[10px] font-extrabold uppercase tracking-[0.2em] mt-1 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-400'
              }`}>{t('dashboard.subscription.fullControl')}</p>
            </div>
          </div>
          <div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
              isDarkMode
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-emerald-50 text-emerald-600 border-emerald-200'
            }`}>
              {t('dashboard.subscription.active')}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 flex-grow space-y-6">
          <div className={`flex items-center justify-between p-6 rounded-2xl border ${
            isDarkMode 
              ? 'bg-slate-700/30 border-slate-600' 
              : 'bg-slate-50/30 border-slate-100'
          }`}>
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>{t('dashboard.subscription.expiryDate')}</span>
            <span className={`text-lg font-black ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>{subscription.expires_at ? formatDate(subscription.expires_at) : t('dashboard.subscription.permanent')}</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold uppercase tracking-widest ${
                isDarkMode ? 'text-slate-400' : 'text-slate-400'
              }`}>{t('dashboard.subscriptions.timeRemaining')}</span>
              <span className={`text-sm font-black ${
                isDarkMode ? 'text-primary' : 'text-primary'
              }`}>75%</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${
              isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
            }`}>
              <div className="w-3/4 h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"></div>
            </div>
          </div>

          {/* <div className={`p-6 rounded-2xl border ${
            isDarkMode 
              ? 'bg-slate-700/30 border-slate-600' 
              : 'bg-slate-50/30 border-slate-100'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>تاريخ البدء</span>
                <span className={`text-base font-black ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>{subscription.started_at ? formatDate(subscription.started_at) : '-'}</span>
              </div>
              <div className={`h-px ${
                isDarkMode ? 'bg-slate-600' : 'bg-slate-200'
              }`}></div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>حالة الاشتراك</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isDarkMode
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {subscription.status === 'active' ? t('dashboard.subscription.active') : subscription.status}
                </span>
              </div>
            </div>
          </div> */}
        </div>

        {/* Button */}
        <div className="p-8 md:p-10 pt-0">
          <button
            onClick={() => navigate('/admin/subscriptions')}
            className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group border shadow-sm ${
              isDarkMode
                ? 'bg-primary text-white hover:bg-primary-dark border-primary'
                : 'bg-primary text-white hover:bg-primary-dark border-primary'
            }`}
          >
            <span>{t('dashboard.subscription.manage')}</span>
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </button>
        </div>
      </div>
    );
  }

  // عرض أول باقة متاحة أو الباقة المجانية عند عدم وجود اشتراك نشط
  const defaultSubscription = availableSubscriptions.find(sub => sub.price === '0.00') || availableSubscriptions[0];
  
  return (
    <div className={`rounded-[48px] border shadow-sm overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl ${
      isDarkMode 
        ? 'bg-slate-800 border-slate-700 hover:shadow-slate-900/50' 
        : 'bg-white border-slate-100 hover:shadow-slate-200/50'
    }`}>
      {/* Header */}
      <div className={`p-8 md:p-10 border-b flex items-center justify-between ${
        isDarkMode 
          ? 'border-slate-700 bg-gradient-to-r from-slate-800/50 to-slate-800' 
          : 'border-slate-50 bg-gradient-to-r from-slate-50/50 to-white'
      }`}>
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-amber-500 text-white rounded-[20px] flex items-center justify-center shadow-xl shadow-amber-500/20 transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            {defaultSubscription ? (
              <>
                <h3 className={`text-2xl font-black tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>{defaultSubscription.name}</h3>
                <p className={`text-[10px] font-extrabold uppercase tracking-[0.2em] mt-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-400'
                }`}>
                  {defaultSubscription.description || t('dashboard.subscription.availablePackage')}
                </p>
              </>
            ) : (
              <>
                <h3 className={`text-2xl font-black tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>{t('dashboard.subscription.noActive')}</h3>
                <p className={`text-[10px] font-extrabold uppercase tracking-[0.2em] mt-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-400'
                }`}>{t('dashboard.subscription.subscribeNow')}</p>
              </>
            )}
          </div>
        </div>
        <div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
            isDarkMode
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              : 'bg-amber-50 text-amber-600 border-amber-200'
          }`}>
            {t('dashboard.subscription.inactive')}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8 md:p-10 flex-grow space-y-6">
        {defaultSubscription ? (
          <>
            <div className={`p-6 rounded-2xl border ${
              isDarkMode 
                ? 'bg-slate-700/30 border-slate-600' 
                : 'bg-slate-50/30 border-slate-100'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>السعر</span>
                  <span className={`text-lg font-black ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>{defaultSubscription.price} {t('dashboard.stats.currency')}</span>
                </div>
                <div className={`h-px ${
                  isDarkMode ? 'bg-slate-600' : 'bg-slate-200'
                }`}></div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>مدة الاشتراك</span>
                  <span className={`text-base font-black ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {defaultSubscription.duration_type === 'monthly' ? 'شهري' :
                     defaultSubscription.duration_type === '3months' ? '3 أشهر' :
                     defaultSubscription.duration_type === '6months' ? '6 أشهر' :
                     defaultSubscription.duration_type === 'yearly' ? 'سنوي' : defaultSubscription.duration_type}
                  </span>
                </div>
              </div>
            </div>
            <div className={`p-6 rounded-2xl border ${
              isDarkMode 
                ? 'bg-slate-700/30 border-slate-600' 
                : 'bg-slate-50/30 border-slate-100'
            }`}>
              <p className={`text-sm leading-relaxed ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {t('dashboard.subscription.subscribeNow')}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className={`w-24 h-24 rounded-[40px] flex items-center justify-center mx-auto mb-8 border shadow-inner ${
              isDarkMode 
                ? 'bg-slate-700 text-slate-400 border-slate-600' 
                : 'bg-slate-50 text-slate-200 border-slate-100'
            }`}>
              <AlertCircle className="w-12 h-12" />
            </div>
            <h4 className={`text-lg font-black uppercase tracking-widest mb-4 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-400'
            }`}>{t('dashboard.subscription.noActive')}</h4>
            <p className={`text-sm mb-6 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>{t('dashboard.subscription.subscribeNow')}</p>
          </div>
        )}
      </div>
      
      {/* Button */}
      <div className="p-8 md:p-10 pt-0">
        <button
          onClick={() => navigate('/admin/subscriptions')}
          className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group border shadow-sm ${
            isDarkMode
              ? 'bg-primary text-white hover:bg-primary-dark border-primary'
              : 'bg-primary text-white hover:bg-primary-dark border-primary'
          }`}
        >
          <span>{t('dashboard.subscription.browse')}</span>
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;

