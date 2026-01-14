import { Bell, Calendar, CheckCircle, Loader2, CheckCheck } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import { useThemeStore } from '../../storeApi/store/theme.store';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../storeApi/storeApi';
import type { Notification } from '../../types/types';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  // جلب الإشعارات
  const fetchNotifications = async (page: number = 1) => {
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
  };

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
        confirmButtonColor: '#00adb5',
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
          confirmButtonColor: '#00adb5',
          customClass: { popup: 'font-ElMessiri' },
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: t('dashboard.support.error'),
          text: result.message || t('dashboard.notifications.updateFailed'),
          confirmButtonText: t('dashboard.ticketDetails.ok'),
          confirmButtonColor: '#00adb5',
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
        confirmButtonColor: '#00adb5',
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

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <DashboardPageHeader
        title={t('dashboard.notifications.title')}
        subtitle={t('dashboard.notifications.subtitle')}
      />

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Filters */}
        <div className="w-full px-4 flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
          {[
            { value: 'all', label: t('dashboard.support.all'), icon: Bell },
            { value: 'unread', label: t('dashboard.notifications.unread'), icon: CheckCircle },
            { value: 'read', label: t('dashboard.notifications.read'), icon: CheckCheck },
          ].map(({ value, label, icon: Icon }) => {
            const isActive = filter === value;
            return (
              <button
                key={value}
                onClick={() => setFilter(value as 'all' | 'unread' | 'read')}
                className={`
                  px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap
                  flex items-center gap-2 relative overflow-hidden
                  ${isActive
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-sm shadow-primary/30 scale-105 ring-2 ring-primary/20'
                    : isDarkMode
                      ? 'bg-slate-700 text-gray-300 hover:bg-slate-600 border-2 border-slate-600 hover:border-primary/30 hover:shadow-lg hover:scale-102'
                      : 'bg-white text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 border-2 border-gray-200 hover:border-primary/30 hover:shadow-lg hover:scale-102'
                  }
                `}
              >
                {isActive && (
                  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                )}
                <Icon size={16} className={isActive ? 'text-white' : 'text-primary'} />
                <span>{label}</span>
                {value === 'unread' && unreadCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mark All as Read Button */}
        {(() => {
          // حساب عدد الإشعارات غير المقروءة من القائمة الحالية
          const currentUnreadCount = notifications.filter(n => !n.read).length;
          const shouldShow = currentUnreadCount > 0 && filter !== 'read';
          
          return shouldShow ? (
            <button
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
              className="
                flex items-center gap-2 px-5 py-3 rounded-xl
                bg-gradient-to-r from-emerald-500 to-emerald-600 text-white
                font-bold shadow-lg shadow-emerald-300/30
                hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-300/40
                active:scale-95 transition-all duration-300
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
          ) : null;
        })()}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-32">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center mb-6 animate-pulse">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
          </div>
          <p className={`font-bold text-lg animate-pulse ${
            isDarkMode ? 'text-slate-300' : 'text-gray-600'
          }`}>{t('dashboard.notifications.loading')}</p>
          <p className={`text-sm mt-2 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-400'
          }`}>{t('dashboard.support.pleaseWait')}</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center shadow-2xl border-4 border-primary/20">
              <Bell size={56} className="text-primary/60" strokeWidth={1.5} />
            </div>
            <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 rounded-full blur-xl animate-pulse" />
          </div>
          <h3 className={`text-2xl font-black mb-3 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {filter === 'unread' ? t('dashboard.notifications.noUnread') : 
             filter === 'read' ? t('dashboard.notifications.noRead') : 
             t('dashboard.notifications.noNotifications')}
          </h3>
          <p className={`max-w-md mx-auto text-lg leading-relaxed ${
            isDarkMode ? 'text-slate-300' : 'text-gray-600'
          }`}>
            {filter === 'unread' ? t('dashboard.notifications.allReadMessage') :
             filter === 'read' ? t('dashboard.notifications.noReadMessage') :
             t('dashboard.notifications.noNotificationsMessage')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification, index) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`
                rounded-2xl p-6 
                shadow-lg border-2 transition-all duration-300
                hover:shadow-xl hover:-translate-y-1 cursor-pointer
                ${!notification.read 
                  ? isDarkMode
                    ? 'bg-gradient-to-br from-primary/10 via-slate-800 to-slate-800 border-primary/30 shadow-primary/10'
                    : 'bg-gradient-to-br from-primary/5 via-white to-white border-primary/30 shadow-primary/10'
                  : isDarkMode
                    ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`
                  mt-1 p-3 rounded-xl flex-shrink-0
                  ${!notification.read 
                    ? 'bg-primary/10 text-primary border-2 border-primary/20' 
                    : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                  }
                `}>
                  <Calendar size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className={`
                      text-lg font-bold line-clamp-2
                      ${!notification.read 
                        ? isDarkMode ? 'text-white' : 'text-gray-900'
                        : isDarkMode ? 'text-slate-300' : 'text-gray-600'
                      }
                    `}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="w-3 h-3 bg-primary rounded-full flex-shrink-0 mt-1.5 animate-pulse"></span>
                    )}
                  </div>
                  
                  <p className={`text-sm mb-3 line-clamp-3 ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    {notification.message}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className={`flex items-center gap-2 text-xs ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      <Calendar size={14} />
                      <span>{formatDate(notification.created_at)}</span>
                    </div>
                    
                    {notification.data?.booking_id && (
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-lg border border-primary/20">
                        {t('dashboard.notifications.booking')} #{notification.data.booking_id}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => fetchNotificationsCallback(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {t('dashboard.support.previous')}
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
                  className={`
                    px-4 py-2 rounded-lg font-semibold transition-all
                    ${currentPage === pageNum
                      ? 'bg-primary text-white shadow-lg'
                      : 'border-2 border-gray-200 text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => fetchNotificationsCallback(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {t('dashboard.support.next')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
