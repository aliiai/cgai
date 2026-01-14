import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  Calendar, 
  DollarSign, 
  Phone, 
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import EmptyState from '../../components/dashboard/EmptyState';
import { useThemeStore } from '../../storeApi/store/theme.store';
import { getReadyAppOrders, type ReadyAppOrder } from '../../storeApi/api/ready-apps.api';
import { STORAGE_BASE_URL } from '../../storeApi/config/constants';
import { parseDate } from '../../utils/date.utils';

const StatusBadge = ({ status }: { status: string }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();
  
  const styles: Record<string, { bg: string; text: string; border: string }> = {
    pending: {
      bg: isDarkMode ? 'bg-amber-500/20' : 'bg-amber-50',
      text: isDarkMode ? 'text-amber-400' : 'text-amber-700',
      border: isDarkMode ? 'border-amber-500/30' : 'border-amber-200',
    },
    processing: {
      bg: isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50',
      text: isDarkMode ? 'text-blue-400' : 'text-blue-700',
      border: isDarkMode ? 'border-blue-500/30' : 'border-blue-200',
    },
    completed: {
      bg: isDarkMode ? 'bg-green-500/20' : 'bg-green-50',
      text: isDarkMode ? 'text-green-400' : 'text-green-700',
      border: isDarkMode ? 'border-green-500/30' : 'border-green-200',
    },
    cancelled: {
      bg: isDarkMode ? 'bg-red-500/20' : 'bg-red-50',
      text: isDarkMode ? 'text-red-400' : 'text-red-700',
      border: isDarkMode ? 'border-red-500/30' : 'border-red-200',
    },
  };

  const labels: Record<string, string> = {
    pending: t('dashboard.myPurchases.status.pending') || 'قيد الانتظار',
    processing: t('dashboard.myPurchases.status.processing') || 'قيد المعالجة',
    completed: t('dashboard.myPurchases.status.completed') || 'مكتمل',
    cancelled: t('dashboard.myPurchases.status.cancelled') || 'ملغي',
  };

  const icons: Record<string, React.ReactNode> = {
    pending: <Clock size={14} className="stroke-2" />,
    processing: <Loader2 size={14} className="stroke-2 animate-spin" />,
    completed: <CheckCircle size={14} className="stroke-2" />,
    cancelled: <XCircle size={14} className="stroke-2" />,
  };

  const style = styles[status] || styles.pending;

  return (
    <span className={`
      flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2
      ${style.bg} ${style.text} ${style.border}
      shadow-md transition-all duration-300
    `}>
      {icons[status] || icons.pending}
      {labels[status] || status}
    </span>
  );
};

