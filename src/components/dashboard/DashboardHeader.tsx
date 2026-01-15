import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Settings, Globe, ChevronDown, LogOut, Calendar, Moon, Sun, Menu, Coins } from 'lucide-react';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { logout, getNotifications, markNotificationAsRead, useThemeStore, getWallet } from '../../storeApi/storeApi';
import { useAuthStore } from '../../storeApi/storeApi';
import type { Notification } from '../../types/types';

interface DashboardHeaderProps {
  title?: string;
  notificationCount?: number;
  onMenuClick?: () => void;
}

const DashboardHeader = ({
  title,
  notificationCount: propNotificationCount,
  onMenuClick,
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { logout: logoutStore, clearAuth, user } = useAuthStore();
  
  // Use translated title if not provided
  const displayTitle = title || t('common.dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [pointsPerRiyal, setPointsPerRiyal] = useState<number>(10);
  const [isLoadingWallet, setIsLoadingWallet] = useState<boolean>(false);

  // الاستماع لتغييرات user من الـ store مباشرة (Zustand سيتولى re-render)
  // لا حاجة لـ interval أو storage events لأن Zustand يتولى ذلك

  // تحديث اتجاه الصفحة عند تغيير اللغة
  useEffect(() => {
    const currentLang = i18n.language;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [i18n.language]);

  // جلب الإشعارات
  const fetchNotifications = async () => {
    setIsLoadingNotifications(true);
    try {
      const result = await getNotifications({
        read: false,
        type: 'booking_created',
        per_page: 20,
      });
      
      if (result.success) {
        setNotifications(result.data.data || []);
        setUnreadCount(result.unread_count || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  // جلب بيانات المحفظة
  const fetchWallet = async () => {
    setIsLoadingWallet(true);
    try {
      const result = await getWallet();
      if (result.success && result.data) {
        setWalletBalance(result.data.wallet.balance || 0);
        setPointsPerRiyal(result.data.settings.points_per_riyal || 10);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setIsLoadingWallet(false);
    }
  };

  // جلب الإشعارات عند تحميل المكون
  useEffect(() => {
    fetchNotifications();
    fetchWallet();
    
    // تحديث الإشعارات كل 30 ثانية
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    // تحديث المحفظة كل دقيقة
    const walletInterval = setInterval(() => {
      fetchWallet();
    }, 60000);

    // الاستماع لتحديث النقاط بعد الحجز
    const handleWalletUpdate = () => {
      fetchWallet();
    };
    
    window.addEventListener('wallet-updated', handleWalletUpdate);

    return () => {
      clearInterval(interval);
      clearInterval(walletInterval);
      window.removeEventListener('wallet-updated', handleWalletUpdate);
    };
  }, []);

  // استخدام unreadCount من API أو من prop
  const notificationCount = propNotificationCount !== undefined ? propNotificationCount : unreadCount;

  // تحديث حالة الإشعار كمقروء
  const handleMarkAsRead = async (notification: Notification, shouldNavigate: boolean = false) => {
    // إذا كان الإشعار غير مقروء، قم بتحديثه
    if (!notification.read) {
      try {
        const result = await markNotificationAsRead(Number(notification.id));
        if (result.success) {
          // إزالة الإشعار من القائمة فوراً لأنه أصبح مقروءاً
          // (لأن fetchNotifications يجلب فقط الإشعارات غير المقروءة)
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
          
          // تحديث عدد الإشعارات غير المقروءة
          setUnreadCount(prev => Math.max(0, prev - 1));
          
          // إعادة جلب الإشعارات لتحديث القائمة
          await fetchNotifications();
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // التوجيه إذا كان مطلوباً
    if (shouldNavigate) {
      setIsNotificationOpen(false);
      if (notification.data?.booking_id) {
        navigate('/admin/bookings');
      } else {
        navigate('/admin/notifications');
      }
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'الآن';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `منذ ${minutes} دقيقة`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `منذ ${hours} ساعة`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `منذ ${days} يوم`;
    } else {
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  
  // Dark mode state - من store شامل للتطبيق
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  
  // Get current language from i18n
  const currentLanguage = i18n.language === 'ar' ? t('languages.ar') : t('languages.en');

  // دالة للحصول على أول حرف من الاسم
  const getInitials = (name: string | null | undefined): string => {
    if (!name || name.trim() === '') return '?';
    // الحصول على أول حرف من الاسم
    return name.trim().charAt(0).toUpperCase();
  };

  // الحصول على بيانات المستخدم مباشرة من الـ store
  // Zustand سيتولى re-render تلقائياً عند تغيير user
  const userName = user?.name || t('common.user');
  const userEmail = user?.email || user?.phone || '';
  const userInitials = getInitials(user?.name);

  const languages = [
    { code: 'ar', name: t('languages.ar'), flag: '🇸🇦' },
    { code: 'en', name: t('languages.en'), flag: '🇬🇧' },
  ];

  const handleLanguageChange = async (lang: { code: string; name: string; flag: string }) => {
    try {
      setIsLanguageOpen(false);
      
      // التحقق من وجود i18n و changeLanguage
      if (!i18n) {
        console.error('i18n is not available');
        localStorage.setItem('i18nextLng', lang.code);
        window.location.reload();
        return;
      }

      // التحقق من أن changeLanguage موجودة
      if (typeof i18n.changeLanguage !== 'function') {
        console.error('i18n.changeLanguage is not a function', i18n);
        localStorage.setItem('i18nextLng', lang.code);
        window.location.reload();
        return;
      }

      // Change language using i18n
      await i18n.changeLanguage(lang.code);
      
      // Update document direction based on language
      document.documentElement.dir = lang.code === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang.code;
    } catch (error) {
      console.error('Error changing language:', error);
      // Fallback: حفظ اللغة في localStorage وإعادة تحميل الصفحة
      localStorage.setItem('i18nextLng', lang.code);
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: 'question',
      title: t('logout.title'),
      text: t('logout.confirm'),
      showCancelButton: true,
      confirmButtonText: t('logout.confirmButton'),
      cancelButtonText: t('logout.cancelButton'),
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'font-ElMessiri',
      },
    });

    if (result.isConfirmed) {
      try {
        // إرسال طلب logout إلى API
        const response = await logout();
        
        // مسح البيانات من Zustand store (سيتم تنظيف localStorage تلقائياً)
        logoutStore();
        clearAuth();
        
        await Swal.fire({
          icon: 'success',
          title: t('logout.success'),
          text: response.message || t('logout.successMessage'),
          confirmButtonText: t('logout.ok'),
          confirmButtonColor: '#114C5A',
          customClass: {
            popup: 'font-ElMessiri',
          },
          allowOutsideClick: true,
          allowEscapeKey: true,
        });
        
        // التوجيه إلى صفحة تسجيل الدخول
        navigate('/login', { replace: true });
      } catch (error) {
        // حتى لو فشل الطلب، نمسح البيانات المحلية
        logoutStore();
        clearAuth();
        // التوجيه إلى صفحة تسجيل الدخول
        navigate('/login', { replace: true });
      }
    }
  };

  // تحديد الاتجاه بناءً على اللغة
  const isRTL = i18n.language === 'ar';

  return (
    <header 
      className={`h-16 sm:h-18 border-b flex items-center ${isRTL ? 'justify-between' : 'justify-between'} px-4 sm:px-6 md:px-8 shadow-sm transition-all duration-300 ${
        isDarkMode 
          ? 'bg-[#114C5A] border-[#114C5A]/30' 
          : 'bg-[#FBFBFB] border-[#114C5A]/10'
      }`} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Menu Button - Mobile Only */}
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className={`lg:hidden p-2 sm:p-2.5 rounded-lg transition-all duration-200 mr-3 sm:mr-4 ${
            isDarkMode 
              ? 'hover:bg-[#114C5A]/50 text-[#FBFBFB]' 
              : 'hover:bg-[#FBFBFB] text-[#333333]'
          }`}
          aria-label="Toggle menu"
        >
          <Menu size={20} className="sm:w-5 sm:h-5" />
        </button>
      )}

      {/* Title */}
      <h1 className={`text-lg sm:text-xl md:text-2xl font-bold truncate flex-1 min-w-0 ${isDarkMode ? 'text-[#FBFBFB]' : 'text-[#333333]'} ${isRTL ? 'text-right' : 'text-left'} ${onMenuClick ? '' : 'mr-3 sm:mr-4'}`}>{displayTitle}</h1>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
        {/* Points/Wallet Display */}
        <div className={`hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 shadow-sm ${
          isDarkMode 
            ? 'bg-[#FFB200]/20 border border-[#FFB200]/30 text-[#FFB200]' 
            : 'bg-[#FFB200]/10 border border-[#FFB200]/20 text-[#FFB200]'
        }`}>
          <Coins size={18} className="sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base font-bold">
            {isLoadingWallet ? '...' : walletBalance.toLocaleString()}
          </span>
          <span className="text-xs sm:text-sm opacity-80 font-medium">نقطة</span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`relative p-2 sm:p-2.5 rounded-lg transition-all duration-200 ${
            isDarkMode 
              ? 'hover:bg-[#114C5A]/50 text-[#FBFBFB]' 
              : 'hover:bg-[#FBFBFB] text-[#333333]'
          }`}
          title={isDarkMode ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
        >
          {isDarkMode ? (
            <Sun size={20} className="sm:w-5 sm:h-5 text-[#FFB200]" />
          ) : (
            <Moon size={20} className="sm:w-5 sm:h-5" />
          )}
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setIsLanguageOpen(!isLanguageOpen);
              setIsNotificationOpen(false);
              setIsProfileOpen(false);
            }}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'hover:bg-[#114C5A]/50 text-[#FBFBFB]' 
                : 'hover:bg-[#FBFBFB] text-[#333333]'
            }`}
          >
            <Globe size={20} className="sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-semibold hidden md:inline">{currentLanguage}</span>
            <ChevronDown size={16} className={`sm:w-4 sm:h-4 transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Language Dropdown */}
          {isLanguageOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsLanguageOpen(false)}
              ></div>
              <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 sm:w-52 rounded-xl shadow-2xl py-2 z-20 border ${
                isDarkMode 
                  ? 'bg-[#114C5A] border-[#114C5A]/30' 
                  : 'bg-[#FBFBFB] border-[#114C5A]/10'
              }`}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full flex items-center gap-3 px-4 py-3 ${isRTL ? 'text-right' : 'text-left'} transition-all duration-200 ${
                      isDarkMode 
                        ? 'hover:bg-[#114C5A]/50 text-[#FBFBFB]' 
                        : 'hover:bg-[#FBFBFB] text-[#333333]'
                    } ${
                      i18n.language === lang.code 
                        ? isDarkMode ? 'bg-[#FFB200]/20 text-[#FFB200]' : 'bg-[#FFB200]/10 text-[#FFB200]' 
                        : ''
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className={`text-sm font-semibold flex-1 ${isDarkMode ? 'text-[#FBFBFB]' : 'text-[#333333]'}`}>{lang.name}</span>
                    {i18n.language === lang.code && (
                      <div className="w-2 h-2 bg-[#FFB200] rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsProfileOpen(false);
              setIsLanguageOpen(false);
            }}
            className={`relative p-2 sm:p-2.5 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'hover:bg-[#114C5A]/50 text-[#FBFBFB]' 
                : 'hover:bg-[#FBFBFB] text-[#333333]'
            }`}
          >
            <Bell size={20} className="sm:w-5 sm:h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 sm:w-6 sm:h-6 text-[10px] sm:text-xs bg-[#FFB200] text-[#333333] rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-white">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsNotificationOpen(false)}
              ></div>
              <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-[calc(100vw-2rem)] sm:w-80 md:w-96 rounded-xl shadow-2xl z-20 max-h-[calc(100vh-8rem)] sm:max-h-[600px] flex flex-col border ${
                isDarkMode 
                  ? 'bg-[#114C5A] border-[#114C5A]/30' 
                  : 'bg-[#FBFBFB] border-[#114C5A]/10'
              }`}>
                <div className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${
                  isDarkMode ? 'border-[#114C5A]/30' : 'border-[#114C5A]/10'
                }`}>
                  <h3 className={`text-base sm:text-lg font-bold ${isDarkMode ? 'text-[#FBFBFB]' : 'text-[#333333]'}`}>{t('header.notifications')}</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs sm:text-sm bg-[#FFB200] text-[#333333] px-3 py-1.5 rounded-full font-bold whitespace-nowrap shadow-sm">
                      {unreadCount} غير مقروء
                    </span>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto">
                  {isLoadingNotifications ? (
                    <div className="p-6 sm:p-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">جاري تحميل الإشعارات...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-6 sm:p-8 text-center">
                      <Bell size={40} className="sm:w-12 sm:h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-xs sm:text-sm text-gray-500">لا توجد إشعارات جديدة</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleMarkAsRead(notification, true);
                        }}
                        className={`p-4 sm:p-5 border-b transition-all duration-200 cursor-pointer ${
                          isDarkMode 
                            ? `border-[#114C5A]/30 hover:bg-[#114C5A]/50 ${!notification.read ? 'bg-[#FFB200]/20' : ''}`
                            : `border-[#114C5A]/10 hover:bg-[#FBFBFB] ${!notification.read ? 'bg-[#FFB200]/10' : ''}`
                        }`}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className={`mt-0.5 sm:mt-1 p-2 sm:p-2.5 rounded-lg flex-shrink-0 ${
                            !notification.read 
                              ? 'bg-[#FFB200]/20 text-[#FFB200]' 
                              : isDarkMode ? 'bg-[#114C5A]/50 text-[#FBFBFB]/60' : 'bg-[#FBFBFB] text-[#333333]/60'
                          }`}>
                            <Calendar size={16} className="sm:w-4 sm:h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm sm:text-base font-bold truncate ${
                                !notification.read 
                                  ? isDarkMode ? 'text-[#FBFBFB]' : 'text-[#333333]'
                                  : isDarkMode ? 'text-[#FBFBFB]/70' : 'text-[#333333]/70'
                              }`}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#FFB200] rounded-full mt-1.5 flex-shrink-0 shadow-sm"></span>
                              )}
                            </div>
                            <p className={`text-xs sm:text-sm mt-1.5 line-clamp-2 ${isDarkMode ? 'text-[#FBFBFB]/70' : 'text-[#333333]/70'}`}>
                              {notification.message}
                            </p>
                            <p className={`text-[10px] sm:text-xs mt-2 sm:mt-2.5 ${isDarkMode ? 'text-[#FBFBFB]/60' : 'text-[#333333]/60'}`}>
                              {formatDate(notification.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className={`p-3 sm:p-4 border-t ${isDarkMode ? 'border-[#114C5A]/30' : 'border-[#114C5A]/10'}`}>
                    <button 
                      onClick={() => {
                        navigate('/admin/notifications');
                        setIsNotificationOpen(false);
                      }}
                      className={`w-full text-sm sm:text-base text-[#FFB200] hover:text-[#FFB200] font-bold text-center transition-colors duration-200 ${
                        isDarkMode ? 'hover:text-[#FFB200]' : ''
                      }`}
                    >
                      {t('common.viewAll')}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationOpen(false);
              setIsLanguageOpen(false);
            }}
            className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'hover:bg-[#114C5A]/50' 
                : 'hover:bg-[#FBFBFB]'
            }`}
          >
            <div className="relative">
              {/* Avatar with initials */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#114C5A] bg-gradient-to-br from-[#114C5A] to-[#114C5A] flex items-center justify-center text-[#FBFBFB] font-bold text-sm sm:text-base shadow-md">
                {userInitials}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#FFB200] rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className={`hidden lg:block ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className={`text-sm sm:text-base font-bold ${isDarkMode ? 'text-[#FBFBFB]' : 'text-[#333333]'}`}>{userName}</p>
              <p className={`text-xs sm:text-sm truncate max-w-[120px] xl:max-w-[150px] ${isDarkMode ? 'text-[#FBFBFB]/70' : 'text-[#333333]/70'}`}>{userEmail}</p>
            </div>
            <ChevronDown size={16} className={`sm:w-4 sm:h-4 transition-transform duration-200 ${isDarkMode ? 'text-[#FBFBFB]/60' : 'text-[#333333]/60'} ${isProfileOpen ? 'rotate-180' : ''} hidden sm:block`} />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 "
                onClick={() => setIsProfileOpen(false)}
              ></div>
              <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-[calc(100vw-2rem)] sm:w-72 rounded-xl shadow-2xl border py-2 z-20 ${
                isDarkMode 
                  ? 'bg-[#114C5A] border-[#114C5A]/30' 
                  : 'bg-[#FBFBFB] border-[#114C5A]/10'
              }`}>
                {/* User Info */}
                <div className={`px-4 sm:px-5 py-4 sm:py-5 border-b bg-gradient-to-br ${
                  isDarkMode 
                    ? 'border-[#114C5A]/30 from-[#FFB200]/20 to-[#FFB200]/30' 
                    : 'border-[#114C5A]/10 from-[#FFB200]/10 to-[#FFB200]/15'
                }`}>
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Avatar with initials */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 sm:border-[3px] border-[#114C5A] bg-gradient-to-br from-[#114C5A] to-[#114C5A] flex items-center justify-center text-[#FBFBFB] font-bold text-lg sm:text-xl shadow-lg flex-shrink-0">
                      {userInitials}
                    </div>
                    <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <p className={`font-bold text-base sm:text-lg truncate ${isDarkMode ? 'text-[#FBFBFB]' : 'text-[#333333]'}`}>{userName}</p>
                      <p className={`text-xs sm:text-sm mt-1 truncate ${isDarkMode ? 'text-[#FBFBFB]/70' : 'text-[#333333]/70'}`}>{userEmail}</p>
                      {user?.phone && (
                        <p className={`text-xs sm:text-sm mt-1 truncate ${isDarkMode ? 'text-[#FBFBFB]/60' : 'text-[#333333]/60'}`}>{user.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/admin/settings');
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 ${isRTL ? 'text-right' : 'text-left'} transition-all duration-200 ${
                      isDarkMode 
                        ? 'hover:bg-[#114C5A]/50 text-[#FBFBFB]' 
                        : 'hover:bg-[#FBFBFB] text-[#333333]'
                    }`}
                  >
                    <Settings size={18} className={`sm:w-5 sm:h-5 ${isDarkMode ? 'text-[#FBFBFB]/60' : 'text-[#333333]/60'}`} />
                    <span className="text-sm sm:text-base font-semibold">{t('common.settings')}</span>
                  </button>
                </div>

                {/* Logout */}
                <div className={`border-t pt-2 ${isDarkMode ? 'border-[#114C5A]/30' : 'border-[#114C5A]/10'}`}>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-4 py-3 ${isRTL ? 'text-right' : 'text-left'} transition-all duration-200 ${
                      isDarkMode 
                        ? 'hover:bg-red-900/30 text-red-400' 
                        : 'hover:bg-red-50 text-red-600'
                    }`}
                  >
                    <LogOut size={18} className="sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base font-semibold">{t('common.logout')}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

