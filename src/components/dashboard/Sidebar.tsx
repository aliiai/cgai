import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown, ChevronUp, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getDashboardLinks } from '../../pages/dashboard/dashboardLinks.tsx';
import Swal from 'sweetalert2';
import { logout, useThemeStore } from '../../storeApi/storeApi';
import { useAuthStore } from '../../storeApi/storeApi';
import Logo from '../Logo';
import type { DashboardLink } from '../../types/types';

interface SidebarItemProps {
  item: DashboardLink;
  isActive: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  isCollapsed?: boolean;
}

const SidebarItem = ({ item, isActive, isOpen, onToggle, isCollapsed = false }: SidebarItemProps) => {
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
    <div className="mb-1 group/item">
      <Link
        to={item.path}
        onClick={handleClick}
        className="block"
        title={isCollapsed ? item.name : ''}
      >
        <div
          className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg transition-colors duration-200 ${
            isActive && !hasChildren
              ?               isDarkMode 
                ? 'bg-slate-700 text-white'
                : 'bg-[#114C5A]/10 text-[#114C5A]'
              :               isDarkMode
                ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
                : 'text-[#333333] hover:bg-[#FBFBFB] hover:text-[#114C5A]'
          }`}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'} min-w-0 flex-1`}>
            {/* Featured badge */}
            {item.isFeatured && !isCollapsed && (
              <div className={`absolute ${i18n.language === 'ar' ? 'left-1' : 'right-1'} top-1 flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-semibold ${
                isDarkMode 
                  ? 'bg-[#FFB200]/20 text-[#FFB200]' 
                  : 'bg-[#FFB200]/15 text-[#FFB200]'
              }`}>
                <Sparkles size={6} />
                <span className="hidden sm:inline">{t('sidebar.new') || 'جديد'}</span>
              </div>
            )}

            <div className={`flex-shrink-0 transition-colors ${
              isActive && !hasChildren
                ? isDarkMode ? 'text-white' : 'text-[#114C5A]'
                : isDarkMode ? 'text-gray-300' : 'text-[#333333]/60'
            }`}>
              <div className="w-4.5 h-4.5 flex items-center justify-center">
                {item.iconElement}
              </div>
            </div>

            {!isCollapsed && (
              <span className={`text-sm font-medium truncate ${i18n.language === 'ar' ? 'text-right' : 'text-left'} ${
                isActive && !hasChildren
                  ? isDarkMode ? 'text-white' : 'text-[#114C5A]'
                  : ''
              }`}>
                {item.name}
              </span>
            )}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className={`absolute ${i18n.language === 'ar' ? 'right-full mr-2' : 'left-full ml-2'} top-1/2 -translate-y-1/2 z-50 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none ${
                isDarkMode 
                  ? 'bg-slate-700 text-white shadow-lg' 
                  : 'bg-slate-700 text-white shadow-lg'
              }`}>
                {item.name}
                <div className={`absolute top-1/2 -translate-y-1/2 ${i18n.language === 'ar' ? 'right-0 translate-x-full' : 'left-0 -translate-x-full'} w-0 h-0 border-4 border-transparent ${
                  isDarkMode 
                    ? 'border-l-[#114C5A]' 
                    : 'border-l-[#333333]'
                } ${i18n.language === 'ar' ? 'border-r-0' : 'border-l-0'}`}></div>
              </div>
            )}
          </div>

          {hasChildren && !isCollapsed && (
            <div className={`transition-colors ${isDarkMode ? 'text-gray-300' : 'text-[#333333]/60'}`}>
              {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          )}
        </div>
      </Link>

      {/* Sub Items */}
      {hasChildren && isOpen && !isCollapsed && (
        <div className={`${i18n.language === 'ar' ? 'mr-3 pr-2 border-r' : 'ml-3 pl-2 border-l'} ${
          isDarkMode ? 'border-slate-700' : 'border-[#114C5A]/20'
        } space-y-0.5 mt-0.5`}>
          {item.children!.map((child) => {
            const isChildActive = location.pathname === child.path;
            return (
              <Link key={child.id} to={child.path} className="block">
                <div
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-xs transition-colors ${
                    isChildActive
                      ?               isDarkMode 
                ? 'bg-slate-700 text-white'
                : 'bg-[#114C5A]/10 text-[#114C5A]'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
                        : 'text-[#333333]/70 hover:bg-[#FBFBFB] hover:text-[#114C5A]'
                  }`}
                >
                  <div className={`flex-shrink-0 ${isChildActive ? (isDarkMode ? 'text-white' : 'text-[#114C5A]') : isDarkMode ? 'text-gray-300' : 'text-[#333333]/60'}`}>
                    <div className="w-3.5 h-3.5 flex items-center justify-center">
                      {child.iconElement}
                    </div>
                  </div>
                  <span className={`truncate ${isChildActive ? 'font-medium' : ''}`}>
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
  // Track collapsed state (Desktop only)
  const [isCollapsed, setIsCollapsed] = useState(false);

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
          navigate('/login', { replace: true });
        });
      } catch (error) {
        logoutStore();
        clearAuth();
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
      <aside className={`lg:hidden fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} w-60 z-50 flex flex-col ${borderClass} shadow-lg h-screen transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
      } ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-[#FBFBFB] border-[#114C5A]/10'
      }`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Mobile Sidebar Content */}
        <div className="flex flex-col h-full">
          {/* Logo/Header Section */}
          <div className={`h-18 flex items-center justify-center relative px-3.5 border-b shrink-0 ${
            isDarkMode ? 'border-slate-700' : 'border-[#114C5A]/10'
          }`}>
            <Logo size="md" />
            {onClose && (
              <button
                onClick={onClose}
                className={`absolute ${i18n.language === 'ar' ? 'left-3.5' : 'right-3.5'} p-1.5 rounded transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-slate-700 text-gray-300' 
                    : 'hover:bg-[#FBFBFB] text-[#333333]'
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
          <nav className="flex-1 px-2.5 py-3 overflow-y-auto custom-scrollbar">
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
                    if (!link.children && onClose) {
                      onClose();
                    }
                  }}
                />
              );
            })}
          </nav>

          {/* Logout Section */}
          <div className={`p-2.5 border-t shrink-0 ${
            isDarkMode ? 'border-slate-700' : 'border-[#114C5A]/10'
          }`}>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-colors text-sm ${
                isDarkMode
                  ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  : 'text-[#333333] hover:bg-[#FBFBFB] hover:text-[#114C5A]'
              }`}
            >
              <LogOut size={16} />
              <span className="font-medium">{t('common.logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex ${isCollapsed ? 'w-20' : 'w-60'} flex-col ${borderClass} shadow-lg h-screen sticky top-0 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-[#FBFBFB] border-[#114C5A]/10'
      }`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Logo/Header Section */}
        <div className={`h-32 flex items-center ${isCollapsed ? 'justify-center' : 'justify-center'} relative px-3.5 border-b shrink-0 ${
          isDarkMode ? 'border-[#114C5A]/30' : 'border-[#114C5A]/10'
        }`}>
          {!isCollapsed && <Logo size="lg" />}
          {isCollapsed && <Logo size="md" />}
          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`absolute ${i18n.language === 'ar' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-slate-700 text-gray-300' 
                : 'hover:bg-[#FBFBFB] text-[#333333]'
            }`}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              i18n.language === 'ar' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />
            ) : (
              i18n.language === 'ar' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-3 overflow-y-auto custom-scrollbar">
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
                <div key={sectionKey} className="mb-4">
                  {/* Section Title */}
                  {sectionNames[sectionKey] && !isCollapsed && (
                    <div className="px-2.5 mb-2.5 mt-5 first:mt-2">
                      <h3 className={`text-[10px] font-bold uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-400' : 'text-[#333333]/50'
                      }`}>
                        {sectionNames[sectionKey]}
                      </h3>
                    </div>
                  )}

                  {/* Section Links */}
                  {sectionLinks.map((link) => {
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
                      isCollapsed={isCollapsed}
                    />
                  );
                  })}
                </div>
              );
            });
          })()}
        </nav>

        {/* Logout Section */}
        <div className={`p-2.5 border-t shrink-0 ${
          isDarkMode ? 'border-[#114C5A]/30' : 'border-[#114C5A]/10'
        }`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-2.5 py-2 rounded-lg transition-colors text-sm group/logout ${
              isDarkMode
                ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
                : 'text-[#333333] hover:bg-[#FBFBFB] hover:text-[#114C5A]'
            }`}
            title={isCollapsed ? t('common.logout') : ''}
          >
            <LogOut size={16} />
            {!isCollapsed && <span className="font-medium">{t('common.logout')}</span>}
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className={`absolute ${i18n.language === 'ar' ? 'right-full mr-2' : 'left-full ml-2'} top-1/2 -translate-y-1/2 z-50 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover/logout:opacity-100 transition-opacity pointer-events-none ${
                isDarkMode 
                  ? 'bg-slate-700 text-white shadow-lg' 
                  : 'bg-slate-700 text-white shadow-lg'
              }`}>
                {t('common.logout')}
                <div className={`absolute top-1/2 -translate-y-1/2 ${i18n.language === 'ar' ? 'right-0 translate-x-full' : 'left-0 -translate-x-full'} w-0 h-0 border-4 border-transparent ${
                  isDarkMode 
                    ? 'border-l-[#114C5A]' 
                    : 'border-l-[#333333]'
                } ${i18n.language === 'ar' ? 'border-r-0' : 'border-l-0'}`}></div>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
