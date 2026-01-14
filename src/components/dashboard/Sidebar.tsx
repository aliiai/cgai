import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Shield, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getDashboardLinks } from '../../pages/dashboard/dashboardLinks.tsx';
import Swal from 'sweetalert2';
import { logout, useThemeStore } from '../../storeApi/storeApi';
import { useAuthStore } from '../../storeApi/storeApi';
import type { DashboardLink } from '../../types/types';

interface SidebarItemProps {
  item: DashboardLink;
  isActive: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const SidebarItem = ({ item, isActive, isOpen, onToggle }: SidebarItemProps) => {
  const hasChildren = item.children && item.children.length > 0;
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const { isDarkMode } = useThemeStore();

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      if (onToggle) onToggle();
    }
  };

  return (
    <div className="mb-1">
      <Link
        to={item.path}
        onClick={handleClick}
        className="block"
      >
        <div
          className={`relative flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-300 group ${
            item.isFeatured
              ? isActive && !hasChildren
                ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary border-l-[3px] border-primary shadow-md shadow-primary/10'
                : isDarkMode
                  ? 'bg-primary/5 border-l-[3px] border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60 hover:shadow-sm'
                  : 'bg-primary/5 border-l-[3px] border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60 hover:shadow-sm'
              : isActive && !hasChildren
                ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm'
                : isDarkMode
                  ? 'text-gray-400 hover:bg-slate-700/50 hover:text-white hover:shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* Active indicator bar */}
            {isActive && !hasChildren && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 sm:h-10 bg-gradient-to-b from-primary to-primary-dark rounded-l-full shadow-lg shadow-primary/50"></div>
            )}

            {/* Featured badge */}
            {item.isFeatured && (
              <div className={`absolute ${i18n.language === 'ar' ? 'left-1' : 'right-1'} top-1 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
                isDarkMode 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-primary/15 text-primary'
              }`}>
                <Sparkles size={7} />
                <span className="hidden sm:inline">{t('sidebar.new') || 'جديد'}</span>
              </div>
            )}

            <div className={`flex-shrink-0 transition-colors ${
              item.isFeatured
                ? 'text-primary'
                : isActive && !hasChildren 
                  ? 'text-primary' 
                  : isDarkMode ? 'text-gray-500' : 'text-gray-500'
            }`}>
              <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                {item.iconElement}
              </div>
            </div>

            <span className={`text-sm sm:text-base font-medium truncate ${i18n.language === 'ar' ? 'text-right' : 'text-left'} transition-colors ${
              item.isFeatured
                ? 'text-primary font-semibold'
                : isActive && !hasChildren 
                  ? 'text-primary font-semibold' 
                  : isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {item.name}
            </span>
          </div>

          {hasChildren && (
            <div className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          )}
        </div>
      </Link>

      {/* Sub Items */}
      {hasChildren && isOpen && (
        <div className={`${i18n.language === 'ar' ? 'mr-4 sm:mr-6 pr-2 border-r-2' : 'ml-4 sm:ml-6 pl-2 border-l-2'} ${
          isDarkMode ? 'border-slate-700' : 'border-gray-100'
        } space-y-1 mt-1 transition-all`}>
          {item.children!.map((child) => {
            const isChildActive = location.pathname === child.path;
            return (
              <Link key={child.id} to={child.path} className="block">
                <div
                  className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all text-xs sm:text-sm ${
                    isChildActive
                      ? 'bg-primary/5 text-primary'
                      : isDarkMode
                        ? 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <div className={`flex-shrink-0 ${isChildActive ? 'text-primary' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center">
                      {child.iconElement}
                    </div>
                  </div>
                  <span className={`truncate ${isChildActive ? 'font-semibold' : ''}`}>
                    {child.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { logout: logoutStore, clearAuth } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  // Track open dropdowns (by ID)
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
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
        await logout();
        // مسح البيانات من Zustand store (سيتم تنظيف localStorage تلقائياً)
        logoutStore();
        clearAuth();
        Swal.fire({
          icon: 'success',
          title: t('logout.success'),
          text: t('logout.successMessage'),
          confirmButtonText: t('logout.ok'),
          confirmButtonColor: '#00adb5',
          customClass: {
            popup: 'font-ElMessiri',
          },
        }).then(() => {
          // التوجيه إلى صفحة تسجيل الدخول
          navigate('/login', { replace: true });
        });
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
  const borderClass = isRTL ? 'border-r' : 'border-l';

  return (
    <>
      {/* Mobile Sidebar - Overlay */}
      <aside className={`lg:hidden fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} w-64 z-50 flex flex-col ${borderClass} shadow-xl h-screen transition-transform duration-300 ease-in-out backdrop-blur-sm ${
        isOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
      } ${
        isDarkMode 
          ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-slate-700/50' 
          : 'bg-gradient-to-b from-white via-gray-50/50 to-white border-gray-200/50'
      }`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Mobile Sidebar Content */}
        <div className="flex flex-col h-full">
          {/* Logo/Header Section */}
          <div className={`h-16 sm:h-18 flex items-center gap-3 sm:gap-4 px-4 sm:px-5 border-b shrink-0 ${
            isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'
          }`}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className={`text-base sm:text-lg font-bold truncate bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent`}>{t('sidebar.dashboard')}</h2>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-slate-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 sm:px-3 py-3 sm:py-4 overflow-y-auto custom-scrollbar">
            {getDashboardLinks(t).map((link) => {
              const isChildActive = link.children?.some(child => location.pathname === child.path);
              const isActive = location.pathname === link.path || isChildActive;
              const isOpen = openDropdowns.includes(link.id);

              return (
                <SidebarItem
                  key={link.id}
                  item={link}
                  isActive={!!isActive}
                  isOpen={isOpen}
                  onToggle={() => {
                    handleToggle(link.id);
                    // Close sidebar when navigating on mobile
                    if (!link.children && onClose) {
                      onClose();
                    }
                  }}
                />
              );
            })}
          </nav>

          {/* Logout Section */}
          <div className={`p-3 sm:p-4 border-t shrink-0 ${
            isDarkMode ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:bg-red-900/20 hover:text-red-400'
                  : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="text-sm sm:text-base font-medium">{t('common.logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex w-64 flex-col ${borderClass} shadow-lg h-screen sticky top-0 backdrop-blur-sm ${
        isDarkMode 
          ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-slate-700/50' 
          : 'bg-gradient-to-b from-white via-gray-50/50 to-white border-gray-200/50'
      }`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Logo/Header Section */}
      <div className={`h-16 sm:h-18 flex items-center gap-3 sm:gap-4 px-4 sm:px-5 border-b shrink-0 ${
        isDarkMode ? 'border-slate-700/50' : 'border-gray-200/50'
      }`}>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30">
          <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className={`text-base sm:text-lg font-bold truncate bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent`}>{t('sidebar.dashboard')}</h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 sm:px-3 py-3 sm:py-4 overflow-y-auto custom-scrollbar">
        {(() => {
          const links = getDashboardLinks(t);
          
          // تجميع الروابط حسب الأقسام
          const groupedLinks: Record<string, typeof links> = {};
          links.forEach(link => {
            const section = link.section || 'other';
            if (!groupedLinks[section]) {
              groupedLinks[section] = [];
            }
            groupedLinks[section].push(link);
          });

          // ترتيب الأقسام
          const sectionOrder = ['main', 'services', 'works', 'ready-apps', 'subscriptions', 'reports', 'support', 'settings', 'other'];
          const sectionNames: Record<string, string> = {
            'main': '',
            'services': t('sidebar.sections.services') || 'الخدمات والحجوزات',
            'works': t('sidebar.sections.works') || 'إدارة الأعمال',
            'ready-apps': t('sidebar.sections.readyApps') || 'التطبيقات الجاهزة',
            'subscriptions': t('sidebar.sections.subscriptions') || 'الاشتراكات والمدفوعات',
            'reports': t('sidebar.sections.reports') || 'المراجعات والتقارير',
            'support': t('sidebar.sections.support') || 'الدعم والمساعدة',
            'settings': t('sidebar.sections.settings') || 'الإشعارات والإعدادات',
            'other': '',
          };

          return sectionOrder.map((sectionKey) => {
            const sectionLinks = groupedLinks[sectionKey];
            if (!sectionLinks || sectionLinks.length === 0) return null;

            return (
              <div key={sectionKey} className="mb-6">
                {/* Section Title */}
                {sectionNames[sectionKey] && (
                  <div className={`px-3 sm:px-4 mb-3 mt-6 first:mt-2`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                    </div>
                    <h3 className={`text-[10px] font-black uppercase tracking-widest ${
                      isDarkMode ? 'text-primary/60' : 'text-primary/70'
                    }`}>
                      {sectionNames[sectionKey]}
                    </h3>
                  </div>
                )}

                {/* Section Links */}
                {sectionLinks.map((link) => {
                  // Check if active (if it has children, check if any child is active)
                  const isChildActive = link.children?.some(child => location.pathname === child.path);
                  const isActive = location.pathname === link.path || isChildActive;

                  const isOpen = openDropdowns.includes(link.id);

                  return (
                    <SidebarItem
                      key={link.id}
                      item={link}
                      isActive={!!isActive}
                      isOpen={isOpen}
                      onToggle={() => handleToggle(link.id)}
                    />
                  );
                })}
              </div>
            );
          });
        })()}
      </nav>

      {/* Logout Section */}
      <div className={`p-3 sm:p-4 border-t shrink-0 ${
        isDarkMode ? 'border-slate-700' : 'border-gray-200'
      }`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors ${
            isDarkMode
              ? 'text-gray-400 hover:bg-red-900/20 hover:text-red-400'
              : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
          }`}
        >
          <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="text-sm sm:text-base font-medium">{t('common.logout')}</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;

