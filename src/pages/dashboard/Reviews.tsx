import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import { useThemeStore } from '../../storeApi/store/theme.store';
import LoadingState from '../../components/dashboard/LoadingState';
import EmptyState from '../../components/dashboard/EmptyState';
import { Star, MessageSquare, Filter, Search, ChevronLeft, ChevronRight, Calendar, User, CheckCircle } from 'lucide-react';
import { getRatings } from '../../storeApi/storeApi';
import type { Rating } from '../../types/types';

const Reviews = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useThemeStore();
  
  // تحديد الاتجاه بناءً على اللغة
  const isRTL = i18n.language === 'ar';
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  // جلب التقييمات
  const fetchRatingsCallback = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params: any = {
        per_page: 10,
        page: page,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (ratingFilter) {
        params.rating = ratingFilter;
      }

      const result = await getRatings(params);
      
      if (result.success) {
        const ratingsData = result.data.data || [];
        setRatings(ratingsData);
        setCurrentPage(result.data.current_page || 1);
        setTotalPages(result.data.last_page || 1);
        setTotal(result.data.total || 0);
        setFrom(result.data.from || 0);
        setTo(result.data.to || 0);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, ratingFilter]);

  useEffect(() => {
    fetchRatingsCallback(1);
  }, [fetchRatingsCallback]);

  // إعادة جلب البيانات عند تغيير اللغة
  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      console.log('Language changed to:', lng, '- Refetching ratings...');
      await fetchRatingsCallback(currentPage);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchRatingsCallback, currentPage]);

  // البحث مع debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchRatingsCallback(1);
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchRatingsCallback, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchRatingsCallback(page);
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
    const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const getServiceName = (booking: Rating['booking']) => {
    if (booking.booking_type === 'consultation') {
      return t('dashboard.reviews.consultation');
    }
    return booking.service_id ? t('dashboard.reviews.serviceId', { id: booking.service_id }) : t('dashboard.reviews.service');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <DashboardPageHeader title={t('dashboard.reviews.title')} />
      
      <div className={`rounded-[32px] p-8 border shadow-sm ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-100'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`text-2xl font-black ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>{t('dashboard.reviews.title')}</h2>
              <p className={`text-sm font-bold uppercase tracking-widest mt-0.5 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-400'
              }`}>
                {total > 0 ? t('dashboard.reviews.total', { count: total }) : t('dashboard.reviews.subtitle')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
              <input
                type="text"
                placeholder={t('dashboard.reviews.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full md:w-64 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' 
                    : 'bg-slate-50 border-slate-100'
                }`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="relative">
              <Filter className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none`} />
              <select
                value={ratingFilter || ''}
                onChange={(e) => setRatingFilter(e.target.value ? Number(e.target.value) : null)}
                className={`appearance-none ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-slate-50 border-slate-100'
                }`}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <option value="">{t('dashboard.reviews.allRatings')}</option>
                <option value="5">{t('dashboard.reviews.fiveStars')}</option>
                <option value="4">{t('dashboard.reviews.fourStars')}</option>
                <option value="3">{t('dashboard.reviews.threeStars')}</option>
                <option value="2">{t('dashboard.reviews.twoStars')}</option>
                <option value="1">{t('dashboard.reviews.oneStar')}</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : ratings.length === 0 ? (
          <EmptyState 
            message={searchTerm || ratingFilter ? t('dashboard.reviews.noResultsFilter') : t('dashboard.reviews.noReviewsFilter')}
            description={searchTerm || ratingFilter ? t('dashboard.reviews.tryDifferentFilter') : t('dashboard.reviews.willShowFilter')}
          />
        ) : (
          <>
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div
                  key={rating.id}
                  className={`group border rounded-3xl p-6 transition-all duration-300 ${
                    isDarkMode 
                      ? 'border-slate-700 hover:border-amber-500/50 hover:bg-amber-900/20' 
                      : 'border-slate-100 hover:border-amber-200 hover:bg-amber-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-amber-500/30">
                        {rating.customer.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className={`font-black text-lg ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>{rating.customer.name}</h4>
                          <div className="flex items-center gap-1">
                            {renderStars(rating.rating)}
                            <span className={`text-sm font-bold ${isRTL ? 'mr-2' : 'ml-2'} ${
                              isDarkMode ? 'text-slate-300' : 'text-slate-600'
                            }`}>({rating.rating})</span>
                          </div>
                        </div>
                        <div className={`flex items-center gap-4 text-sm mb-3 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(rating.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>{getServiceName(rating.booking)}</span>
                          </div>
                        </div>
                        {rating.comment && (
                          <p className={`leading-relaxed rounded-xl p-4 border ${
                            isDarkMode 
                              ? 'text-slate-300 bg-slate-700/50 border-slate-600' 
                              : 'text-slate-700 bg-white/50 border-slate-100'
                          }`}>
                            {rating.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* معلومات الحجز */}
                  <div className={`mt-4 pt-4 border-t ${
                    isDarkMode ? 'border-slate-700' : 'border-slate-100'
                  }`}>
                    <div className={`flex items-center gap-4 text-xs ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-400'
                    }`}>
                      <span className="font-bold">{t('dashboard.reviews.bookingNumber', { id: rating.booking.id })}</span>
                      <span className="font-bold">{t('dashboard.reviews.date', { date: formatDate(rating.booking.booking_date) })}</span>
                      {rating.booking.total_price && rating.booking.total_price !== '0.00' && (
                        <span className="font-bold">{t('dashboard.reviews.amount', { amount: rating.booking.total_price })}</span>
                      )}
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
                  {t('dashboard.reviews.showing', { from, to, total })}
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
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
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
    </div>
  );
};

export default Reviews;
