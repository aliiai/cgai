import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../storeApi/store/theme.store';
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
      '3months': t('dashboard.subscriptions.threeMonths'),
      '6months': t('dashboard.subscriptions.sixMonths'),
      yearly: t('dashboard.subscriptions.yearly')
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
        confirmButtonColor: '#00adb5',
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
          confirmButtonColor: '#00adb5',
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
    const statusMap: Record<string, { text: string; icon: React.ReactNode; class: string }> = {
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
      class: 'bg-slate-50 text-slate-700 border-slate-200'
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
            <div className="relative overflow-hidden bg-gradient-to-br from-[#00adb5] to-[#008a91] rounded-3xl shadow-xl shadow-primary/20 text-white p-8 animate-scaleIn">
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
                    {getLocalizedName(activeSubscription.subscription) || t('dashboard.subscriptions.currentPackage')}
                  </h3>
                  <p className="text-white/80 max-w-md line-clamp-2 font-normal">
                    {getLocalizedDescription(activeSubscription.subscription)}
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
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 flex items-center gap-6 animate-scaleIn">
              <div className="bg-amber-100 p-4 rounded-2xl">
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-900 mb-1">{t('dashboard.subscription.noActive')}</h3>
                <p className="text-amber-700 font-normal">{t('dashboard.subscriptions.noActiveMessage')}</p>
              </div>
            </div>
          )}

          {/* Pending Request Alert */}
          {pendingRequest && (
            <div className="bg-white border-r-4 border-amber-400 rounded-2xl shadow-sm p-6 flex items-center justify-between group hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 animate-pulse">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{t('dashboard.subscriptions.pendingReview')}</h3>
                    {getStatusBadge('pending')}
                  </div>
                  <p className="text-sm text-gray-500 font-normal">
                    {t('dashboard.subscription.subscriptionName')} {getLocalizedName(pendingRequest.subscription)} - {formatDate(pendingRequest.created_at)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">{t('dashboard.subscriptions.activateAccount')}</p>
            </div>
          )}

          {/* Available Subscriptions Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className={`text-2xl font-black ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>{t('dashboard.subscriptions.availablePackages')}</h3>
              <div className="h-1 flex-1 mx-4 bg-slate-100 rounded-full"></div>
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
                      className={`card-3d rounded-3xl border p-8 shadow-sm hover:shadow-xl transition-all duration-500 relative flex flex-col group overflow-hidden ${
                        isDarkMode 
                          ? isCurrentSubscription
                            ? 'bg-slate-800 border-primary shadow-primary/10 ring-2 ring-primary/20'
                            : 'bg-slate-800 border-slate-700 hover:border-primary/20'
                          : isCurrentSubscription
                            ? 'bg-white border-primary shadow-primary/10 ring-2 ring-primary/20'
                            : 'bg-white border-slate-100 hover:border-primary/20'
                      }`}
                    >
                      {isCurrentSubscription && (
                        <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} bg-primary text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-xl z-50 flex items-center gap-1.5`}>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          {t('dashboard.subscription.activeBadge')}
                        </div>
                      )}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110"></div>

                      <div className="mb-8">
                        <h4 className={`text-xl font-black mb-2 group-hover:text-primary transition-colors ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>
                          {getLocalizedName(subscription)}
                        </h4>
                        <p className={`text-sm leading-relaxed font-normal min-h-[40px] ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {getLocalizedDescription(subscription)}
                        </p>
                      </div>

                      <div className={`mb-8 rounded-2xl p-6 flex flex-col items-center ${
                        isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
                      }`}>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-4xl font-black leading-none ${
                            isDarkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {subscription.price === '0.00' ? t('dashboard.subscriptions.free') : subscription.price}
                          </span>
                          {subscription.price !== '0.00' && (
                            <span className={`font-bold text-sm ${
                              isDarkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}>{t('dashboard.stats.currency')}</span>
                          )}
                        </div>
                        <span className={`text-xs mt-2 font-bold uppercase tracking-widest leading-none ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-400'
                        }`}>
                          / {getDurationText(subscription.duration_type)}
                        </span>
                      </div>

                      {Array.isArray(subscription.features) && subscription.features.length > 0 && (
                        <ul className="space-y-4 mb-8 flex-grow">
                          {subscription.features.map((feature, index) => (
                            <li key={index} className={`text-sm flex items-start gap-3 ${
                              isDarkMode ? 'text-slate-300' : 'text-slate-600'
                            }`}>
                              <span className="w-5 h-5 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle className="w-3.5 h-3.5" />
                              </span>
                              <span className="font-semibold">{getLocalizedName(feature)}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* إخفاء الزر إذا كانت هذه الباقة الحالية المشترك بها */}
                      {!isCurrentSubscription && (
                        <button
                          onClick={() => handleSubscribe(subscription)}
                          disabled={!!pendingRequest}
                          className={`w-full py-4 rounded-2xl font-black text-sm transition-all duration-300 transform active:scale-95 ${pendingRequest
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-slate-900 text-white hover:bg-primary hover:shadow-lg hover:shadow-primary/30'
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
          <div className={`rounded-3xl border shadow-sm p-6 overflow-hidden ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-100'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className={`text-lg font-black tracking-tight ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>{t('dashboard.subscriptions.subscriptionHistory')}</h3>
            </div>

            {requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="group border border-transparent hover:border-slate-100 hover:bg-slate-50/50 rounded-2xl p-4 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className={`font-black text-sm group-hover:text-primary transition-colors ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>
                          {getLocalizedName(request.subscription) || t('dashboard.subscription.subscriptionName')}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-bold mt-0.5 italic">
                          {formatDate(request.created_at)}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    {request.admin_notes && (
                      <div className={`border rounded-xl p-3 mb-3 text-[11px] font-medium ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-slate-300' 
                          : 'bg-white border-slate-100 text-slate-600'
                      }`}>
                        <p className="text-slate-400 mb-1 font-black uppercase text-[9px] tracking-wider">ملاحظات الإدارة:</p>
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
                        className="text-[10px] font-black text-primary hover:underline flex items-center gap-1 mt-1"
                      >
                        <Upload className="w-3 h-3" />
                        عرض إثبات الدفع
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-4">
                  <Clock className="w-8 h-8" />
                </div>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-wider font-normal">لا يوجد سجل حالياً</p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 p-2 opacity-10 transform group-hover:scale-110 transition-transform">
              <Shield className="w-24 h-24" />
            </div>
            <h4 className="text-lg font-black mb-2 relative z-10">{t('dashboard.subscriptions.needHelp')}</h4>
            <p className="text-sm text-white/70 mb-6 font-normal relative z-10 leading-relaxed">{t('dashboard.subscriptions.helpDescription')}</p>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 px-6 py-2 rounded-xl text-sm font-black transition-all relative z-10">{t('dashboard.subscriptions.contactUs')}</button>
          </div>
        </div>
      </div>

      {showSubscribeModal && selectedSubscription && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-black ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>{t('dashboard.subscriptions.confirmSubscription')}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">{t('dashboard.subscriptions.uploadPaymentProofDesc')}</p>
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
                  className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                {activeSubscription && activeSubscription.subscription_id === selectedSubscription.id ? (
                  <div className="flex items-center gap-3 mb-4 p-3 bg-primary/10 border border-primary/20 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-sm font-black text-primary">{t('dashboard.subscriptions.currentlySubscribed')}</p>
                  </div>
                ) : activeSubscription ? (
                  <div className="flex items-center gap-3 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-black text-amber-900 mb-1">{t('dashboard.subscriptions.changePackage')}</p>
                      <p className="text-xs text-amber-700">
                        {t('dashboard.subscriptions.currentPackageNote', { name: getLocalizedName(activeSubscription.subscription) || t('dashboard.subscription.subscriptionName') })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <p className="text-sm font-black text-emerald-900">{t('dashboard.subscriptions.newSubscription')}</p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-black mb-1 ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>{getLocalizedName(selectedSubscription)}</h4>
                    <div className={`flex items-center gap-1.5 text-xs ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-bold">{getDurationText(selectedSubscription.duration_type)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary">
                      {selectedSubscription.price === '0.00' ? t('dashboard.subscriptions.free') : `${selectedSubscription.price} ${t('dashboard.stats.currency')}`}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-3 ml-2">
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
                        className="cursor-pointer flex flex-col items-center justify-center gap-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[28px] p-12 hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
                      >
                        <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                          <Upload className="w-10 h-10" />
                        </div>
                        <div className="text-center">
                          <span className="block text-sm font-black text-slate-700 mb-1 group-hover:text-primary font-bold">
                            {t('dashboard.subscriptions.uploadFile')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                            PNG, JPG (MAX. 2MB)
                          </span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative rounded-[28px] overflow-hidden border border-slate-100 shadow-lg group">
                      <img
                        src={paymentProofPreview}
                        alt="Payment Proof Preview"
                        className="w-full aspect-[4/3] object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="w-12 h-12 bg-rose-500 text-white rounded-2xl shadow-lg hover:bg-rose-600 transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  )}
                  {error && (
                    <p className="text-xs text-rose-500 mt-3 font-bold flex items-center gap-2 bg-rose-50 p-3 rounded-xl border border-rose-100 font-bold">
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
                    className="flex-1 py-4 bg-slate-50 text-slate-400 font-black rounded-2xl hover:bg-slate-100 transition-all border border-slate-100 font-bold"
                  >
                    {t('dashboard.booking.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={!paymentProof || isSubmitting}
                    className={`flex-[2] py-4 rounded-2xl font-black text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${!paymentProof || isSubmitting
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-primary hover:bg-primary-dark shadow-primary/30'
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
