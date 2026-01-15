import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer';
import { useThemeStore } from '../storeApi/store/theme.store';

const PublicLayout = () => {
  const { isDarkMode } = useThemeStore();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={`public-layout min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'
      }`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      <main className="transition-colors duration-300">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;

