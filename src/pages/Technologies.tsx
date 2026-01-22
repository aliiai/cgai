import { Search, Grid3x3, ChevronDown, ChevronLeft, ChevronRight, ExternalLink, Bookmark, Loader2 } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import chatgptLogo from '../assets/images/chatgpt-logo.png';
import claudeLogo from '../assets/images/cloud-logo.png';
import grokLogo from '../assets/images/grok-logo.png';
import { getAIServices, type AIService, type AIServicesCategory, type Pagination } from '../storeApi/api/home.api';
import { useThemeStore } from '../storeApi/store/theme.store';
import { STORAGE_BASE_URL } from '../storeApi/config/constants';
import { localizeField } from '../utils/localization';

const Technologies = () => {
  const { isDarkMode } = useThemeStore();
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPopularSection, setSelectedPopularSection] = useState<string | null>(null);

  // API Data State
  const [services, setServices] = useState<AIService[]>([]);
  const [categories, setCategories] = useState<AIServicesCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const itemsPerPage = 12;

  // Debounced search term for API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Fetch AI Services
  const fetchServices = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const locale = i18n.language === 'ar' ? 'ar' : 'en';
      const params = {
        page: page,
        per_page: itemsPerPage,
        is_free: isFree ? true : (isPaid ? false : undefined),
        search: debouncedSearchTerm || undefined,
        category: selectedCategory || undefined,
        locale
      };
      const response = await getAIServices(params);
      if (response.success && response.data) {
        setServices(response.data.services);
        setCategories(response.data.categories);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || t('technologies.error.loadingError'));
      }
    } catch (err) {
      setError(t('technologies.error.connectionError'));
    } finally {
      setLoading(false);
    }
  }, [isFree, isPaid, debouncedSearchTerm, selectedCategory, i18n.language, t, itemsPerPage]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Initial fetch and fetch when filters change
  useEffect(() => {
    fetchServices(1);
    setCurrentPage(1);
  }, [fetchServices]);

  // إعادة جلب البيانات عند تغيير اللغة
  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      console.log('Language changed to:', lng, '- Refetching technologies data...');
      await fetchServices(1);
      setCurrentPage(1);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchServices]);

  // Filter services based on selectedTechnology (client-side filtering for popular tech only)
  const filteredServices = useMemo(() => {
    if (!selectedTechnology) {
      return services;
    }
    return services.filter(service => {
      return service.name.toLowerCase().includes(selectedTechnology.toLowerCase());
    });
  }, [services, selectedTechnology]);

  // Reset to page 1 when filters change (that require API call)
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [isPaid, isFree, selectedCategory]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.last_page) {
      setCurrentPage(page);
      fetchServices(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`technologies-page min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        {/* Main Title */}
        <h1 className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 text-center transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('technologies.title')}
        </h1>

        {/* Subtitle */}
        <p className={`text-base md:text-lg lg:text-xl mb-8 text-center transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('technologies.subtitle')}
        </p>

        {/* Gradient Line */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div
            className="h-[7px] rounded-[50%]"
            style={{
              background: 'linear-gradient(to right, #FFB200 0%, #FFB200 50%, rgba(253, 177, 3, 0.3) 100%)'
            }}
          ></div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FDB103]" />
            <input
              type="text"
              placeholder={t('technologies.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pr-12 pl-4 py-4 rounded-full border transition-all text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-[#FDB103]/20 ${isDarkMode
                ? 'bg-slate-800 border-slate-700 text-white placeholder:text-gray-500'
                : 'bg-white border-[#FFB200] text-gray-900 placeholder:text-gray-400'
                }`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto pb-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-6 items-start justify-between">

          {/* Popular Categories */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="flex items-center gap-2 mb-3">
              <Grid3x3 className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`} />
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{t('technologies.popularCategories')}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {[t('technologies.categories.images'), t('technologies.categories.design'), t('technologies.categories.chat')].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedPopularSection(selectedPopularSection === cat ? null : cat)}
                  className={`px-4 py-2 rounded-full border transition-all flex items-center gap-1 text-sm ${selectedPopularSection === cat
                    ? 'bg-[#114C5A] text-white border-[#114C5A]'
                    : isDarkMode
                      ? 'border-slate-700 text-gray-300 hover:border-[#114C5A]'
                      : 'border-[#A8D5E2] text-gray-700 hover:border-[#114C5A]'
                    }`}
                >
                  <span>{cat}</span>
                  <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Center Filters */}
          <div className="flex flex-1 items-center justify-center gap-4 lg:gap-6 w-full">
            {/* Paid Filter */}
            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={isPaid}
                onChange={(e) => {
                  setIsPaid(e.target.checked);
                  if (e.target.checked) setIsFree(false);
                }}
                className="w-6 h-6 rounded border border-[#FFE5B4] accent-[#FFB200] cursor-pointer"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('technologies.paid')}</span>
            </label>

            {/* Category Dropdown */}
            <div className="relative flex-1 max-w-xs">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full px-4 py-3 pr-10 pl-4 rounded-full border appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FFB200]/20 text-sm transition-colors ${isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-gray-300'
                  : 'bg-white border-[#FFE5B4] text-gray-600'
                  }`}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <option value="">{t('technologies.allCategories')}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>

            {/* Free Filter */}
            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('technologies.free')}</span>
              <input
                type="checkbox"
                checked={isFree}
                onChange={(e) => {
                  setIsFree(e.target.checked);
                  if (e.target.checked) setIsPaid(false);
                }}
                className="w-6 h-6 rounded border border-[#FFE5B4] accent-[#FFB200] cursor-pointer"
              />
            </label>
          </div>

          {/* Popular Tech */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="flex items-center gap-2 mb-3">
              <Grid3x3 className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`} />
              <h3 className={`text-base font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{t('technologies.popularTechnologies')}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Grok', id: 'grok', logo: grokLogo },
                { name: 'ChatGPT', id: 'chatgpt', logo: chatgptLogo },
                { name: 'Claude', id: 'claude', logo: claudeLogo }
              ].map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => setSelectedTechnology(selectedTechnology === tech.id ? null : tech.id)}
                  className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-2 ${selectedTechnology === tech.id
                    ? 'border-[#FFB200] bg-[#FFB200]/10 text-gray-900'
                    : isDarkMode
                      ? 'border-slate-700 text-gray-300'
                      : 'border-[#FFE5B4] text-gray-700'
                    }`}
                >
                  <img src={tech.logo} alt={tech.name} className="w-5 h-5 object-contain" />
                  <span className="text-sm font-medium">{tech.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-[#FFB200] animate-spin" />
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{t('technologies.loading')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#FFB200] text-black rounded-full font-bold"
            >
              {t('technologies.retry')}
            </button>
          </div>
        ) : filteredServices.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`group relative rounded-[2.5rem] pb-8 border overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isDarkMode
                  ? 'bg-slate-800 border-slate-700 hover:border-[#FDB103]/50'
                  : 'bg-white border-[#1B4D58]/10 hover:border-[#1B4D58]'
                  }`}
              >
                {/* Save Button */}
                <button className={`absolute top-6 left-6 z-10 p-2.5 rounded-2xl transition-all shadow-sm ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-400' : 'bg-[#bae6fd]/50 hover:bg-[#bae6fd] text-[#1B4D58]'
                  }`}>
                  <Bookmark className="w-5 h-5" />
                </button>

                {/* Logo/Image Area */}
                <div className="relative h-64 mb-4 flex items-center justify-center p-6 bg-gradient-to-b from-transparent to-black/5">
                  <img
                    src={service.main_image.startsWith('http') ? service.main_image : `${STORAGE_BASE_URL}${service.main_image}`}
                    alt={service.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content Area */}
                <div className="px-8 text-right space-y-4">
                  <div className="flex items-center justify-start gap-3">
                    <h3 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {localizeField(service.name, (service as any).name_en, { preferredLanguage: i18n.language === 'ar' ? 'ar' : 'en' })}
                    </h3>
                    {service.website_url && (
                      <a
                        href={service.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-transform hover:scale-110"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className={`w-6 h-6 ${isDarkMode ? 'text-[#FDB103]' : 'text-[#1B4D58]'}`} />
                      </a>
                    )}
                  </div>

                  <p className={`text-sm leading-relaxed min-h-[3rem] line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                    {localizeField(service.short_description, (service as any).short_description_en, { preferredLanguage: i18n.language === 'ar' ? 'ar' : 'en' })}
                  </p>

                  {/* Visit Website Button */}
                  {service.website_url ? (
                    <a
                      href={service.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-colors text-sm ${
                        isDarkMode
                          ? 'bg-[#FFB200] text-gray-900 hover:bg-[#FFB200]/90'
                          : 'bg-[#FFB200] text-gray-900 hover:bg-[#FFB200]/90'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t('technologies.visitWebsite') || 'زيارة الموقع'}
                    </a>
                  ) : (
                    <button
                      disabled
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-colors text-sm opacity-50 cursor-not-allowed ${
                        isDarkMode
                          ? 'bg-[#FFB200] text-gray-900'
                          : 'bg-[#FFB200] text-gray-900'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t('technologies.visitWebsite') || 'زيارة الموقع'}
                    </button>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100/10">
                    <span className="bg-[#1B4D58] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm">
                      {localizeField(service.category.name, (service.category as any).name_en, { preferredLanguage: i18n.language === 'ar' ? 'ar' : 'en' })}
                    </span>
                    {service.is_free && (
                      <span className="text-[#FFB200] text-xs font-bold">{t('technologies.free')}</span>
                    )}
                  </div>
                </div>
              </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.total > 0 && (
              <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t transition-colors duration-300 ${
                isDarkMode ? 'border-slate-700' : 'border-[#114C5A]/10'
              }`}>
                <div className={`text-xs sm:text-sm font-semibold text-center sm:text-right transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t('dashboard.activity.showing', { from: pagination.from, to: pagination.to, total: pagination.total }) || `عرض ${pagination.from}-${pagination.to} من ${pagination.total}`}
                </div>
                {pagination.last_page > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
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
                      {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                      <span className="font-semibold">{t('dashboard.activity.previous') || 'السابق'}</span>
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                        let pageNum;
                        if (pagination.last_page <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= pagination.last_page - 2) {
                          pageNum = pagination.last_page - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                              currentPage === pageNum
                                ? 'bg-[#114C5A] text-white shadow-md'
                                : isDarkMode
                                  ? 'border border-slate-600 bg-slate-700 text-gray-300 hover:bg-slate-600 hover:border-slate-500'
                                  : 'border border-[#114C5A]/20 bg-white text-[#114C5A] hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.last_page}
                      className={`px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                        currentPage === pagination.last_page
                          ? isDarkMode
                            ? 'border-slate-700 bg-slate-700 text-gray-500 cursor-not-allowed'
                            : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : isDarkMode
                            ? 'border-slate-600 bg-slate-700 text-white hover:bg-slate-600 hover:border-slate-500'
                            : 'border-[#114C5A]/20 bg-white text-[#114C5A] hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                      }`}
                    >
                      <span className="font-semibold">{t('dashboard.activity.next') || 'التالي'}</span>
                      {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('technologies.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Technologies;
