import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import EmptyState from '../../components/dashboard/EmptyState';
import { Star, MessageSquare, Filter, Search, ChevronLeft, ChevronRight, Calendar, User, CheckCircle } from 'lucide-react';
import { getRatings } from '../../storeApi/storeApi';
import type { Rating } from '../../types/types';

const Reviews = () => {
  const { t, i18n } = useTranslation();
  
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
                ? 'fill-[#FFB200] text-[#FFB200]'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const getServiceName = (booking: Rating['booking'] | null | undefined) => {
    if (!booking) {
      return t('dashboard.reviews.service') || 'خدمة';
    }
    
    if (booking.booking_type === 'consultation') {
      return t('dashboard.reviews.consultation') || 'استشارة';
    }
    
    return booking.service_id 
      ? (t('dashboard.reviews.serviceId', { id: booking.service_id }) || `خدمة #${booking.service_id}`)
      : (t('dashboard.reviews.service') || 'خدمة');
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader 
        title={t('dashboard.reviews.title')} 
        subtitle={total > 0 ? t('dashboard.reviews.total', { count: total }) : t('dashboard.reviews.subtitle')}
      />
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-[#114C5A]/20 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#114C5A]/40 transition-all duration-200 group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#114C5A]/10 rounded-xl flex items-center justify-center text-[#114C5A] group-hover:bg-[#114C5A]/20 transition-colors">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-2 leading-tight">{t('dashboard.reviews.totalLabel') || 'إجمالي التقييمات'}</p>
          <p className="text-2xl font-bold text-[#114C5A]">{total}</p>
        </div>

        {[5, 4, 3, 2, 1].map((starCount) => (
          <div key={starCount} className="bg-white border border-[#FFB200]/20 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#FFB200]/40 transition-all duration-200 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-[#FFB200]/10 rounded-xl flex items-center justify-center text-[#FFB200] group-hover:bg-[#FFB200]/20 transition-colors">
                <Star className="w-5 h-5 fill-[#FFB200] text-[#FFB200]" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2 leading-tight">{starCount} {t('dashboard.reviews.stars') || 'نجمة'}</p>
            <p className="text-2xl font-bold text-[#FFB200]">{ratings.filter(r => r.rating === starCount).length}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#114C5A] transition-colors`} />
            <input
              type="text"
              placeholder={t('dashboard.reviews.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-[#114C5A]/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#114C5A]/20 focus:border-[#114C5A] bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          <div className="relative group">
            <Filter className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#114C5A] transition-colors pointer-events-none z-10`} />
            <select
              value={ratingFilter || ''}
              onChange={(e) => setRatingFilter(e.target.value ? Number(e.target.value) : null)}
              className={`appearance-none ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border border-[#114C5A]/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#114C5A]/20 focus:border-[#114C5A] font-semibold bg-gray-50 text-gray-900 min-w-[150px] transition-all`}
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

      {/* Reviews List */}
      <div className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12">
            <LoadingState />
          </div>
        ) : ratings.length === 0 ? (
          <div className="p-12">
            <EmptyState 
              icon={MessageSquare}
              title={searchTerm || ratingFilter ? t('dashboard.reviews.noResultsFilter') || 'لا توجد نتائج' : t('dashboard.reviews.noReviewsFilter') || 'لا توجد تقييمات'}
              message={searchTerm || ratingFilter ? t('dashboard.reviews.tryDifferentFilter') || 'جرب فلتر مختلف' : t('dashboard.reviews.willShowFilter') || 'ستظهر التقييمات هنا'}
            />
          </div>
        ) : (
          <>
            <div className="p-6 space-y-4">
              {ratings.map((rating) => (
                <div
                  key={rating.id}
                  className="group border border-[#114C5A]/10 rounded-xl p-6 transition-all duration-300 hover:border-[#114C5A]/20 hover:shadow-md bg-white"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#114C5A] to-[#114C5A]/90 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {rating.customer?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="font-bold text-lg text-gray-900">
                            {rating.customer?.name || t('dashboard.reviews.anonymous') || 'مجهول'}
                          </h4>
                          <div className="flex items-center gap-1">
                            {renderStars(rating.rating)}
                            <span className={`text-sm font-semibold ${isRTL ? 'mr-2' : 'ml-2'} text-gray-600`}>
                              ({rating.rating})
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm mb-3 text-gray-500 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[#114C5A]" />
                            <span>{formatDate(rating.created_at)}</span>
                          </div>
                          {rating.booking && (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>{getServiceName(rating.booking)}</span>
                            </div>
                          )}
                        </div>
                        {rating.comment && (
                          <p className="leading-relaxed rounded-xl p-4 border border-[#114C5A]/10 bg-[#114C5A]/5 text-gray-700">
                            {rating.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* معلومات الحجز */}
                  {rating.booking && (
                    <div className="mt-4 pt-4 border-t border-[#114C5A]/10">
                      <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                        <span className="font-semibold">{t('dashboard.reviews.bookingNumber', { id: rating.booking.id }) || `رقم الحجز: #${rating.booking.id}`}</span>
                        {rating.booking.booking_date && (
                          <span className="font-semibold">{t('dashboard.reviews.date', { date: formatDate(rating.booking.booking_date) }) || `التاريخ: ${formatDate(rating.booking.booking_date)}`}</span>
                        )}
                        {rating.booking.total_price && rating.booking.total_price !== '0.00' && (
                          <span className="font-semibold">{t('dashboard.reviews.amount', { amount: rating.booking.total_price }) || `المبلغ: ${rating.booking.total_price} ر.س`}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-4 border-t border-[#114C5A]/10 p-4">
                <div className="text-xs sm:text-sm font-semibold text-center sm:text-right text-gray-600">
                  {t('dashboard.reviews.showing', { from, to, total }) || `عرض ${from}-${to} من ${total}`}
                </div>
                <div className="flex items-center gap-2">
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reviews;
