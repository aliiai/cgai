import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle,
  Clock,
  XCircle,
  Upload,
  Loader2,
  X,
  AlertCircle,
  Shield
} from 'lucide-react';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import EmptyState from '../../components/dashboard/EmptyState';
import {
  getSubscriptions,
  getActiveSubscription,
  getSubscriptionRequests,
  createSubscriptionRequest,
  useThemeStore,
} from '../../storeApi/storeApi';
import { STORAGE_BASE_URL } from '../../storeApi/config/constants';
import type {
  Subscription,
  SubscriptionRequest,
  ActiveSubscription,
} from '../../types/types';
import { getLocalizedName, getLocalizedDescription } from '../../utils/localization';
import Swal from 'sweetalert2';

const Subscriptions = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useThemeStore();
  
  // تحديد الاتجاه بناءً على اللغة
  const isRTL = i18n.language === 'ar';
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null);
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [pendingRequest, setPendingRequest] = useState<SubscriptionRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // جلب البيانات
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // جلب الباقات مع معلومات المستخدم
      const subscriptionsResult = await getSubscriptions();
      let hasActiveSubscription = false;

      if (subscriptionsResult.success && subscriptionsResult.data) {
        setSubscriptions(subscriptionsResult.data.subscriptions || []);
        if (subscriptionsResult.data.active_subscription) {
          setActiveSubscription(subscriptionsResult.data.active_subscription);
          hasActiveSubscription = true;
        }
        setPendingRequest(subscriptionsResult.data.pending_request || null);
      } else {
        // إذا فشل getSubscriptions، نترك القائمة فارغة
        // (لا نستخدم getPublicSubscriptions لأن الـ endpoint غير موجود)
        setSubscriptions([]);
      }

      // جلب الاشتراك النشط فقط إذا لم نحصل عليه من getSubscriptions
      if (!hasActiveSubscription) {
        const activeResult = await getActiveSubscription();
        if (activeResult.success && activeResult.data) {
          setActiveSubscription(activeResult.data);
        }
      }

      // جلب طلبات الاشتراك
      const requestsResult = await getSubscriptionRequests();
      if (requestsResult.success) {
        setRequests(requestsResult.data);
        // العثور على طلب معلق
        const pending = requestsResult.data.find(req => req.status === 'pending');
        if (pending) {
          setPendingRequest(pending);
        }
      }
    } catch (error) {
      console.error('Error fetching subscriptions data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper Functions
  const getDurationText = (durationType: string) => {
    const durationMap: Record<string, string> = {
      monthly: t('dashboard.subscriptions.monthly'),
      month: t('dashboard.subscriptions.monthly'),
      '3months': t('dashboard.subscriptions.threeMonths'),
      '6months': t('dashboard.subscriptions.sixMonths'),
      yearly: t('dashboard.subscriptions.yearly'),
      year: t('dashboard.subscriptions.yearly')
    };
    return durationMap[durationType] || durationType;
  };

  const formatDate = (date: any) => {
    const dateString = typeof date === 'string' 
      ? date 
      : date?.formatted || date?.date?.formatted || '';
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPaymentProofUrl = (paymentProofPath: string) => {
    if (!paymentProofPath) return null;
    return `${STORAGE_BASE_URL}/storage/${paymentProofPath}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError(t('dashboard.subscriptions.invalidFileType'));
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError(t('dashboard.subscriptions.fileTooLarge'));
        return;
      }

      setPaymentProof(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setPaymentProof(null);
    setPaymentProofPreview(null);
    setError(null);
  };

  const handleSubscribe = (subscription: Subscription) => {
    // إذا كان هناك طلب معلق، لا يمكن إرسال طلب جديد
    if (pendingRequest) {
      Swal.fire({
        icon: 'warning',
        title: t('dashboard.subscriptions.pendingRequest'),
        text: t('dashboard.subscriptions.pendingRequestMessage'),
        confirmButtonText: t('logout.ok'),
        confirmButtonColor: '#FFB200',
      });
      return;
    }

    // إذا كان المستخدم مشتركاً في هذه الباقة نفسها، لا يمكن الوصول هنا لأن الزر مخفي
    // لكن نضيف التحقق كإجراء احترازي
    if (activeSubscription && activeSubscription.subscription_id === subscription.id) {
      return;
    }

    // فتح النموذج للاشتراك أو تغيير الباقة
    setSelectedSubscription(subscription);
    setShowSubscribeModal(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubscription) return;
    if (!paymentProof) {
      setError(t('dashboard.subscriptions.uploadPaymentProof'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createSubscriptionRequest({
        subscription_id: selectedSubscription.id,
        payment_proof: paymentProof,
      });

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: t('dashboard.subscriptions.success'),
          text: result.message || t('dashboard.subscriptions.requestSent'),
          confirmButtonText: t('logout.ok'),
          confirmButtonColor: '#114C5A',
        });

        setShowSubscribeModal(false);
        setSelectedSubscription(null);
        setPaymentProof(null);
        setPaymentProofPreview(null);
        setError(null);
        await fetchData();
      } else {
        setError(result.message || t('dashboard.subscriptions.requestError'));
      }
    } catch (error: any) {
      console.error('Error creating subscription request:', error);
      setError(t('dashboard.subscriptions.serverError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; icon: React.ReactNode; class: string }> = isDarkMode ? {
      pending: {
        text: t('dashboard.subscriptions.underReview'),
        icon: <Clock className="w-3.5 h-3.5" />,
        class: 'bg-amber-900/30 text-amber-400 border-amber-700'
      },
      approved: {
        text: t('dashboard.subscriptions.approved'),
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        class: 'bg-emerald-900/30 text-emerald-400 border-emerald-700'
      },
      rejected: {
        text: t('dashboard.subscriptions.rejected'),
        icon: <XCircle className="w-3.5 h-3.5" />,
        class: 'bg-rose-900/30 text-rose-400 border-rose-700'
      }
    } : {
      pending: {
        text: t('dashboard.subscriptions.underReview'),
        icon: <Clock className="w-3.5 h-3.5" />,
        class: 'bg-amber-50 text-amber-700 border-amber-200'
      },
      approved: {
        text: t('dashboard.subscriptions.approved'),
        icon: <CheckCircle className="w-3.5 h-3.5" />,
        class: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      },
      rejected: {
        text: t('dashboard.subscriptions.rejected'),
        icon: <XCircle className="w-3.5 h-3.5" />,
        class: 'bg-rose-50 text-rose-700 border-rose-200'
      }
    };

    const statusInfo = statusMap[status] || {
      text: status,
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      class: isDarkMode ? 'bg-slate-700 text-gray-300 border-slate-600' : 'bg-gray-100 text-gray-700 border-gray-200'
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusInfo.class}`}>
        {statusInfo.icon}
        {statusInfo.text}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <DashboardPageHeader title={t('dashboard.subscriptions.title')} />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn w-full mx-auto pb-12">
      <DashboardPageHeader title={t('dashboard.subscriptions.title')} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeSubscription ? (
            <div className="relative overflow-hidden bg-gradient-to-br from-[#114C5A] to-[#114C5A]/90 rounded-xl shadow-lg text-white p-8 border border-[#114C5A]/20">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-64 h-64 rounded-full bg-white opacity-20 blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 rounded-full bg-black opacity-20 blur-3xl"></div>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-4">
                    <CheckCircle className="w-4 h-4" />
                    {t('dashboard.subscriptions.activeSubscription')}
                  </span>
                  <h3 className="text-3xl font-black mb-2">
                    {getLocalizedName(activeSubscription.subscription, { preferredLanguage: i18n.language === 'ar' ? 'ar' : 'en' }) || t('dashboard.subscriptions.currentPackage')}
                  </h3>
                  <p className="text-white/80 max-w-md line-clamp-2 font-normal">
                    {getLocalizedDescription(activeSubscription.subscription, { preferredLanguage: i18n.language === 'ar' ? 'ar' : 'en' })}
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 min-w-[200px] text-center">
                  <p className="text-white/70 text-sm mb-1 uppercase tracking-wider font-bold">{t('dashboard.subscriptions.timeRemaining')}</p>
                  <div className="text-4xl font-black">
                    {activeSubscription.expires_at ? (
                      <span className={getDaysRemaining(activeSubscription.expires_at)! < 7 ? 'text-rose-300' : ''}>
                        {getDaysRemaining(activeSubscription.expires_at)} <span className="text-sm font-normal opacity-70">{t('dashboard.subscriptions.days')}</span>
                      </span>
                    ) : (
                      '∞'
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap gap-x-12 gap-y-4">
                <div>
                  <p className="text-xs text-white/60 mb-1">{t('dashboard.subscriptions.startDate')}</p>
                  <p className="font-bold">{formatDate(activeSubscription.started_at)}</p>
                </div>
                {activeSubscription.expires_at && (
                  <div>
                    <p className="text-xs text-white/60 mb-1">{t('dashboard.subscription.expiryDate')}</p>
                    <p className="font-bold">{formatDate(activeSubscription.expires_at)}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-white/60 mb-1">{t('dashboard.subscriptions.amountPaid')}</p>
                  <p className="font-bold">{activeSubscription.subscription?.price} {t('dashboard.stats.currency')}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={`border rounded-xl p-8 flex items-center gap-6 transition-colors duration-300 ${
              isDarkMode
                ? 'bg-amber-900/20 border-amber-700/50'
                : 'bg-amber-50 border-amber-200'
            }`}>
              <div className={`p-4 rounded-xl transition-colors duration-300 ${
                isDarkMode ? 'bg-amber-900/30' : 'bg-amber-100'
              }`}>
                <AlertCircle className={`w-8 h-8 transition-colors duration-300 ${
                  isDarkMode ? 'text-amber-400' : 'text-amber-600'
                }`} />
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-1 transition-colors duration-300 ${
                  isDarkMode ? 'text-amber-300' : 'text-amber-900'
                }`}>{t('dashboard.subscription.noActive')}</h3>
                <p className={`font-normal transition-colors duration-300 ${
                  isDarkMode ? 'text-amber-200' : 'text-amber-700'
                }`}>{t('dashboard.subscriptions.noActiveMessage')}</p>
              </div>
            </div>
          )}

          {/* Pending Request Alert */}
          {pendingRequest && (
            <div className={`border-r-4 border-[#FFB200] rounded-xl shadow-sm p-6 flex items-center justify-between group hover:shadow-md transition-all duration-300 ${
              isDarkMode
                ? 'bg-slate-800 border-[#FFB200]/30'
                : 'bg-white border-[#FFB200]/20'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`rounded-xl flex items-center justify-center text-[#FFB200] animate-pulse w-12 h-12 transition-colors duration-300 ${
                  isDarkMode ? 'bg-[#FFB200]/20' : 'bg-[#FFB200]/10'
                }`}>
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{t('dashboard.subscriptions.pendingReview')}</h3>
                    {getStatusBadge('pending')}
                  </div>
                  <p className={`text-sm font-normal transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {t('dashboard.subscription.subscriptionName')} {getLocalizedName(pendingRequest.subscription, { preferredLanguage: i18n.language === 'ar' ? 'ar' : 'en' })} - {formatDate(pendingRequest.created_at)}
                  </p>
                </div>
              </div>
              <p className={`text-xs px-3 py-1 rounded-lg transition-colors duration-300 ${
                isDarkMode
                  ? 'text-gray-300 bg-slate-700'
                  : 'text-gray-600 bg-gray-50'
              }`}>{t('dashboard.subscriptions.activateAccount')}</p>
            </div>
          )}

          {/* Available Subscriptions Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className={`text-2xl font-black transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{t('dashboard.subscriptions.availablePackages')}</h3>
              <div className={`h-1 flex-1 mx-4 rounded-full transition-colors duration-300 ${
                isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
              }`}></div>
            </div>

            {subscriptions.length === 0 ? (
              <EmptyState message={t('dashboard.subscriptions.noPackages')} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subscriptions.map((subscription) => {
                  // التحقق من الباقة الحالية باستخدام subscription_id أو subscription.id
                  const isCurrentSubscription = activeSubscription && (
                    Number(activeSubscription.subscription_id) === Number(subscription.id) ||
                    Number(activeSubscription.subscription?.id) === Number(subscription.id)
                  );

                  // Debug: للتحقق من القيم
                  if (activeSubscription) {
                    console.log('Active Subscription ID:', activeSubscription.subscription_id, 'Subscription ID:', subscription.id, 'Match:', isCurrentSubscription);
                  }

                  return (
                    <div
                      key={subscription.id}
                      className={`rounded-xl border p-8 shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col group overflow-hidden ${
                        isDarkMode
                          ? 'bg-slate-800 border-slate-700'
                          : 'bg-white border-[#114C5A]/10'
                      } ${
                        isCurrentSubscription
                          ? 'border-[#FFB200] shadow-[#FFB200]/10 ring-2 ring-[#FFB200]/20'
                          : isDarkMode
                            ? 'hover:border-slate-600'
                            : 'hover:border-[#114C5A]/20'
                      }`}
                    >
                      {isCurrentSubscription && (
                        <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} bg-[#FFB200] text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-xl z-50 flex items-center gap-1.5`}>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          {t('dashboard.subscription.activeBadge')}
                        </div>
                      )}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#114C5A]/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110"></div>

                      <div className="mb-8">
                        <h4 className={`text-xl font-black mb-2 group-hover:text-[#114C5A] transition-colors ${
                          isDarkMode
                            ? 'text-white group-hover:text-[#FFB200]'
                            : 'text-gray-900'
                        }`}>
                          {getLocalizedName(subscription, { preferredLanguage: i18n.language === 'ar' ? 'ar' : 'en' })}
                        </h4>
                        <p className={`text-sm leading-relaxed font-normal min-h-[40px] transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {getLocalizedDescription(subscription, { preferredLanguage: i18n.language === 'ar' ? 'ar' : 'en' })}
                        </p>
                      </div>

                      <div className={`mb-8 rounded-xl p-6 flex flex-col items-center border transition-colors duration-300 ${
                        isDarkMode
                          ? 'bg-[#114C5A]/20 border-[#114C5A]/30'
                          : 'bg-[#114C5A]/5 border-[#114C5A]/10'
                      }`}>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-4xl font-black leading-none transition-colors duration-300 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {subscription.price === '0.00' ? t('dashboard.subscriptions.free') : subscription.price}
                          </span>
                          {subscription.price !== '0.00' && (
                            <span className={`font-bold text-sm transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>{t('dashboard.stats.currency')}</span>
                          )}
                        </div>
                        <span className={`text-xs mt-2 font-bold uppercase tracking-widest leading-none transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          / {getDurationText(subscription.duration_type)}
                        </span>
                      </div>

                      {Array.isArray(subscription.features) && subscription.features.length > 0 && (
                        <ul className="space-y-4 mb-8 flex-grow">
                          {subscription.features.map((feature, index) => {
                            // Handle both string array and object array
                            const featureText = typeof feature === 'string' 
                              ? (i18n.language === 'en' && subscription.features_en && subscription.features_en[index]
                                  ? subscription.features_en[index]
                                  : feature)
                              : getLocalizedName(feature as any);
                            
                            return (
                              <li key={index} className={`text-sm flex items-start gap-3 transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                <span className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-300 ${
                                  isDarkMode
                                    ? 'bg-[#114C5A]/20 text-[#FFB200]'
                                    : 'bg-[#114C5A]/10 text-[#114C5A]'
                                }`}>
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </span>
                                <span className="font-semibold">{featureText}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}

                      {/* إخفاء الزر إذا كانت هذه الباقة الحالية المشترك بها */}
                      {!isCurrentSubscription && (
                        <button
                          onClick={() => handleSubscribe(subscription)}
                          disabled={!!pendingRequest}
                          className={`w-full py-4 rounded-xl font-black text-sm transition-all duration-300 transform active:scale-95 ${
                            pendingRequest
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-[#114C5A] text-white hover:bg-[#114C5A]/90 hover:shadow-lg'
                          }`}
                        >
                          {pendingRequest ? t('dashboard.subscriptions.pendingRequest') : t('dashboard.subscriptions.subscribeNow')}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Column: Subscription History */}
        <div className="space-y-8">
          <div className={`rounded-xl border shadow-sm p-6 overflow-hidden transition-colors duration-300 ${
            isDarkMode
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-[#114C5A]/10'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                isDarkMode
                  ? 'bg-[#114C5A]/20 text-[#FFB200]'
                  : 'bg-[#114C5A]/10 text-[#114C5A]'
              }`}>
                <Clock className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-black tracking-tight transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{t('dashboard.subscriptions.subscriptionHistory')}</h3>
            </div>

            {requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className={`group border border-transparent rounded-xl p-4 transition-all duration-300 ${
                      isDarkMode
                        ? 'hover:border-slate-600 hover:bg-slate-700/50'
                        : 'hover:border-[#114C5A]/20 hover:bg-[#114C5A]/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className={`font-black text-sm transition-colors ${
                          isDarkMode
                            ? 'text-white group-hover:text-[#FFB200]'
                            : 'text-gray-900 group-hover:text-[#114C5A]'
                        }`}>
                          {getLocalizedName(request.subscription, { preferredLanguage: i18n.language === 'ar' ? 'ar' : 'en' }) || t('dashboard.subscription.subscriptionName')}
                        </h4>
                        <p className={`text-[11px] font-bold mt-0.5 italic transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {formatDate(request.created_at)}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    {request.admin_notes && (
                      <div className={`border rounded-xl p-3 mb-3 text-[11px] font-medium transition-colors duration-300 ${
                        isDarkMode
                          ? 'border-slate-700 bg-slate-700/50 text-gray-300'
                          : 'border-[#114C5A]/10 bg-[#114C5A]/5 text-gray-700'
                      }`}>
                        <p className={`mb-1 font-black uppercase text-[9px] tracking-wider transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{t('dashboard.subscriptions.adminNotes')}</p>
                        {request.admin_notes}
                      </div>
                    )}

                    {request.payment_proof && (
                      <button
                        onClick={() => {
                          Swal.fire({
                            imageUrl: getPaymentProofUrl(request.payment_proof) || '',
                            imageAlt: 'إثبات الدفع',
                            showCloseButton: true,
                            showConfirmButton: false,
                            width: 'fit-content',
                            background: 'transparent',
                            customClass: { popup: 'p-0 shadow-none border-0' }
                          });
                        }}
                        className="text-[10px] font-black hover:underline flex items-center gap-1 mt-1 text-[#114C5A]"
                      >
                        <Upload className="w-3 h-3" />
                        {t('dashboard.subscriptions.viewPaymentProof')}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
                  isDarkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Clock className="w-8 h-8" />
                </div>
                <p className={`text-sm font-bold uppercase tracking-wider font-normal transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{t('dashboard.subscriptions.noHistory')}</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#114C5A] to-[#114C5A]/90 rounded-xl p-8 text-white relative overflow-hidden group shadow-lg border border-[#114C5A]/20">
            <div className="absolute top-0 right-0 p-2 opacity-10 transform group-hover:scale-110 transition-transform">
              <Shield className="w-24 h-24" />
            </div>
            <h4 className="text-lg font-black mb-2 relative z-10">{t('dashboard.subscriptions.needHelp')}</h4>
            <p className="text-sm text-white/80 mb-6 font-normal relative z-10 leading-relaxed">{t('dashboard.subscriptions.helpDescription')}</p>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-6 py-2 rounded-xl text-sm font-black transition-all relative z-10">{t('dashboard.subscriptions.contactUs')}</button>
          </div>
        </div>
      </div>

      {showSubscribeModal && selectedSubscription && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn bg-black/60">
          <div className={`rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn border transition-colors duration-300 ${
            isDarkMode
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-[#114C5A]/10'
          }`}>
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                    isDarkMode
                      ? 'bg-[#114C5A]/20 text-[#FFB200]'
                      : 'bg-[#114C5A]/10 text-[#114C5A]'
                  }`}>
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-black transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{t('dashboard.subscriptions.confirmSubscription')}</h3>
                    <p className={`text-xs font-bold uppercase tracking-widest mt-0.5 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{t('dashboard.subscriptions.uploadPaymentProofDesc')}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowSubscribeModal(false);
                    setSelectedSubscription(null);
                    setPaymentProof(null);
                    setPaymentProofPreview(null);
                    setError(null);
                  }}
                  className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${
                    isDarkMode
                      ? 'bg-slate-700 text-gray-300 hover:text-rose-400 hover:bg-slate-600'
                      : 'bg-gray-100 text-gray-600 hover:text-rose-500 hover:bg-rose-50'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className={`mb-8 p-6 border rounded-xl transition-colors duration-300 ${
                isDarkMode
                  ? 'border-slate-700 bg-slate-700/50'
                  : 'border-[#114C5A]/10 bg-[#114C5A]/5'
              }`}>
                {activeSubscription && activeSubscription.subscription_id === selectedSubscription.id ? (
                  <div className={`flex items-center gap-3 mb-4 p-3 border rounded-xl transition-colors duration-300 ${
                    isDarkMode
                      ? 'border-[#FFB200]/30 bg-[#FFB200]/10'
                      : 'border-[#FFB200]/20 bg-[#FFB200]/10'
                  }`}>
                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-[#FFB200]" />
                    <p className="text-sm font-black text-[#FFB200]">{t('dashboard.subscriptions.currentlySubscribed')}</p>
                  </div>
                ) : activeSubscription ? (
                  <div className={`flex items-center gap-3 mb-4 p-3 border rounded-xl transition-colors duration-300 ${
                    isDarkMode
                      ? 'bg-amber-900/30 border-amber-700/50'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <AlertCircle className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
                      isDarkMode ? 'text-amber-400' : 'text-amber-600'
                    }`} />
                    <div>
                      <p className={`text-sm font-black mb-1 transition-colors duration-300 ${
                        isDarkMode ? 'text-amber-300' : 'text-amber-900'
                      }`}>{t('dashboard.subscriptions.changePackage')}</p>
                      <p className={`text-xs transition-colors duration-300 ${
                        isDarkMode ? 'text-amber-200' : 'text-amber-700'
                      }`}>
                        {t('dashboard.subscriptions.currentPackageNote', { name: getLocalizedName(activeSubscription.subscription, { preferredLanguage: i18n.language === 'ar' ? 'ar' : 'en' }) || t('dashboard.subscription.subscriptionName') })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className={`flex items-center gap-3 mb-4 p-3 border rounded-xl transition-colors duration-300 ${
                    isDarkMode
                      ? 'bg-emerald-900/30 border-emerald-700/50'
                      : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    <CheckCircle className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
                      isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                    }`} />
                    <p className={`text-sm font-black transition-colors duration-300 ${
                      isDarkMode ? 'text-emerald-300' : 'text-emerald-900'
                    }`}>{t('dashboard.subscriptions.newSubscription')}</p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-black mb-1 transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{getLocalizedName(selectedSubscription, { preferredLanguage: i18n.language === 'ar' ? 'ar' : 'en' })}</h4>
                    <div className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-bold">{getDurationText(selectedSubscription.duration_type)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-black transition-colors duration-300 ${
                      isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
                    }`}>
                      {selectedSubscription.price === '0.00' ? t('dashboard.subscriptions.free') : `${selectedSubscription.price} ${t('dashboard.stats.currency')}`}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-sm font-black mb-3 ml-2 text-gray-900">
                    {t('dashboard.subscriptions.paymentProofImage')}
                  </label>
                  {!paymentProofPreview ? (
                    <div className="relative group">
                      <input
                        type="file"
                        id="payment_proof"
                        accept="image/jpeg,image/png,image/jpg,image/gif"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="payment_proof"
                        className="cursor-pointer flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-xl p-12 transition-all duration-300 group bg-gray-50 border-gray-200 hover:border-[#114C5A] hover:bg-[#114C5A]/5"
                      >
                        <div className="w-16 h-16 shadow-sm rounded-xl flex items-center justify-center transition-colors bg-white text-gray-400 group-hover:text-[#114C5A]">
                          <Upload className="w-10 h-10" />
                        </div>
                        <div className="text-center">
                          <span className="block text-sm font-black mb-1 font-bold transition-colors text-gray-900 group-hover:text-[#114C5A]">
                            {t('dashboard.subscriptions.uploadFile')}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest leading-none text-gray-500">
                            PNG, JPG (MAX. 2MB)
                          </span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-[#114C5A]/10 shadow-lg group">
                      <img
                        src={paymentProofPreview}
                        alt="Payment Proof Preview"
                        className="w-full aspect-[4/3] object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="w-12 h-12 bg-rose-500 text-white rounded-xl shadow-lg hover:bg-rose-600 transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  )}
                  {error && (
                    <p className="text-xs text-rose-500 mt-3 font-bold flex items-center gap-2 bg-rose-50 p-3 rounded-xl border border-rose-100">
                      <XCircle className="w-4 h-4" />
                      {error}
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubscribeModal(false);
                      setSelectedSubscription(null);
                      setPaymentProof(null);
                      setPaymentProofPreview(null);
                      setError(null);
                    }}
                    className="flex-1 py-4 font-black rounded-xl transition-all border font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200"
                  >
                    {t('dashboard.booking.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={!paymentProof || isSubmitting}
                    className={`flex-[2] py-4 rounded-xl font-black text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                      !paymentProof || isSubmitting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                        : 'bg-[#114C5A] hover:bg-[#114C5A]/90 shadow-[#114C5A]/30'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white/50" />
                        <span className="font-bold">{t('dashboard.subscriptions.processing')}</span>
                      </>
                    ) : (
                      <span className="font-bold">{t('dashboard.subscriptions.sendRequestNow')}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
