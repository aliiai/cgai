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
  FileText,
  Tag
} from 'lucide-react';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import EmptyState from '../../components/dashboard/EmptyState';
import { getReadyAppOrders, type ReadyAppOrder } from '../../storeApi/api/ready-apps.api';
import { STORAGE_BASE_URL } from '../../storeApi/config/constants';
import { parseDate } from '../../utils/date.utils';

const StatusBadge = ({ status }: { status: string }) => {
  const { t } = useTranslation();
  
  const styles: Record<string, string> = {
    pending: 'bg-[#FFB200]/10 text-[#FFB200] border-[#FFB200]/20',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  };

  const labels: Record<string, string> = {
    pending: t('dashboard.myPurchases.status.pending') || 'قيد الانتظار',
    processing: t('dashboard.myPurchases.status.processing') || 'قيد المعالجة',
    completed: t('dashboard.myPurchases.status.completed') || 'مكتمل',
    cancelled: t('dashboard.myPurchases.status.cancelled') || 'ملغي',
    rejected: t('dashboard.myPurchases.status.rejected') || 'مرفوض',
  };

  const icons: Record<string, React.ReactNode> = {
    pending: <Clock size={14} className="stroke-2" />,
    processing: <Loader2 size={14} className="stroke-2 animate-spin" />,
    completed: <CheckCircle size={14} className="stroke-2" />,
    cancelled: <XCircle size={14} className="stroke-2" />,
    rejected: <XCircle size={14} className="stroke-2" />,
  };

  return (
    <span className={`
      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border
      ${styles[status] || styles.pending}
      transition-all duration-300
    `}>
      {icons[status] || icons.pending}
      {labels[status] || status}
    </span>
  );
};

