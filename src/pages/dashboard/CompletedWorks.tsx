import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import EmptyState from '../../components/dashboard/EmptyState';
import RatingPopup from '../../components/dashboard/RatingPopup';
import { CheckCircle, FileCheck, Search, Calendar, Clock, DollarSign, User, Star, ChevronLeft, ChevronRight, MessageSquare, Tag, Loader2, ArrowRight } from 'lucide-react';
import { getPastBookings, useThemeStore } from '../../storeApi/storeApi';
import type { CustomerBooking } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import { useLocalizedName, useLocalizedDescription } from '../../hooks/useLocalized';

const CompletedWorks = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();
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
    // Handle object format from API
    if (typeof date === 'object' && date.formatted) {
      const dateObj = new Date(date.formatted);
      if (isNaN(dateObj.getTime())) return '';
      return dateObj.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
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
    if (!timeString) return '';
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader title={t('dashboard.completedWorks.title')} />
        <div className="flex flex-col justify-center items-center py-32">
          <Loader2 className={`w-10 h-10 animate-spin mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
          }`} />
          <p className={`font-semibold text-lg transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>{t('dashboard.bookings.loading')}</p>
          <p className={`text-sm mt-2 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>{t('dashboard.bookings.pleaseWait')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader title={t('dashboard.completedWorks.title')} />
      
      {/* Search Bar */}
      <div className={`rounded-xl border shadow-sm p-4 transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-[#114C5A]/10'
      }`}>
        <div className="relative">
          <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder={t('dashboard.completedWorks.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pr-10 pl-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-[#114C5A] transition-colors duration-300 ${
              isDarkMode
                ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-[#114C5A]/20'
                : 'border-[#114C5A]/10 bg-gray-50 focus:ring-[#114C5A]/20'
            }`}
          />
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className={`rounded-xl border shadow-sm p-8 transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-[#114C5A]/10'
        }`}>
          <EmptyState 
            message={searchTerm ? t('dashboard.completedWorks.noResults') : t('dashboard.completedWorks.noWorks')}
            description={searchTerm ? t('dashboard.completedWorks.tryDifferent') : t('dashboard.completedWorks.willShow')}
          />
        </div>
      ) : (
        <>
          {/* Bookings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => {
              // Get booking date from time_slots or booking_date
              const bookingDate = booking.time_slots?.[0]?.date || booking.booking_date;
              const startTime = booking.time_slots?.[0]?.start_time || booking.start_time;
              const endTime = booking.time_slots?.[0]?.end_time || booking.end_time;

              return (
                <div
                  key={booking.id}
                  className={`rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden flex flex-col ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                      : 'bg-white border-[#114C5A]/10 hover:border-[#114C5A]/20'
                  }`}
                >
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-br from-[#114C5A] to-[#114C5A]/90 p-4 text-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center font-bold text-xs bg-white/10">
                          #{booking.id}
                        </div>
                        <span className="px-2 py-1 bg-green-500/20 text-green-100 rounded-lg text-xs font-semibold border border-green-400/30">
                          {t('dashboard.completedWorks.completed')}
                        </span>
                      </div>
                      <CheckCircle size={20} className="text-white/80" />
                    </div>
                    <h3 className="text-lg font-bold mb-1 line-clamp-2">
                      <ServiceName booking={booking} />
                    </h3>
                    {(booking.service?.sub_category?.name || booking.consultation?.category?.name) && (
                      <p className="text-xs text-white/80 flex items-center gap-1.5 mt-1">
                        <Tag size={12} />
                        {booking.service?.sub_category?.name || booking.consultation?.category?.name}
                      </p>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3 flex-grow">
                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`p-2.5 rounded-lg border transition-colors duration-300 ${
                        isDarkMode
                          ? 'border-[#114C5A]/30 bg-[#114C5A]/20'
                          : 'border-[#114C5A]/10 bg-[#114C5A]/5'
                      }`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Calendar size={12} className={`transition-colors duration-300 ${
                            isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
                          }`} />
                          <p className={`text-xs font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>{t('dashboard.bookings.date')}</p>
                        </div>
                        <p className={`text-sm font-semibold transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{formatDate(bookingDate)}</p>
                      </div>
                      <div className={`p-2.5 rounded-lg border transition-colors duration-300 ${
                        isDarkMode
                          ? 'border-[#114C5A]/30 bg-[#114C5A]/20'
                          : 'border-[#114C5A]/10 bg-[#114C5A]/5'
                      }`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Clock size={12} className={`transition-colors duration-300 ${
                            isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
                          }`} />
                          <p className={`text-xs font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>{t('dashboard.bookings.time')}</p>
                        </div>
                        <p className={`text-sm font-semibold transition-colors duration-300 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`} dir="ltr">
                          {formatTime(startTime)} - {formatTime(endTime)}
                        </p>
                      </div>
                    </div>

                    {/* Employee */}
                    {booking.employee && (
                      <div className={`p-2.5 rounded-lg border transition-colors duration-300 ${
                        isDarkMode
                          ? 'border-[#114C5A]/30 bg-[#114C5A]/20'
                          : 'border-[#114C5A]/10 bg-[#114C5A]/5'
                      }`}>
                        <div className="flex items-center gap-2">
                          <User size={14} className={`transition-colors duration-300 ${
                            isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium mb-0.5 transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>{t('dashboard.bookings.serviceProvider')}</p>
                            <p className={`text-sm font-semibold truncate transition-colors duration-300 ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {booking.employee.name || booking.employee.user?.name || t('dashboard.bookings.cgaiTeam')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    <div className={`p-2.5 rounded-lg border transition-colors duration-300 ${
                      isDarkMode
                        ? 'border-[#114C5A]/30 bg-[#114C5A]/20'
                        : 'border-[#114C5A]/10 bg-[#114C5A]/5'
                    }`}>
                      <div className="flex items-center gap-2">
                        <DollarSign size={14} className={`transition-colors duration-300 ${
                          isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
                        }`} />
                        <div>
                          <p className={`text-xs font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>{t('dashboard.bookings.totalCost')}</p>
                          <p className={`text-base font-bold transition-colors duration-300 ${
                            isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
                          }`}>
                            {Math.abs(parseFloat(booking.total_price)).toFixed(2)} <span className={`text-xs transition-colors duration-300 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>{t('dashboard.stats.currency')}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rating Status */}
                    {booking.has_rating !== undefined && (
                      <div className={`p-2.5 rounded-lg border transition-colors duration-300 ${
                        isDarkMode
                          ? 'border-slate-600 bg-slate-700/50'
                          : 'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-center gap-2">
                          {booking.has_rating ? (
                            <>
                              <Star size={14} className="fill-amber-400 text-amber-400" />
                              <span className={`text-xs font-semibold transition-colors duration-300 ${
                                isDarkMode ? 'text-amber-400' : 'text-amber-600'
                              }`}>{t('dashboard.completedWorks.rated')}</span>
                            </>
                          ) : (
                            <>
                              <MessageSquare size={14} className={`transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-400'
                              }`} />
                              <span className={`text-xs font-semibold transition-colors duration-300 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}>{t('dashboard.completedWorks.notRated')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className={`p-4 pt-3 border-t transition-colors duration-300 ${
                    isDarkMode
                      ? 'border-slate-700 bg-slate-700/30'
                      : 'border-[#114C5A]/10 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      {!booking.has_rating && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBookingForRating(booking);
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-[#FFB200] hover:bg-[#FFB200]/90 text-white rounded-lg font-semibold text-xs transition-all shadow-sm hover:shadow-md flex-1 justify-center"
                        >
                          <Star size={14} />
                          {t('dashboard.completedWorks.addRating')}
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/bookings/${booking.id}`);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-[#114C5A] hover:bg-[#114C5A]/90 text-white rounded-lg font-semibold text-xs transition-all shadow-sm hover:shadow-md flex-1 justify-center"
                      >
                        <ArrowRight size={14} />
                        {t('dashboard.completedWorks.viewDetails')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                  currentPage === 1
                    ? isDarkMode
                      ? 'border-slate-700 bg-slate-700/50 text-gray-500 cursor-not-allowed'
                      : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : isDarkMode
                      ? 'border-slate-600 bg-slate-700 text-gray-300 hover:bg-slate-600 hover:border-slate-500'
                      : 'border-[#114C5A]/20 bg-white text-[#114C5A] hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                }`}
              >
                <ChevronRight size={18} />
                <span className="font-semibold">{t('dashboard.bookings.previous')}</span>
              </button>
              
              <div className="flex items-center gap-2">
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
                      className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                        currentPage === pageNum
                          ? 'bg-[#114C5A] text-white shadow-md'
                          : isDarkMode
                            ? 'border border-slate-600 bg-slate-700 text-gray-300 hover:bg-slate-600 hover:border-slate-500'
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
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                  currentPage === totalPages
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
          {total > 0 && (
            <div className={`text-center text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t('dashboard.completedWorks.showing', { from, to, total })}
            </div>
          )}
        </>
      )}

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
