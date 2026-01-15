import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Grid, List, Package, ChevronLeft, ChevronRight, X, Sparkles, TrendingUp } from 'lucide-react';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import ReadyAppCard from '../../components/dashboard/ReadyAppCard';
import LoadingState from '../../components/dashboard/LoadingState';
import EmptyState from '../../components/dashboard/EmptyState';
import { getReadyApps, type ReadyApp } from '../../storeApi/api/ready-apps.api';

const ReadyApps = () => {
  const { t, i18n } = useTranslation();
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
    <div className="space-y-6">
      {/* Header */}
      <DashboardPageHeader
        title={t('dashboard.readyApps.title') || 'التطبيقات والأنظمة الجاهزة'}
        subtitle={t('dashboard.readyApps.subtitle') || 'اختر من مجموعة واسعة من التطبيقات والأنظمة الجاهزة المطورة مسبقاً'}
      />

      {/* Statistics Cards - Similar to Dashboard */}
      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#114C5A]/20 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#114C5A]/40 transition-all duration-200 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-[#114C5A]/10 rounded-xl flex items-center justify-center text-[#114C5A] group-hover:bg-[#114C5A]/20 transition-colors">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2 leading-tight">{t('dashboard.readyApps.totalApps') || 'إجمالي التطبيقات'}</p>
            <p className="text-2xl font-bold text-[#114C5A]">{totalApps}</p>
          </div>

          <div className="bg-white border border-[#FFB200]/20 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#FFB200]/40 transition-all duration-200 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-[#FFB200]/10 rounded-xl flex items-center justify-center text-[#FFB200] group-hover:bg-[#FFB200]/20 transition-colors">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2 leading-tight">{t('dashboard.readyApps.popular') || 'شائع'}</p>
            <p className="text-2xl font-bold text-[#FFB200]">{popularApps}</p>
          </div>

          <div className="bg-white border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-green-400 transition-all duration-200 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500 group-hover:bg-green-100 transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2 leading-tight">{t('dashboard.readyApps.new') || 'جديد'}</p>
            <p className="text-2xl font-bold text-green-500">{newApps}</p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative group">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#114C5A] transition-colors" />
            <input
              type="text"
              placeholder={t('dashboard.readyApps.searchPlaceholder') || 'ابحث عن تطبيق...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-[#114C5A]/10 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#114C5A]/20 focus:border-[#114C5A] transition-all"
              dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative group">
            <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#114C5A] transition-colors pointer-events-none z-10" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pr-12 pl-4 py-3 rounded-xl border border-[#114C5A]/10 bg-gray-50 text-gray-900 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-[#114C5A]/20 focus:border-[#114C5A] transition-all cursor-pointer"
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
          <div className="flex gap-2 p-1.5 rounded-xl border border-[#114C5A]/10 bg-gray-50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#114C5A] text-white shadow-md'
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
                  ? 'bg-[#114C5A] text-white shadow-md'
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
          <div className="mt-4 pt-4 border-t border-[#114C5A]/10 flex flex-wrap gap-2">
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition bg-[#114C5A]/10 text-[#114C5A] border border-[#114C5A]/20 hover:bg-[#114C5A]/20"
              >
                {t('dashboard.readyApps.search') || 'بحث'}: {searchTerm}
                <X className="w-3 h-3" />
              </button>
            )}
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition bg-[#114C5A]/10 text-[#114C5A] border border-[#114C5A]/20 hover:bg-[#114C5A]/20"
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
              <div className="mb-6 flex items-center justify-between text-gray-700">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#114C5A]" />
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
                <div className="mt-8">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                        currentPage === 1
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'border-[#114C5A]/20 bg-white text-[#114C5A] hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                      }`}
                    >
                      <ChevronRight size={18} />
                      <span className="font-semibold">{t('dashboard.bookings.previous')}</span>
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
                                : 'border border-[#114C5A]/20 bg-white text-gray-700 hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
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
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'border-[#114C5A]/20 bg-white text-[#114C5A] hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                      }`}
                    >
                      <span className="font-semibold">{t('dashboard.bookings.next')}</span>
                      <ChevronLeft size={18} />
                    </button>
                  </div>

                  {/* Pagination Info */}
                  <div className="text-center text-sm text-gray-600 mt-4">
                    {t('dashboard.readyApps.showing') || 'عرض'} {pagination.from}-{pagination.to} {t('dashboard.readyApps.of') || 'من'} {pagination.total} {t('dashboard.readyApps.results') || 'نتيجة'}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm p-8">
              <EmptyState
                icon={Package}
                title={t('dashboard.readyApps.noApps') || 'لا توجد تطبيقات'}
                message={t('dashboard.readyApps.noAppsMessage') || 'لم يتم العثور على تطبيقات تطابق معايير البحث'}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReadyApps;
