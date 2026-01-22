import { Bell, Calendar, CheckCircle, Loader2, CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, useThemeStore } from '../../storeApi/storeApi';
import type { Notification } from '../../types/types';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import LoadingState from '../../components/dashboard/LoadingState';

const Notifications = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  // جلب الإشعارات
  const fetchNotificationsCallback = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    try {
      const params: any = {
        per_page: 20,
        page: page,
      };

      if (filter === 'unread') {
        params.read = false;
      } else if (filter === 'read') {
        params.read = true;
      }

      const result = await getNotifications(params);
      
      if (result.success) {
        const notificationsData = result.data.data || [];
        setNotifications(notificationsData);
        setUnreadCount(result.unread_count || 0);
        setCurrentPage(result.data.current_page || 1);
        setTotalPages(result.data.last_page || 1);
        setTotal(result.data.total || 0);
        setFrom(result.data.from || 0);
        setTo(result.data.to || 0);
        
        // تحديث unreadCount بناءً على الإشعارات الفعلية إذا لم يكن موجوداً في الـ response
        if (result.unread_count === undefined || result.unread_count === null) {
          const unreadNotifications = notificationsData.filter((n: Notification) => !n.read);
          setUnreadCount(unreadNotifications.length);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchNotificationsCallback(1);
  }, [fetchNotificationsCallback]);

  // إعادة جلب البيانات عند تغيير اللغة
  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      console.log('Language changed to:', lng, '- Refetching notifications...');
      await fetchNotificationsCallback(currentPage);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchNotificationsCallback, currentPage]);

  // جعل الإشعارات مقروءة عند زيارة الصفحة (فقط عند تحميل الصفحة لأول مرة)
  useEffect(() => {
    // عند تحميل الصفحة، جعل جميع الإشعارات المرئية مقروءة
    const markVisibleAsRead = async () => {
      const unreadNotifications = notifications.filter(n => !n.read);
      if (unreadNotifications.length > 0) {
        // تحديث كل إشعار غير مقروء بشكل فردي
        for (const notification of unreadNotifications) {
          try {
            await markNotificationAsRead(Number(notification.id));
          } catch (error) {
            console.error('Error marking notification as read:', error);
          }
        }
        // تحديث الحالة المحلية
        setNotifications(prev => 
          prev.map(n => ({ ...n, read: true, read_at: new Date().toISOString() }))
        );
        setUnreadCount(0);
      }
    };

    // تنفيذ بعد تحميل الإشعارات
    if (!isLoading && notifications.length > 0) {
      markVisibleAsRead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // تحديث حالة الإشعار كمقروء
  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.read) return;

    try {
      const result = await markNotificationAsRead(Number(notification.id));
      if (result.success) {
        // تحديث حالة الإشعار محلياً
        setNotifications(prev => 
          prev.map(n => 
            n.id === notification.id 
              ? { ...n, read: true, read_at: new Date().toISOString() }
              : n
          )
        );
        // تحديث عدد الإشعارات غير المقروءة
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // تحديد الكل كمقروء
  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length === 0) {
      Swal.fire({
        icon: 'info',
        title: t('dashboard.notifications.noUnread'),
        text: t('dashboard.notifications.allRead'),
        confirmButtonText: t('dashboard.ticketDetails.ok'),
        confirmButtonColor: '#114C5A',
        customClass: { popup: 'font-ElMessiri' },
      });
      return;
    }

    setIsMarkingAll(true);
    try {
      const result = await markAllNotificationsAsRead();
      if (result.success) {
        // تحديث جميع الإشعارات محلياً
        setNotifications(prev => 
          prev.map(n => ({ ...n, read: true, read_at: new Date().toISOString() }))
        );
        setUnreadCount(0);
        
        Swal.fire({
          icon: 'success',
          title: t('dashboard.support.success'),
          text: t('dashboard.notifications.allMarkedRead'),
          confirmButtonText: t('dashboard.ticketDetails.ok'),
          confirmButtonColor: '#114C5A',
          customClass: { popup: 'font-ElMessiri' },
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: t('dashboard.support.error'),
          text: result.message || t('dashboard.notifications.updateFailed'),
          confirmButtonText: t('dashboard.ticketDetails.ok'),
          confirmButtonColor: '#114C5A',
          customClass: { popup: 'font-ElMessiri' },
        });
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      Swal.fire({
        icon: 'error',
        title: t('dashboard.support.error'),
        text: t('dashboard.notifications.updateError'),
        confirmButtonText: t('dashboard.ticketDetails.ok'),
        confirmButtonColor: '#114C5A',
        customClass: { popup: 'font-ElMessiri' },
      });
    } finally {
      setIsMarkingAll(false);
    }
  };

  // تنسيق التاريخ
  const formatDate = (date: any) => {
    const dateString = typeof date === 'string' 
      ? date 
      : date?.formatted || date?.date?.formatted || '';
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return '';
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return t('dashboard.notifications.now');
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return t('dashboard.notifications.minutesAgo', { count: minutes });
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return t('dashboard.notifications.hoursAgo', { count: hours });
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return t('dashboard.notifications.daysAgo', { count: days });
    } else {
      const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
      return dateObj.toLocaleString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  // معالجة النقر على الإشعار
  const handleNotificationClick = (notification: Notification) => {
    // جعل الإشعار مقروء عند النقر عليه
    handleMarkAsRead(notification);

    // التوجيه إلى صفحة الحجوزات إذا كان مرتبطاً بحجز
    if (notification.data?.booking_id) {
      navigate('/admin/bookings');
    }
  };

  const filteredNotifications = notifications;

  // Statistics
  const stats = {
    all: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    read: notifications.filter(n => n.read).length,
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t('dashboard.notifications.title')}
        subtitle={t('dashboard.notifications.subtitle')}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { value: 'all', label: t('dashboard.support.all'), icon: Bell, count: stats.all },
          { value: 'unread', label: t('dashboard.notifications.unread'), icon: CheckCircle, count: stats.unread },
          { value: 'read', label: t('dashboard.notifications.read'), icon: CheckCheck, count: stats.read },
        ].map(({ value, label, icon: Icon, count }) => {
          const isActive = filter === value;
          return (
            <div
              key={value}
              onClick={() => setFilter(value as 'all' | 'unread' | 'read')}
              className={`border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group ${
                isDarkMode
                  ? isActive
                    ? 'bg-slate-700/50 border-[#114C5A]'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                  : isActive
                    ? 'border-[#114C5A] bg-[#114C5A]/5 bg-white'
                    : 'border-[#114C5A]/10 hover:border-[#114C5A]/30 bg-white'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-[#114C5A] text-white'
                    : isDarkMode
                      ? 'bg-[#114C5A]/20 text-[#FFB200] group-hover:bg-[#114C5A]/30'
                      : 'bg-[#114C5A]/10 text-[#114C5A] group-hover:bg-[#114C5A]/20'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className={`text-xs mb-2 leading-tight transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>{label}</p>
              <p className={`text-2xl font-bold transition-colors duration-300 ${
                isDarkMode
                  ? isActive
                    ? 'text-white'
                    : 'text-gray-300'
                  : isActive
                    ? 'text-[#114C5A]'
                    : 'text-gray-700'
              }`}>
                {count}
                {value === 'unread' && unreadCount > 0 && (
                  <span className="ml-2 text-sm text-[#FFB200]">({unreadCount})</span>
                )}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mark All as Read Button */}
      {(() => {
        const currentUnreadCount = notifications.filter(n => !n.read).length;
        const shouldShow = currentUnreadCount > 0 && filter !== 'read';
        
        return shouldShow ? (
          <div className="flex justify-end">
            <button
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
              className="
                flex items-center gap-2 px-5 py-3 rounded-xl
                bg-[#114C5A] text-white
                font-semibold shadow-md hover:bg-[#114C5A]/90
                active:scale-95 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isMarkingAll ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>{t('dashboard.notifications.updating')}</span>
                </>
              ) : (
                <>
                  <CheckCheck size={18} />
                  <span>{t('dashboard.notifications.markAllRead')}</span>
                </>
              )}
            </button>
          </div>
        ) : null;
      })()}

      {/* Notifications List */}
      <div className={`rounded-xl border shadow-sm overflow-hidden transition-colors duration-300 ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-[#114C5A]/10'
      }`}>
        {isLoading ? (
          <div className="p-12">
            <LoadingState />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-12">
            <div className="text-center py-8">
              <div className={`w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-4 border transition-colors duration-300 ${
                isDarkMode
                  ? 'bg-[#114C5A]/20 border-[#114C5A]/30'
                  : 'bg-[#114C5A]/10 border-[#114C5A]/20'
              }`}>
                <Bell className={`w-10 h-10 transition-colors duration-300 ${
                  isDarkMode ? 'text-[#FFB200]' : 'text-[#114C5A]'
                }`} />
              </div>
              <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {filter === 'unread' ? t('dashboard.notifications.noUnread') : 
                 filter === 'read' ? t('dashboard.notifications.noRead') : 
                 t('dashboard.notifications.noNotifications')}
              </h3>
              <p className={`text-base transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {filter === 'unread' ? t('dashboard.notifications.allReadMessage') :
                 filter === 'read' ? t('dashboard.notifications.noReadMessage') :
                 t('dashboard.notifications.noNotificationsMessage')}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    rounded-xl p-5 
                    border transition-all duration-200
                    hover:shadow-md cursor-pointer
                    ${isDarkMode
                      ? !notification.read
                        ? 'bg-slate-700/50 border-slate-600 shadow-sm'
                        : 'bg-slate-700/30 border-slate-700 hover:border-slate-600'
                      : !notification.read
                        ? 'bg-[#114C5A]/5 border-[#114C5A]/20 shadow-sm bg-white'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`
                      mt-1 p-3 rounded-xl flex-shrink-0 transition-colors duration-300
                      ${!notification.read 
                        ? 'bg-[#114C5A] text-white' 
                        : isDarkMode
                          ? 'bg-slate-600 text-gray-400'
                          : 'bg-gray-100 text-gray-400'
                      }
                    `}>
                      <Calendar size={20} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className={`
                          text-base font-semibold line-clamp-2 transition-colors duration-300
                          ${isDarkMode
                            ? !notification.read
                              ? 'text-white'
                              : 'text-gray-300'
                            : !notification.read
                              ? 'text-gray-900'
                              : 'text-gray-600'
                          }
                        `}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-3 h-3 bg-[#114C5A] rounded-full flex-shrink-0 mt-1.5 animate-pulse"></span>
                        )}
                      </div>
                      
                      <p className={`text-sm mb-3 line-clamp-3 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className={`flex items-center gap-2 text-xs transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Calendar size={14} />
                          <span>{formatDate(notification.created_at)}</span>
                        </div>
                        
                        {notification.data?.booking_id && (
                          <span className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors duration-300 ${
                            isDarkMode
                              ? 'bg-[#114C5A]/20 text-[#FFB200] border-[#114C5A]/30'
                              : 'bg-[#114C5A]/10 text-[#114C5A] border-[#114C5A]/20'
                          }`}>
                            {t('dashboard.notifications.booking')} #{notification.data.booking_id}
                          </span>
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
                  {t('dashboard.notifications.showing', { from, to, total }) || `عرض ${from}-${to} من ${total}`}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchNotificationsCallback(currentPage - 1)}
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
                    <span className="font-semibold">{t('dashboard.support.previous')}</span>
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
                          onClick={() => fetchNotificationsCallback(pageNum)}
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
                    onClick={() => fetchNotificationsCallback(currentPage + 1)}
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
                    <span className="font-semibold">{t('dashboard.support.next')}</span>
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

export default Notifications;