const MyPurchases = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<ReadyAppOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [pagination, setPagination] = useState<{
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Get image URL
  const getImageUrl = (imagePath?: string | null): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    if (cleanPath.startsWith('storage/')) {
      return `${STORAGE_BASE_URL}/${cleanPath}`;
    }
    return `${STORAGE_BASE_URL}/storage/${cleanPath}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = parseDate(dateString);
    if (!date) return dateString;
    const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const locale = i18n.language === 'ar' ? 'ar' : 'en';
      const result = await getReadyAppOrders({
        page: currentPage,
        per_page: perPage,
        status: filter !== 'all' ? filter : undefined,
        locale,
      });

      if (result.success && result.data) {
        setOrders(result.data.orders || []);
        setPagination(result.data.pagination || null);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filter, i18n.language]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Re-fetch when language changes
  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      console.log('Language changed to:', lng, '- Refetching orders...');
      await fetchOrders();
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchOrders]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filterOptions = [
    { value: 'all', label: t('dashboard.myPurchases.all') || 'الكل' },
    { value: 'pending', label: t('dashboard.myPurchases.status.pending') || 'قيد الانتظار' },
    { value: 'processing', label: t('dashboard.myPurchases.status.processing') || 'قيد المعالجة' },
    { value: 'completed', label: t('dashboard.myPurchases.status.completed') || 'مكتمل' },
    { value: 'cancelled', label: t('dashboard.myPurchases.status.cancelled') || 'ملغي' },
  ];

  return (
    <div className={`pb-8 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <DashboardPageHeader
          title={t('dashboard.myPurchases.title') || 'مشترياتي'}
          subtitle={t('dashboard.myPurchases.subtitle') || 'عرض جميع طلبات شراء التطبيقات الجاهزة'}
        />

        {/* Statistics Cards */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className={`rounded-2xl p-6 border shadow-lg ${
              isDarkMode 
                ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  isDarkMode ? 'bg-primary/20' : 'bg-primary/10'
                }`}>
                  <ShoppingBag className={`w-6 h-6 ${isDarkMode ? 'text-primary' : 'text-primary'}`} />
                </div>
              </div>
              <div className={`text-3xl font-black mb-1 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {pagination?.total || orders.length}
              </div>
              <div className={`text-sm font-semibold ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                {t('dashboard.myPurchases.totalOrders') || 'إجمالي الطلبات'}
              </div>
            </div>

            <div className={`rounded-2xl p-6 border shadow-lg ${
              isDarkMode 
                ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  isDarkMode ? 'bg-amber-500/20' : 'bg-amber-500/10'
                }`}>
                  <Clock className={`w-6 h-6 ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`} />
                </div>
              </div>
              <div className={`text-3xl font-black mb-1 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {orders.filter(o => o.status === 'pending').length}
              </div>
              <div className={`text-sm font-semibold ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                {t('dashboard.myPurchases.status.pending') || 'قيد الانتظار'}
              </div>
            </div>

            <div className={`rounded-2xl p-6 border shadow-lg ${
              isDarkMode 
                ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'
                }`}>
                  <Loader2 className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                </div>
              </div>
              <div className={`text-3xl font-black mb-1 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {orders.filter(o => o.status === 'processing').length}
              </div>
              <div className={`text-sm font-semibold ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                {t('dashboard.myPurchases.status.processing') || 'قيد المعالجة'}
              </div>
            </div>

            <div className={`rounded-2xl p-6 border shadow-lg ${
              isDarkMode 
                ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  isDarkMode ? 'bg-green-500/20' : 'bg-green-500/10'
                }`}>
                  <CheckCircle className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                </div>
              </div>
              <div className={`text-3xl font-black mb-1 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {orders.filter(o => o.status === 'completed').length}
              </div>
              <div className={`text-sm font-semibold ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                {t('dashboard.myPurchases.status.completed') || 'مكتمل'}
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className={`mb-6 p-6 rounded-2xl border shadow-lg ${
          isDarkMode 
            ? 'bg-slate-800/80 backdrop-blur-sm border-slate-700' 
            : 'bg-white/80 backdrop-blur-sm border-gray-200'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-xl ${
              isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
            }`}>
              <Filter className={`w-5 h-5 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-600'
              }`} />
            </div>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                isDarkMode
                  ? 'bg-slate-700/50 border-slate-600 text-white focus:border-primary'
                  : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-primary'
              } focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold`}
              dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Orders List */}
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => {
                  const appName = i18n.language === 'ar' 
                    ? order.app.name 
                    : (order.app.name_en || order.app.name);
                  const categoryName = order.app.category
                    ? (i18n.language === 'ar' 
                        ? order.app.category.name 
                        : (order.app.category.name_en || order.app.category.name))
                    : '';

                  return (
                    <div
                      key={order.id}
                      className={`group rounded-3xl border-2 overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                        isDarkMode 
                          ? 'bg-slate-800/90 backdrop-blur-sm border-slate-700 hover:border-primary/50' 
                          : 'bg-white/90 backdrop-blur-sm border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      <div className="p-6 md:p-8">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* App Image */}
                          <div 
                            className="flex-shrink-0 cursor-pointer group/image"
                            onClick={() => navigate(`/admin/ready-apps/${order.app.id}`)}
                          >
                            {order.app.main_image ? (
                              <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 group-hover/image:border-primary transition-all">
                                <img
                                  src={getImageUrl(order.app.main_image)}
                                  alt={appName || 'App'}
                                  className="w-40 h-40 md:w-48 md:h-48 object-cover group-hover/image:scale-110 transition-transform duration-500"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '';
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity" />
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/image:opacity-100 transition-opacity">
                                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                                    <ArrowRight className="w-5 h-5 text-primary" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className={`w-40 h-40 md:w-48 md:h-48 rounded-2xl flex items-center justify-center border-2 ${
                                isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-100 border-gray-200'
                              }`}>
                                <Package className={`w-20 h-20 ${
                                  isDarkMode ? 'text-slate-500' : 'text-gray-400'
                                }`} />
                              </div>
                            )}
                          </div>

                          {/* Order Details */}
                          <div className="flex-1 space-y-5">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 
                                    className={`text-2xl font-black cursor-pointer hover:text-primary transition ${
                                      isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}
                                    onClick={() => navigate(`/admin/ready-apps/${order.app.id}`)}
                                  >
                                    {appName || 'Untitled App'}
                                  </h3>
                                  <button
                                    onClick={() => navigate(`/admin/ready-apps/${order.app.id}`)}
                                    className={`p-2 rounded-lg transition ${
                                      isDarkMode 
                                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                    }`}
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                </div>
                                {categoryName && (
                                  <div className="flex items-center gap-2">
                                    <Package className={`w-4 h-4 ${
                                      isDarkMode ? 'text-primary/80' : 'text-primary'
                                    }`} />
                                    <p className={`text-sm font-semibold ${
                                      isDarkMode ? 'text-slate-400' : 'text-gray-500'
                                    }`}>
                                      {categoryName}
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className="flex-shrink-0">
                                <StatusBadge status={order.status} />
                              </div>
                            </div>

                            {/* Order Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className={`p-4 rounded-xl border ${
                                isDarkMode 
                                  ? 'bg-slate-700/50 border-slate-600' 
                                  : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
                              }`}>
                                <div className="flex items-center gap-3 mb-2">
                                  <div className={`p-2 rounded-lg ${
                                    isDarkMode ? 'bg-primary/20' : 'bg-primary/10'
                                  }`}>
                                    <DollarSign className={`w-5 h-5 ${
                                      isDarkMode ? 'text-primary' : 'text-primary'
                                    }`} />
                                  </div>
                                  <p className={`text-xs font-semibold uppercase tracking-wider ${
                                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                                  }`}>
                                    {t('dashboard.myPurchases.price') || 'السعر'}
                                  </p>
                                </div>
                                <p className={`text-2xl font-black ${
                                  isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {order.price.toLocaleString()} {order.currency || 'ر.س'}
                                </p>
                              </div>

                              <div className={`p-4 rounded-xl border ${
                                isDarkMode 
                                  ? 'bg-slate-700/50 border-slate-600' 
                                  : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
                              }`}>
                                <div className="flex items-center gap-3 mb-2">
                                  <div className={`p-2 rounded-lg ${
                                    isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'
                                  }`}>
                                    <Calendar className={`w-5 h-5 ${
                                      isDarkMode ? 'text-blue-400' : 'text-blue-500'
                                    }`} />
                                  </div>
                                  <p className={`text-xs font-semibold uppercase tracking-wider ${
                                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                                  }`}>
                                    {t('dashboard.myPurchases.orderDate') || 'تاريخ الطلب'}
                                  </p>
                                </div>
                                <p className={`text-sm font-bold ${
                                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                                }`}>
                                  {formatDate(order.created_at)}
                                </p>
                              </div>

                              <div className={`p-4 rounded-xl border ${
                                isDarkMode 
                                  ? 'bg-slate-700/50 border-slate-600' 
                                  : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
                              }`}>
                                <div className="flex items-center gap-3 mb-2">
                                  <div className={`p-2 rounded-lg ${
                                    isDarkMode 
                                      ? order.contact_preference === 'phone' ? 'bg-green-500/20' : 'bg-purple-500/20'
                                      : order.contact_preference === 'phone' ? 'bg-green-500/10' : 'bg-purple-500/10'
                                  }`}>
                                    {order.contact_preference === 'phone' ? (
                                      <Phone className={`w-5 h-5 ${
                                        isDarkMode ? 'text-green-400' : 'text-green-500'
                                      }`} />
                                    ) : (
                                      <Mail className={`w-5 h-5 ${
                                        isDarkMode ? 'text-purple-400' : 'text-purple-500'
                                      }`} />
                                    )}
                                  </div>
                                  <p className={`text-xs font-semibold uppercase tracking-wider ${
                                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                                  }`}>
                                    {t('dashboard.myPurchases.contactPreference') || 'تفضيل التواصل'}
                                  </p>
                                </div>
                                <p className={`text-sm font-bold ${
                                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                                }`}>
                                  {order.contact_preference === 'phone' 
                                    ? (t('dashboard.myPurchases.phone') || 'هاتف')
                                    : (t('dashboard.myPurchases.email') || 'بريد إلكتروني')
                                  }
                                </p>
                              </div>

                              {order.processed_at && (
                                <div className={`p-4 rounded-xl border ${
                                  isDarkMode 
                                    ? 'bg-slate-700/50 border-slate-600' 
                                    : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
                                }`}>
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-lg ${
                                      isDarkMode ? 'bg-green-500/20' : 'bg-green-500/10'
                                    }`}>
                                      <CheckCircle className={`w-5 h-5 ${
                                        isDarkMode ? 'text-green-400' : 'text-green-500'
                                      }`} />
                                    </div>
                                    <p className={`text-xs font-semibold uppercase tracking-wider ${
                                      isDarkMode ? 'text-slate-400' : 'text-gray-500'
                                    }`}>
                                      {t('dashboard.myPurchases.processedAt') || 'تاريخ المعالجة'}
                                    </p>
                                  </div>
                                  <p className={`text-sm font-bold ${
                                    isDarkMode ? 'text-slate-300' : 'text-gray-700'
                                  }`}>
                                    {formatDate(order.processed_at)}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Notes */}
                            {order.notes && (
                              <div className={`p-5 rounded-xl border ${
                                isDarkMode 
                                  ? 'bg-slate-700/50 border-slate-600' 
                                  : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
                              }`}>
                                <div className="flex items-center gap-2 mb-3">
                                  <FileText className={`w-5 h-5 ${
                                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                                  }`} />
                                  <p className={`text-sm font-bold ${
                                    isDarkMode ? 'text-slate-300' : 'text-gray-700'
                                  }`}>
                                    {t('dashboard.myPurchases.notes') || 'ملاحظات'}
                                  </p>
                                </div>
                                <p className={`text-sm leading-relaxed ${
                                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                                }`}>
                                  {order.notes}
                                </p>
                              </div>
                            )}

                            {/* Order ID */}
                            <div className={`flex items-center justify-between pt-4 border-t ${
                              isDarkMode ? 'border-slate-700' : 'border-gray-200'
                            }`}>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-semibold ${
                                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                                }`}>
                                  {t('dashboard.myPurchases.orderId') || 'رقم الطلب'}:
                                </span>
                                <span className={`text-sm font-black ${
                                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                                }`}>
                                  #{order.id}
                                </span>
                              </div>
                              <button
                                onClick={() => navigate(`/admin/ready-apps/${order.app.id}`)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition ${
                                  isDarkMode
                                    ? 'bg-primary/20 text-primary hover:bg-primary/30'
                                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                                }`}
                              >
                                {t('dashboard.myPurchases.viewApp') || 'عرض التطبيق'}
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                  <div className={`mt-8 p-6 rounded-2xl border ${
                    isDarkMode 
                      ? 'bg-slate-800/80 backdrop-blur-sm border-slate-700' 
                      : 'bg-white/80 backdrop-blur-sm border-gray-200'
                  }`}>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className={`text-sm font-semibold ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-500'
                      }`}>
                        {t('dashboard.myPurchases.showing') || 'عرض'} {pagination.from}-{pagination.to} {t('dashboard.myPurchases.of') || 'من'} {pagination.total} {t('dashboard.myPurchases.results') || 'نتيجة'}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`p-2.5 rounded-xl transition-all ${
                            currentPage === 1
                              ? 'opacity-50 cursor-not-allowed'
                              : isDarkMode
                                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        <div className="flex gap-1">
                          {[...Array(pagination.last_page)].map((_, index) => {
                            const page = index + 1;
                            if (
                              page === 1 ||
                              page === pagination.last_page ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`px-4 py-2 rounded-xl font-bold transition-all min-w-[44px] ${
                                    currentPage === page
                                      ? 'bg-primary text-white shadow-lg scale-105'
                                      : isDarkMode
                                        ? 'bg-slate-700 hover:bg-slate-600 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            } else if (
                              page === currentPage - 2 ||
                              page === currentPage + 2
                            ) {
                              return (
                                <span key={page} className={`px-2 py-2 ${
                                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                                }`}>
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === pagination.last_page}
                          className={`p-2.5 rounded-xl transition-all ${
                            currentPage === pagination.last_page
                              ? 'opacity-50 cursor-not-allowed'
                              : isDarkMode
                                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState
                icon={ShoppingBag}
                title={t('dashboard.myPurchases.noOrders') || 'لا توجد طلبات'}
                message={t('dashboard.myPurchases.noOrdersMessage') || 'لم يتم العثور على طلبات شراء'}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyPurchases;

