import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Logo from '../../Logo';
import LanguageSelector from '../../LanguageSelector';
import AuthButtons from '../../AuthButtons';
import { useThemeStore } from '../../../storeApi/storeApi';
import HeaderNav from './HeaderNav';
import HeaderActions from './HeaderActions';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Theme state
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  
  // تحديد الاتجاه بناءً على اللغة
  const isRTL = i18n.language === 'ar';

  // روابط التنقل مع الترجمة
  const navLinks = useMemo(() => [
    { id: 'home', label: t('header.home'), path: '/' },
    { id: 'technologies', label: t('header.technologies'), path: '/technologies' },
    { id: 'news', label: t('header.news'), path: '/news' },
    { id: 'request-service', label: t('header.requestService'), path: '/request-service' },
    { id: 'contact', label: t('header.contact'), path: '/contact' },
  ], [t]);

  const [activeLink, setActiveLink] = useState(navLinks[0].label);

  // Sync active link with current path وعند تغيير اللغة
  useEffect(() => {
    const currentPath = location.pathname;
    const activeNav = navLinks.find(link => link.path === currentPath);
    if (activeNav) {
      setActiveLink(activeNav.label);
    } else if (currentPath === '/') {
      setActiveLink(navLinks[0].label);
    }
  }, [location.pathname, navLinks, i18n.language]);

  const handleNavClick = (path: string, label: string) => {
    setActiveLink(label);
    navigate(path);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handleNavClick('/', navLinks[0].label);
  };

  // Animation variants
  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: 0.2, ease: 'easeOut' as const },
    },
  };

  const navVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, delay: 0.3, ease: 'easeOut' as const },
    },
  };

  const buttonsVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: 0.4, ease: 'easeOut' as const },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -10, transition: { duration: 0.3, ease: 'easeIn' as const } },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' as const, staggerChildren: 0.02 },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' as const } },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.header
      className={`w-full sticky top-0 z-[1000] border-b transition-colors duration-300 shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
        }`}
      dir={isRTL ? 'rtl' : 'ltr'}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <nav className="h-[70px] sm:h-[80px] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-full flex items-center justify-between">
          {/* Logo - Right Side */}
          <motion.div variants={logoVariants} initial="hidden" animate="visible">
            <Logo onClick={handleLogoClick} size="sm" className="sm:hidden" />
            <Logo onClick={handleLogoClick} size="md" className="hidden sm:block" />
          </motion.div>

          {/* Navigation Links - Center */}
          <HeaderNav
            navLinks={navLinks}
            activeLink={activeLink}
            onLinkClick={handleNavClick}
            variants={navVariants}
          />

          {/* Action Buttons - Left Side */}
          <HeaderActions
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            variants={buttonsVariants}
          />
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className={`sm:hidden absolute top-full left-0 right-0 border-t shadow-lg z-50 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
                }`}
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link, index) => {
                  const isActive = activeLink === link.label;
                  return (
                    <motion.a
                      key={link.id}
                      href={link.path}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                        handleNavClick(link.path, link.label);
                      }}
                      className={`block py-3 px-4 rounded-lg transition-colors ${isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : isDarkMode ? 'text-gray-300 hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      variants={menuItemVariants}
                      custom={index}
                    >
                      {link.label}
                    </motion.a>
                  );
                })}
                <div className={`pt-4 border-t space-y-2 ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                  <LanguageSelector className="w-full" />
                  <div className="pt-2">
                    <AuthButtons />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
