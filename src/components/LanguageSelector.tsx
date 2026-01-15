import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useThemeStore } from '../storeApi/storeApi';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  languages?: Language[];
  className?: string;
}

const defaultLanguages: Language[] = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

const LanguageSelector = ({
  languages = defaultLanguages,
  className = ''
}: LanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const { isDarkMode } = useThemeStore();

  // Update document direction on language change
  useEffect(() => {
    const currentLang = i18n.language;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [i18n.language]);

  // Handle language change
  const handleLanguageChange = async (lang: Language) => {
    try {
      setIsLanguageMenuOpen(false);
      if (i18n && typeof i18n.changeLanguage === 'function') {
        await i18n.changeLanguage(lang.code);
        document.documentElement.dir = lang.code === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang.code;
      } else {
        localStorage.setItem('i18nextLng', lang.code);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error changing language:', error);
      localStorage.setItem('i18nextLng', lang.code);
      window.location.reload();
    }
  };

  return (
    <div className={`relative z-30 ${className}`}>
      <button
        onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
          }`}
        aria-label="Change Language"
      >
        <Globe className={`w-5 h-5 transition-colors ${isDarkMode ? 'text-gray-300 hover:text-[#FDB103]' : 'text-gray-600 hover:text-[#FDB103]'
          }`} />
      </button>

      {/* Language Dropdown */}
      {isLanguageMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsLanguageMenuOpen(false)}
          ></div>
          <div className={`absolute ${i18n.language === 'ar' ? 'left-0' : 'right-0'} top-full mt-2 w-48 rounded-xl shadow-2xl border py-2 z-50 overflow-hidden animate-in ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
            }`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 ${i18n.language === 'ar' ? 'text-right' : 'text-left'} transition-colors ${i18n.language === lang.code
                    ? 'bg-primary/10'
                    : 'hover:bg-primary/10'
                  }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className={`text-sm font-semibold flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  {lang.name}
                </span>
                {i18n.language === lang.code && (
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
