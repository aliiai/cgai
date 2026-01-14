import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Grid, List, Package, ChevronLeft, ChevronRight, X, Sparkles, TrendingUp, Eye, ShoppingBag } from 'lucide-react';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import ReadyAppCard from '../../components/dashboard/ReadyAppCard';
import { useThemeStore } from '../../storeApi/store/theme.store';
import LoadingState from '../../components/dashboard/LoadingState';
import EmptyState from '../../components/dashboard/EmptyState';
import { getReadyApps, type ReadyApp } from '../../storeApi/api/ready-apps.api';

const ReadyApps = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const [apps, setApps] = useState<ReadyApp[]>([]);
  const [categories, setCategories] = useState<Array<{ id: number; name: string; name_en?: string; slug: string }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<{
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;

  // Debounce search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch apps
  const fetchApps = useCallback(async () => {
    setIsLoading(true);
    try {
      const locale = i18n.language === 'ar' ? 'ar' : 'en';
      const result = await getReadyApps({
        page: currentPage,
        per_page: perPage,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: debouncedSearchTerm || undefined,
        locale,
      });

      if (result.success && result.data) {
        setApps(result.data.apps || []);
        setPagination(result.data.pagination || null);
        if (result.data.categories) {
          setCategories(result.data.categories);
        }
      }
    } catch (error) {
      console.error('Error fetching apps:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedCategory, debouncedSearchTerm, i18n.language]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  // Re-fetch when language changes
  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      console.log('Language changed to:', lng, '- Refetching ready apps...');
      await fetchApps();
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchApps]);

  // Get category name based on current language
  const getCategoryName = (category: { name: string; name_en?: string }) => {
    return i18n.language === 'ar' ? category.name : (category.name_en || category.name);
  };

  // Prepare categories for dropdown
  const categoryOptions = [
    { value: 'all', label: t('dashboard.readyApps.allCategories') || 'جميع الفئات' },
    ...categories.map(cat => ({
      value: cat.slug,
      label: getCategoryName(cat),
    })),
  ];

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate statistics
  const totalApps = pagination?.total || apps.length;
  const popularApps = apps.filter(app => app.is_popular).length;
  const newApps = apps.filter(app => app.is_new).length;

  return (
    <div className={`pb-8 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <DashboardPageHeader
          title={t('dashboard.readyApps.title') || 'التطبيقات والأنظمة الجاهزة'}
          subtitle={t('dashboard.readyApps.subtitle') || 'اختر من مجموعة واسعة من التطبيقات والأنظمة الجاهزة المطورة مسبقاً'}
        />

        {/* Statistics Cards */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`rounded-2xl p-6 border shadow-lg ${
              isDarkMode 
                ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  isDarkMode ? 'bg-primary/20' : 'bg-primary/10'
                }`}>
                  <Package className={`w-6 h-6 ${isDarkMode ? 'text-primary' : 'text-primary'}`} />
                </div>
              </div>
              <div className={`text-3xl font-black mb-1 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {totalApps}
              </div>
              <div className={`text-sm font-semibold ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                {t('dashboard.readyApps.totalApps') || 'إجمالي التطبيقات'}
              </div>
            </div>

            <div className={`rounded-2xl p-6 border shadow-lg ${
              isDarkMode 
                ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  isDarkMode ? 'bg-orange-500/20' : 'bg-orange-500/10'
                }`}>
                  <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
                </div>
              </div>
              <div className={`text-3xl font-black mb-1 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {popularApps}
              </div>
              <div className={`text-sm font-semibold ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                {t('dashboard.readyApps.popular') || 'شائع'}
              </div>
            </div>

            <div className={`rounded-2xl p-6 border shadow-lg ${
              isDarkMode 
                ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  isDarkMode ? 'bg-green-500/20' : 'bg-green-500/10'
                }`}>
                  <Sparkles className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                </div>
              </div>
              <div className={`text-3xl font-black mb-1 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {newApps}
              </div>
              <div className={`text-sm font-semibold ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                {t('dashboard.readyApps.new') || 'جديد'}
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className={`mb-8 p-6 rounded-2xl border shadow-lg ${
          isDarkMode 
            ? 'bg-slate-800/80 backdrop-blur-sm border-slate-700' 
            : 'bg-white/80 backdrop-blur-sm border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative group">
              <Search className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                isDarkMode ? 'text-slate-400 group-focus-within:text-primary' : 'text-gray-400 group-focus-within:text-primary'
              }`} />
              <input
                type="text"
                placeholder={t('dashboard.readyApps.searchPlaceholder') || 'ابحث عن تطبيق...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pr-12 pl-4 py-3.5 rounded-xl border-2 transition-all ${
                  isDarkMode
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-primary focus:bg-slate-700'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:bg-white'
                } focus:outline-none focus:ring-2 focus:ring-primary/20`}
                dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition ${
                    isDarkMode ? 'hover:bg-slate-600' : ''
                  }`}
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative group">
              <Filter className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none z-10 ${
                isDarkMode ? 'text-slate-400 group-focus-within:text-primary' : 'text-gray-400 group-focus-within:text-primary'
              }`} />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className={`appearance-none pr-12 pl-4 py-3.5 rounded-xl border-2 min-w-[200px] transition-all ${
                  isDarkMode
                    ? 'bg-slate-700/50 border-slate-600 text-white focus:border-primary focus:bg-slate-700'
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-primary focus:bg-white'
                } focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer`}
                dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
              >
                {categoryOptions.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className={`flex gap-2 p-1.5 rounded-xl border-2 ${
              isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : isDarkMode
                      ? 'text-slate-300 hover:bg-slate-600'
                      : 'text-gray-600 hover:bg-gray-200'
                }`}
                title={t('dashboard.readyApps.gridView') || 'عرض الشبكة'}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : isDarkMode
                      ? 'text-slate-300 hover:bg-slate-600'
                      : 'text-gray-600 hover:bg-gray-200'
                }`}
                title={t('dashboard.readyApps.listView') || 'عرض القائمة'}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCategory !== 'all') && (
            <div className="mt-4 pt-4 border-t border-gray-200/50 flex flex-wrap gap-2">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                    isDarkMode
                      ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
                      : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                  }`}
                >
                  {t('dashboard.readyApps.search') || 'بحث'}: {searchTerm}
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                    isDarkMode
                      ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
                      : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                  }`}
                >
                  {t('dashboard.readyApps.category') || 'الفئة'}: {categoryOptions.find(c => c.value === selectedCategory)?.label}
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Apps Grid/List */}
            {apps.length > 0 ? (
              <>
                {/* Results Count */}
                <div className={`mb-6 flex items-center justify-between ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    <span className="font-semibold">
                      {pagination 
                        ? `${pagination.from}-${pagination.to} ${t('dashboard.readyApps.of') || 'من'} ${pagination.total} ${t('dashboard.readyApps.apps') || 'تطبيق'}`
                        : `${apps.length} ${t('dashboard.readyApps.apps') || 'تطبيق'}`
                      }
                    </span>
                  </div>
                </div>

                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                }>
                  {apps.map(app => (
                    <ReadyAppCard key={app.id} app={app} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                  <div className={`mt-8 p-6 rounded-2xl border ${
                    isDarkMode 
                      ? 'bg-slate-800/80 backdrop-blur-sm border-slate-700' 
                      : 'bg-white/80 backdrop-blur-sm border-gray-200'
                  }`}>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className={`text-sm font-semibold ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-500'
                      }`}>
                        {t('dashboard.readyApps.showing') || 'عرض'} {pagination.from}-{pagination.to} {t('dashboard.readyApps.of') || 'من'} {pagination.total} {t('dashboard.readyApps.results') || 'نتيجة'}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`p-2.5 rounded-xl transition-all ${
                            currentPage === 1
                              ? 'opacity-50 cursor-not-allowed'
                              : isDarkMode
                                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        <div className="flex gap-1">
                          {[...Array(pagination.last_page)].map((_, index) => {
                            const page = index + 1;
                            // Show first page, last page, current page, and pages around current
                            if (
                              page === 1 ||
                              page === pagination.last_page ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`px-4 py-2 rounded-xl font-bold transition-all min-w-[44px] ${
                                    currentPage === page
                                      ? 'bg-primary text-white shadow-lg scale-105'
                                      : isDarkMode
                                        ? 'bg-slate-700 hover:bg-slate-600 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            } else if (
                              page === currentPage - 2 ||
                              page === currentPage + 2
                            ) {
                              return (
                                <span key={page} className={`px-2 py-2 ${
                                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                                }`}>
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === pagination.last_page}
                          className={`p-2.5 rounded-xl transition-all ${
                            currentPage === pagination.last_page
                              ? 'opacity-50 cursor-not-allowed'
                              : isDarkMode
                                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                icon={Package}
                title={t('dashboard.readyApps.noApps') || 'لا توجد تطبيقات'}
                message={t('dashboard.readyApps.noAppsMessage') || 'لم يتم العثور على تطبيقات تطابق معايير البحث'}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReadyApps;
