import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import { History, Clock, Filter, Search, Loader2 } from 'lucide-react';
import { useThemeStore } from '../../storeApi/store/theme.store';
import { getActivityLog } from '../../storeApi/api/activityLog.api';
import type { ActivityLogItem } from '../../storeApi/api/activityLog.api';

const ActivityLog = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // التأكد من أن activities دائماً array
  const safeActivities = Array.isArray(activities) ? activities : [];

  // Debug: مراقبة تغييرات activities
  useEffect(() => {
    console.log('Activities state changed:', activities);
    console.log('Safe activities:', safeActivities);
    console.log('Safe activities length:', safeActivities.length);
  }, [activities, safeActivities]);

  // جلب سجل النشاطات
  const fetchActivityLog = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    try {
      const result = await getActivityLog({
        per_page: 15,
        page: page,
        search: searchTerm || undefined,
      });
      
      console.log('Activity Log Result:', result);
      console.log('Result data:', result.data);
      console.log('Is array:', Array.isArray(result.data));
      
      if (result.success) {
        // التأكد من أن البيانات هي array
        const activitiesData = Array.isArray(result.data) ? result.data : [];
        console.log('Activities data to set:', activitiesData);
        console.log('Activities count:', activitiesData.length);
        setActivities(activitiesData);
        
        // إذا كان هناك pagination في الاستجابة
        if ((result as any).pagination) {
          setCurrentPage((result as any).pagination.current_page || 1);
          setTotalPages((result as any).pagination.last_page || 1);
          setTotal((result as any).pagination.total || 0);
        } else {
          setCurrentPage(1);
          setTotalPages(1);
          setTotal(activitiesData.length);
        }
      } else {
        // في حالة الفشل، تأكد من أن activities هو array فارغ
        setActivities([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error fetching activity log:', error);
      // في حالة الخطأ، تأكد من أن activities هو array فارغ
      setActivities([]);
      setCurrentPage(1);
      setTotalPages(1);
      setTotal(0);
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
    return dateObj.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action: string | undefined) => {
    if (!action || typeof action !== 'string') {
      return 'text-gray-600 bg-gray-50 border-gray-200';
    }
    
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login') || actionLower.includes('دخول')) {
      return 'text-green-600 bg-green-50 border-green-200';
    } else if (actionLower.includes('logout') || actionLower.includes('خروج')) {
      return 'text-red-600 bg-red-50 border-red-200';
    } else if (actionLower.includes('create') || actionLower.includes('إنشاء')) {
      return 'text-blue-600 bg-blue-50 border-blue-200';
    } else if (actionLower.includes('update') || actionLower.includes('تحديث')) {
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    } else if (actionLower.includes('delete') || actionLower.includes('حذف')) {
      return 'text-red-600 bg-red-50 border-red-200';
    }
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <DashboardPageHeader title={t('dashboard.activity.title')} />
      
      <div className={`rounded-[32px] p-4 sm:p-6 lg:p-8 border shadow-sm ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-slate-100'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 ${
              isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-800/10 text-slate-800'
            }`}>
              <History className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className={`text-lg sm:text-xl md:text-2xl font-black ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>{t('dashboard.activity.title')}</h2>
              <p className={`text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest mt-0.5 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-400'
              }`}>{t('dashboard.activity.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-400'
              }`} />
              <input
                type="text"
                placeholder={t('dashboard.activity.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full sm:w-64 pr-10 pl-4 py-2 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' 
                    : 'bg-slate-50 border-slate-100'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : safeActivities.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto mb-6 ${
              isDarkMode 
                ? 'bg-slate-700 text-slate-400' 
                : 'bg-slate-50 text-slate-200'
            }`}>
              <Clock className="w-10 h-10" />
            </div>
            <h3 className={`text-xl font-black mb-2 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-400'
            }`}>{t('dashboard.activity.noActivities')}</h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>{t('dashboard.activity.noActivitiesMessage')}</p>
          </div>
        ) : (
          <>
            {/* Activities List */}
            <div className="space-y-3 sm:space-y-4">
              {safeActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-4 sm:p-6 rounded-2xl border transition-all hover:shadow-lg ${
                    isDarkMode 
                      ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' 
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getActionColor(activity.action)} ${
                          isDarkMode ? 'bg-slate-800 border-slate-600' : ''
                        }`}>
                          {activity.action || t('dashboard.activity.unspecified')}
                        </span>
                        <span className={`text-xs font-bold ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          #{activity.id}
                        </span>
                      </div>
                      <p className={`text-sm sm:text-base font-bold mb-2 ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {activity.description || t('dashboard.activity.noDescription')}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Clock className={`w-3.5 h-3.5 ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`} />
                          <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                            {activity.created_at ? formatDateTime(activity.created_at) : t('dashboard.activity.notAvailable')}
                          </span>
                        </div>
                        {activity.ip_address && (
                          <div className={`text-xs ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
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
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-200 dark:border-slate-700">
                <div className={`text-xs sm:text-sm font-bold text-center sm:text-right ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {t('dashboard.activity.showing', { from: ((currentPage - 1) * 15) + 1, to: Math.min(currentPage * 15, total), total })}
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                      isDarkMode
                        ? 'bg-slate-700 hover:bg-slate-600 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    <span className="hidden sm:inline">{t('dashboard.activity.previous')}</span>
                    <span className="sm:hidden">←</span>
                  </button>
                  
                  <div className="flex items-center gap-1 sm:gap-2">
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
                          className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                            currentPage === pageNum
                              ? 'bg-primary text-white shadow-lg'
                              : isDarkMode
                                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
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
                    className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                      isDarkMode
                        ? 'bg-slate-700 hover:bg-slate-600 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    <span className="hidden sm:inline">{t('dashboard.activity.next')}</span>
                    <span className="sm:hidden">→</span>
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