const MyPurchases = () => {
  const { t, i18n } = useTranslation();
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
    { value: 'rejected', label: t('dashboard.myPurchases.status.rejected') || 'مرفوض' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title={t('dashboard.myPurchases.title') || 'مشترياتي'}
          subtitle={t('dashboard.myPurchases.subtitle') || 'عرض جميع طلبات شراء التطبيقات الجاهزة'}
        />
        <div className="flex flex-col justify-center items-center py-32">
          <Loader2 className="w-10 h-10 text-[#114C5A] animate-spin mb-4" />
          <p className="text-gray-600 font-semibold text-lg">{t('dashboard.bookings.loading')}</p>
          <p className="text-gray-500 text-sm mt-2">{t('dashboard.bookings.pleaseWait')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardPageHeader
        title={t('dashboard.myPurchases.title') || 'مشترياتي'}
        subtitle={t('dashboard.myPurchases.subtitle') || 'عرض جميع طلبات شراء التطبيقات الجاهزة'}
      />

      {/* Statistics Cards - Similar to Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#114C5A]/20 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#114C5A]/40 transition-all duration-200 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#114C5A]/10 rounded-xl flex items-center justify-center text-[#114C5A] group-hover:bg-[#114C5A]/20 transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-2 leading-tight">{t('dashboard.myPurchases.totalOrders') || 'إجمالي الطلبات'}</p>
          <p className="text-2xl font-bold text-[#114C5A]">{pagination?.total || orders.length}</p>
        </div>

        <div className="bg-white border border-[#FFB200]/20 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#FFB200]/40 transition-all duration-200 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#FFB200]/10 rounded-xl flex items-center justify-center text-[#FFB200] group-hover:bg-[#FFB200]/20 transition-colors">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-2 leading-tight">{t('dashboard.myPurchases.status.pending') || 'قيد الانتظار'}</p>
          <p className="text-2xl font-bold text-[#FFB200]">{orders.filter(o => o.status === 'pending').length}</p>
        </div>

        <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
              <Loader2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-2 leading-tight">{t('dashboard.myPurchases.status.processing') || 'قيد المعالجة'}</p>
          <p className="text-2xl font-bold text-blue-500">{orders.filter(o => o.status === 'processing').length}</p>
        </div>

        <div className="bg-white border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-green-400 transition-all duration-200 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500 group-hover:bg-green-100 transition-colors">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-2 leading-tight">{t('dashboard.myPurchases.status.completed') || 'مكتمل'}</p>
          <p className="text-2xl font-bold text-green-500">{orders.filter(o => o.status === 'completed').length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm p-4">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-[#114C5A]/10">
            <Filter className="w-5 h-5 text-[#114C5A]" />
          </div>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 px-4 py-3 rounded-xl border border-[#114C5A]/10 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#114C5A]/20 focus:border-[#114C5A] font-semibold transition-all"
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

      {/* Orders Grid - Similar to Dashboard Cards */}
      {orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm hover:shadow-md hover:border-[#114C5A]/20 transition-all duration-300 group overflow-hidden flex flex-col"
              >
                {/* Header with gradient */}
                <div className="bg-gradient-to-br from-[#114C5A] to-[#114C5A]/90 p-4 text-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center font-bold text-xs bg-white/10">
                        #{order.id}
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <Package size={18} className="text-white/80" />
                  </div>
                  <h3 className="text-lg font-bold mb-1 line-clamp-2">{appName || 'Untitled App'}</h3>
                  {categoryName && (
                    <p className="text-xs text-white/80 flex items-center gap-1.5 mt-1">
                      <Tag size={12} />
                      {categoryName}
                    </p>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3 flex-grow">
                  {/* App Image */}
                  {order.app.main_image && (
                    <div 
                      className="w-full h-32 rounded-xl overflow-hidden border border-[#114C5A]/10 cursor-pointer group/image"
                      onClick={() => navigate(`/admin/ready-apps/${order.app.id}`)}
                    >
                      <img
                        src={getImageUrl(order.app.main_image)}
                        alt={appName || 'App'}
                        className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '';
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Price */}
                  <div className="p-3 rounded-xl border border-[#114C5A]/10 bg-[#114C5A]/5">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-[#114C5A]" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-medium">{t('dashboard.myPurchases.price') || 'السعر'}</p>
                        <p className="text-lg font-bold text-[#114C5A]">
                          {order.price.toLocaleString()} {order.currency || 'ر.س'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Date */}
                  <div className="p-3 rounded-xl border border-[#114C5A]/10 bg-[#114C5A]/5">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#114C5A]" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-medium">{t('dashboard.myPurchases.orderDate') || 'تاريخ الطلب'}</p>
                        <p className="text-sm font-semibold text-gray-900">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Preference */}
                  <div className="p-3 rounded-xl border border-[#114C5A]/10 bg-[#114C5A]/5">
                    <div className="flex items-center gap-2">
                      {order.contact_preference === 'phone' ? (
                        <Phone size={16} className="text-green-500" />
                      ) : (
                        <Mail size={16} className="text-purple-500" />
                      )}
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-medium">{t('dashboard.myPurchases.contactPreference') || 'تفضيل التواصل'}</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {order.contact_preference === 'phone' 
                            ? (t('dashboard.myPurchases.phone') || 'هاتف')
                            : (t('dashboard.myPurchases.email') || 'بريد إلكتروني')
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Processed At */}
                  {order.processed_at && (
                    <div className="p-3 rounded-xl border border-green-200 bg-green-50">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 font-medium">{t('dashboard.myPurchases.processedAt') || 'تاريخ المعالجة'}</p>
                          <p className="text-sm font-semibold text-gray-900">{formatDate(order.processed_at)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {order.notes && (
                    <div className="p-3 rounded-xl border border-[#FFB200]/20 bg-[#FFB200]/5">
                      <div className="flex items-start gap-2">
                        <FileText size={16} className="text-[#FFB200] mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-[#FFB200] font-semibold mb-1">{t('dashboard.myPurchases.notes') || 'ملاحظات'}</p>
                          <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{order.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 pt-3 border-t border-[#114C5A]/10 bg-gray-50">
                  <button
                    onClick={() => navigate(`/admin/ready-apps/${order.app.id}`)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#114C5A] text-white rounded-xl font-semibold transition-all shadow-sm hover:bg-[#114C5A]/90 hover:shadow-md"
                  >
                    <ArrowRight size={16} />
                    {t('dashboard.myPurchases.viewApp') || 'عرض التطبيق'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm p-8">
          <EmptyState
            icon={ShoppingBag}
            title={t('dashboard.myPurchases.noOrders') || 'لا توجد طلبات'}
            message={t('dashboard.myPurchases.noOrdersMessage') || 'لم يتم العثور على طلبات شراء'}
          />
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
              currentPage === 1
                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'border-[#114C5A]/20 bg-white text-[#114C5A] hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
            }`}
          >
            <ChevronRight size={18} />
            <span className="font-semibold">{t('dashboard.bookings.previous')}</span>
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
              let pageNum;
              if (pagination.last_page <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pagination.last_page - 2) {
                pageNum = pagination.last_page - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                    currentPage === pageNum
                      ? 'bg-[#114C5A] text-white shadow-md'
                      : 'border border-[#114C5A]/20 bg-white text-gray-700 hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.last_page}
            className={`px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
              currentPage === pagination.last_page
                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'border-[#114C5A]/20 bg-white text-[#114C5A] hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
            }`}
          >
            <span className="font-semibold">{t('dashboard.bookings.next')}</span>
            <ChevronLeft size={18} />
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {pagination && (
        <div className="text-center text-sm text-gray-600">
          {t('dashboard.myPurchases.showing') || 'عرض'} {pagination.from}-{pagination.to} {t('dashboard.myPurchases.of') || 'من'} {pagination.total} {t('dashboard.myPurchases.results') || 'نتيجة'}
        </div>
      )}
    </div>
  );
};

export default MyPurchases;
