import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import { useThemeStore } from '../../storeApi/store/theme.store';
import LoadingState from '../../components/dashboard/LoadingState';
import EmptyState from '../../components/dashboard/EmptyState';
import RatingPopup from '../../components/dashboard/RatingPopup';
import { CheckCircle, FileCheck, Search, Filter, Calendar, Clock, DollarSign, User, Star, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { getPastBookings } from '../../storeApi/storeApi';
import type { CustomerBooking } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import { useLocalizedName, useLocalizedDescription } from '../../hooks/useLocalized';

const CompletedWorks = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBookingForRating, setSelectedBookingForRating] = useState<CustomerBooking | null>(null);

  // جلب الحجوزات المكتملة
  const fetchCompletedBookings = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const result = await getPastBookings({
        status: 'completed',
        payment_status: 'paid',
        per_page: 15,
        page: page,
      });
      
      if (result.success) {
        const bookingsData = result.data || [];
        // تصفية حسب البحث
        const filtered = searchTerm
          ? bookingsData.filter((booking: CustomerBooking) => {
              const serviceName = booking.service?.name || booking.consultation?.name || '';
              return serviceName.toLowerCase().includes(searchTerm.toLowerCase());
            })
          : bookingsData;
        
        setBookings(filtered);
        setCurrentPage(result.pagination?.current_page || 1);
        setTotalPages(result.pagination?.last_page || 1);
        setTotal(result.pagination?.total || 0);
        setFrom(result.pagination?.from || 0);
        setTo(result.pagination?.to || 0);
      }
    } catch (error) {
      console.error('Error fetching completed bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedBookings(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // إعادة جلب البيانات عند تغيير اللغة
  const { i18n } = useTranslation();
  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      console.log('Language changed to:', lng, '- Refetching completed bookings...');
      await fetchCompletedBookings(currentPage);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, currentPage]);

  // البحث مع debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCompletedBookings(1);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchCompletedBookings(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // HH:mm
  };

  // Helper component لتوطين اسم الخدمة
  const ServiceName = ({ booking }: { booking: CustomerBooking }) => {
    const consultationName = useLocalizedName(booking.consultation);
    const serviceName = useLocalizedName(booking.service);
    
    if (booking.booking_type === 'consultation') {
      return <>{consultationName || t('dashboard.reviews.consultation')}</>;
    }
    return <>{serviceName || t('dashboard.reviews.service')}</>;
  };

  // Helper component لتوطين وصف الخدمة
  const ServiceDescription = ({ booking }: { booking: CustomerBooking }) => {
    const consultationDesc = useLocalizedDescription(booking.consultation);
    const serviceDesc = useLocalizedDescription(booking.service);
    
    if (booking.booking_type === 'consultation') {
      return <>{consultationDesc}</>;
    }
    return <>{serviceDesc}</>;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <DashboardPageHeader title={t('dashboard.completedWorks.title')} />
      
      <div className={`rounded-[32px] p-8 border shadow-sm ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-100'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`text-2xl font-black ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>{t('dashboard.completedWorks.title')}</h2>
              <p className={`text-sm font-bold uppercase tracking-widest mt-0.5 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-400'
              }`}>
                {total > 0 ? t('dashboard.completedWorks.total', { count: total }) : t('dashboard.completedWorks.subtitle')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={t('dashboard.completedWorks.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full md:w-64 pr-10 pl-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' 
                    : 'bg-slate-50 border-slate-100'
                }`}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : bookings.length === 0 ? (
          <EmptyState 
            message={searchTerm ? t('dashboard.completedWorks.noResults') : t('dashboard.completedWorks.noWorks')}
            description={searchTerm ? t('dashboard.completedWorks.tryDifferent') : t('dashboard.completedWorks.willShow')}
          />
        ) : (
          <>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`group border rounded-3xl p-6 transition-all duration-300 ${
                    isDarkMode 
                      ? 'border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-900/20' 
                      : 'border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/30">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className={`font-black text-xl group-hover:text-emerald-600 transition-colors ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>
                            <ServiceName booking={booking} />
                          </h4>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-wider">
                            {t('dashboard.completedWorks.completed')}
                          </span>
                        </div>
                        <p className={`text-sm mb-3 line-clamp-2 ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          <ServiceDescription booking={booking} />
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className={`flex items-center gap-2 ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="font-bold">{formatDate(booking.booking_date)}</span>
                          </div>
                          <div className={`flex items-center gap-2 ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span className="font-bold" dir="ltr">
                              {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                            </span>
                          </div>
                          {booking.employee && (
                            <div className={`flex items-center gap-2 ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                              <User className="w-4 h-4 text-primary" />
                              <span className="font-bold">{booking.employee.name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-emerald-600 ml-auto">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-black text-lg">{booking.total_price} {t('dashboard.stats.currency')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* معلومات إضافية */}
                  <div className={`mt-4 pt-4 border-t flex items-center justify-between ${
                    isDarkMode ? 'border-slate-700' : 'border-slate-100'
                  }`}>
                    <div className={`flex items-center gap-4 text-xs ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-400'
                    }`}>
                      <span className="font-bold">{t('dashboard.completedWorks.bookingNumber', { id: booking.id })}</span>
                      {booking.has_rating !== undefined && (
                        <div className="flex items-center gap-1.5">
                          {booking.has_rating ? (
                            <>
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="font-bold text-amber-600">{t('dashboard.completedWorks.rated')}</span>
                            </>
                          ) : (
                            <>
                              <MessageSquare className="w-4 h-4 text-slate-400" />
                              <span className="font-bold">{t('dashboard.completedWorks.notRated')}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {booking.updated_at && (
                        <span className="text-xs text-slate-400 font-bold">
                          {t('dashboard.completedWorks.completedAt', { date: formatDate(booking.updated_at) })}
                        </span>
                      )}
                      {!booking.has_rating && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBookingForRating(booking);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                          <Star className="w-4 h-4" />
                          {t('dashboard.completedWorks.addRating')}
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/bookings/${booking.id}`);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                          isDarkMode 
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {t('dashboard.completedWorks.viewDetails')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`flex items-center justify-between mt-8 pt-6 border-t ${
                isDarkMode ? 'border-slate-700' : 'border-slate-100'
              }`}>
                <div className={`text-sm font-bold ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {t('dashboard.completedWorks.showing', { from, to, total })}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-xl border disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                      isDarkMode 
                        ? 'border-slate-600 hover:bg-slate-700 text-slate-300' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                          currentPage === pageNum
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                            : isDarkMode
                              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-xl border disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                      isDarkMode 
                        ? 'border-slate-600 hover:bg-slate-700 text-slate-300' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Rating Popup */}
      {selectedBookingForRating && (
        <RatingPopup
          bookingId={selectedBookingForRating.id}
          bookingName={
            selectedBookingForRating.booking_type === 'consultation'
              ? selectedBookingForRating.consultation?.name || 'استشارة'
              : selectedBookingForRating.service?.name || 'خدمة'
          }
          onClose={() => setSelectedBookingForRating(null)}
          onSuccess={() => {
            // تحديث الحجوزات بعد إضافة التقييم
            fetchCompletedBookings(currentPage);
          }}
        />
      )}
    </div>
  );
};

export default CompletedWorks;
