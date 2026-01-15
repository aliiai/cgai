import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { dashboardRoutes } from '../routes';
import { useThemeStore } from '../storeApi/store/theme.store';

const DashboardLayout = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // الحصول على عنوان الصفحة من الـ route
  const getPageTitle = () => {
    const currentRoute = dashboardRoutes.find(route => route.path === location.pathname);
    return currentRoute?.name || 'لوحة التحكم';
  };

  // تحديد الاتجاه بناءً على اللغة
  const isRTL = i18n.language === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';

  return (
    <div className={`h-screen flex ${isRTL ? '' : 'flex-row'} overflow-hidden ${
      isDarkMode ? 'bg-[#114C5A]' : 'bg-[#FBFBFB]'
    }`} dir={direction}>
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader 
          title={getPageTitle()} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        {/* Content - Outlet will render the child routes */}
        <main className={`flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto custom-scrollbar ${
          isDarkMode ? 'bg-[#114C5A]' : 'bg-[#FBFBFB]'
        }`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

