import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import { History, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getActivityLog } from '../../storeApi/api/activityLog.api';
import type { ActivityLogItem } from '../../storeApi/api/activityLog.api';
import LoadingState from '../../components/dashboard/LoadingState';
import EmptyState from '../../components/dashboard/EmptyState';
import { useThemeStore } from '../../storeApi/storeApi';

const ActivityLog = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const isRTL = i18n.language === 'ar';
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);

  // التأكد من أن activities دائماً array
  const safeActivities = Array.isArray(activities) ? activities : [];

  // جلب سجل النشاطات
  const fetchActivityLog = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    try {
      const result = await getActivityLog({
        per_page: 15,
        page: page,
        search: searchTerm || undefined,
      });
      
      if (result.success) {
        // التأكد من أن البيانات هي array
        const activitiesData = Array.isArray(result.data) ? result.data : [];
        setActivities(activitiesData);
        
        // إذا كان هناك pagination في الاستجابة
        if ((result as any).pagination) {
          setCurrentPage((result as any).pagination.current_page || 1);
          setTotalPages((result as any).pagination.last_page || 1);
          setTotal((result as any).pagination.total || 0);
          setFrom((result as any).pagination.from || 0);
          setTo((result as any).pagination.to || 0);
        } else {
          setCurrentPage(1);
          setTotalPages(1);
          setTotal(activitiesData.length);
          setFrom(1);
          setTo(activitiesData.length);
        }
      } else {
        // في حالة الفشل، تأكد من أن activities هو array فارغ
        setActivities([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotal(0);
        setFrom(0);
        setTo(0);
      }
    } catch (error) {
      console.error('Error fetching activity log:', error);
      // في حالة الخطأ، تأكد من أن activities هو array فارغ
      setActivities([]);
      setCurrentPage(1);
      setTotalPages(1);
      setTotal(0);
      setFrom(0);
      setTo(0);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchActivityLog(1);
  }, [fetchActivityLog]);

  // إعادة جلب البيانات عند تغيير اللغة
  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      console.log('Language changed to:', lng, '- Refetching activity log...');
      await fetchActivityLog(currentPage);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchActivityLog, currentPage]);

  // البحث مع debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchActivityLog(1);
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchActivityLog, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchActivityLog(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatDateTime = (date: any) => {
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action: string | undefined) => {
    if (!action || typeof action !== 'string') {
      return isDarkMode 
        ? 'text-gray-300 bg-slate-700 border-slate-600'
        : 'text-gray-600 bg-gray-50 border-gray-200';
    }
    
    const actionLower = action.toLowerCase();
    if (isDarkMode) {
      if (actionLower.includes('login') || actionLower.includes('دخول')) {
        return 'text-green-400 bg-green-900/30 border-green-700';
      } else if (actionLower.includes('logout') || actionLower.includes('خروج')) {
        return 'text-red-400 bg-red-900/30 border-red-700';
      } else if (actionLower.includes('create') || actionLower.includes('إنشاء')) {
        return 'text-blue-400 bg-blue-900/30 border-blue-700';
      } else if (actionLower.includes('update') || actionLower.includes('تحديث')) {
        return 'text-[#FFB200] bg-[#FFB200]/20 border-[#FFB200]/30';
      } else if (actionLower.includes('delete') || actionLower.includes('حذف')) {
        return 'text-red-400 bg-red-900/30 border-red-700';
      }
      return 'text-gray-300 bg-slate-700 border-slate-600';
    } else {
      if (actionLower.includes('login') || actionLower.includes('دخول')) {
        return 'text-green-600 bg-green-50 border-green-200';
      } else if (actionLower.includes('logout') || actionLower.includes('خروج')) {
        return 'text-red-600 bg-red-50 border-red-200';
      } else if (actionLower.includes('create') || actionLower.includes('إنشاء')) {
        return 'text-blue-600 bg-blue-50 border-blue-200';
      } else if (actionLower.includes('update') || actionLower.includes('تحديث')) {
        return 'text-[#FFB200] bg-[#FFB200]/10 border-[#FFB200]/30';
      } else if (actionLower.includes('delete') || actionLower.includes('حذف')) {
        return 'text-red-600 bg-red-50 border-red-200';
      }
      return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  return (
    <div className="space-y-6">
      <DashboardPageHeader 
        title={t('dashboard.activity.title')} 
        subtitle={t('dashboard.activity.subtitle')}
      />
      
      {/* Search Section */}
      <div className={`rounded-xl border shadow-sm p-4 transition-colors duration-300 ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-[#114C5A]/10'
      }`}>
        <div className="relative group">
          <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
            isDarkMode
              ? 'text-gray-500 group-focus-within:text-[#FFB200]'
              : 'text-gray-400 group-focus-within:text-[#114C5A]'
          }`} />
          <input
            type="text"
            placeholder={t('dashboard.activity.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#114C5A]/20 focus:border-[#114C5A] transition-all ${
              isDarkMode
                ? 'border-slate-700 bg-slate-700 text-white placeholder:text-gray-400'
                : 'border-[#114C5A]/10 bg-gray-50 text-gray-900 placeholder:text-gray-400'
            }`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      {/* Activities List */}
      <div className={`rounded-xl border shadow-sm overflow-hidden transition-colors duration-300 ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-[#114C5A]/10'
      }`}>
        {isLoading ? (
          <div className="p-12">
            <LoadingState />
          </div>
        ) : safeActivities.length === 0 ? (
          <div className="p-12">
            <EmptyState 
              message={t('dashboard.activity.noActivities') || 'لا توجد نشاطات'}
            />
          </div>
        ) : (
          <>
            <div className="p-6 space-y-4">
              {safeActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-5 rounded-xl border transition-all hover:shadow-md ${
                    isDarkMode
                      ? 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                      : 'border-[#114C5A]/10 hover:border-[#114C5A]/20 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${getActionColor(activity.action)}`}>
                          {activity.action || t('dashboard.activity.unspecified')}
                        </span>
                        <span className={`text-xs font-semibold transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          #{activity.id}
                        </span>
                      </div>
                      <p className={`text-sm font-semibold mb-3 transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {activity.description || t('dashboard.activity.noDescription')}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <div className={`flex items-center gap-1.5 transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Clock className={`w-4 h-4 transition-colors duration-300 ${
                            isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
                          }`} />
                          <span>
                            {activity.created_at ? formatDateTime(activity.created_at) : t('dashboard.activity.notAvailable')}
                          </span>
                        </div>
                        {activity.ip_address && (
                          <div className={`text-xs transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            IP: {activity.ip_address}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-4 border-t p-4 transition-colors duration-300 ${
                isDarkMode ? 'border-slate-700' : 'border-[#114C5A]/10'
              }`}>
                <div className={`text-xs sm:text-sm font-semibold text-center sm:text-right transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t('dashboard.activity.showing', { from, to, total }) || `عرض ${from}-${to} من ${total}`}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                      currentPage === 1
                        ? isDarkMode
                          ? 'border-slate-700 bg-slate-700 text-gray-500 cursor-not-allowed'
                          : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : isDarkMode
                          ? 'border-slate-600 bg-slate-700 text-white hover:bg-slate-600 hover:border-slate-500'
                          : 'border-[#114C5A]/20 bg-white text-[#114C5A] hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                    }`}
                  >
                    <ChevronRight size={18} />
                    <span className="font-semibold">{t('dashboard.activity.previous')}</span>
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
                        ? isDarkMode
                          ? 'border-slate-700 bg-slate-700 text-gray-500 cursor-not-allowed'
                          : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : isDarkMode
                          ? 'border-slate-600 bg-slate-700 text-white hover:bg-slate-600 hover:border-slate-500'
                          : 'border-[#114C5A]/20 bg-white text-[#114C5A] hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                    }`}
                  >
                    <span className="font-semibold">{t('dashboard.activity.next')}</span>
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

export default ActivityLog;
