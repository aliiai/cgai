import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, Sparkles, ChevronLeft, ChevronRight, X, Tag, Star, Heart, Image as ImageIcon, Eye } from 'lucide-react';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import LoadingState from '../../components/dashboard/LoadingState';
import EmptyState from '../../components/dashboard/EmptyState';
import { getAIServices, type AIService, type AIServiceCategory, type AIServiceTag } from '../../storeApi/api/ai-services.api';
import { STORAGE_BASE_URL } from '../../storeApi/config/constants';

const AIServices = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';
  const [services, setServices] = useState<AIService[]>([]);
  const [categories, setCategories] = useState<AIServiceCategory[]>([]);
  const [popularTags, setPopularTags] = useState<AIServiceTag[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [isFreeFilter, setIsFreeFilter] = useState<boolean | null>(null);
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
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch services
  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const locale = i18n.language === 'ar' ? 'ar' : 'en';
      const result = await getAIServices({
        page: currentPage,
        per_page: perPage,
        is_free: isFreeFilter !== null ? isFreeFilter : undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        tag: selectedTag || undefined,
        search: debouncedSearchTerm || undefined,
        locale,
      });

      if (result.success && result.data) {
        setServices(result.data.services || []);
        setPagination(result.data.pagination || null);
        if (result.data.categories) {
          setCategories(result.data.categories);
        }
        if (result.data.popular_tags) {
          setPopularTags(result.data.popular_tags);
        }
      }
    } catch (error) {
      console.error('Error fetching AI services:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedCategory, selectedTag, isFreeFilter, debouncedSearchTerm, i18n.language]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Re-fetch when language changes
  useEffect(() => {
    const handleLanguageChanged = async () => {
      await fetchServices();
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchServices]);

  // Get category name based on current language
  const getCategoryName = (category: { name: string; name_en?: string }) => {
    return i18n.language === 'ar' ? category.name : (category.name_en || category.name);
  };

  // Get service name based on current language
  const getServiceName = (service: AIService) => {
    return i18n.language === 'ar' ? service.name : (service.name_en || service.name);
  };

  // Get service description based on current language
  const getServiceDescription = (service: AIService) => {
    return i18n.language === 'ar' 
      ? service.short_description 
      : (service.short_description_en || service.short_description);
  };

  // Prepare categories for dropdown
  const categoryOptions = [
    { value: 'all', label: t('dashboard.aiServices.allCategories') || 'جميع الفئات' },
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
  const totalServices = pagination?.total || services.length;
  const freeServices = services.filter(s => s.is_free).length;
  const favoriteServices = services.filter(s => s.is_favorite).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <DashboardPageHeader
        title={t('dashboard.aiServices.title') || 'أدوات الذكاء الاصطناعي'}
        subtitle={t('dashboard.aiServices.subtitle') || 'استكشف مجموعة واسعة من أدوات الذكاء الاصطناعي'}
      />

      {/* Statistics Cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#114C5A]/20 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-[#114C5A]/40 transition-all duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#114C5A]/10 rounded-lg flex items-center justify-center text-[#114C5A]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">{t('dashboard.aiServices.totalServices') || 'إجمالي الخدمات'}</p>
                <p className="text-xl font-bold text-[#114C5A]">{totalServices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#FFB200]/20 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-[#FFB200]/40 transition-all duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#FFB200]/10 rounded-lg flex items-center justify-center text-[#FFB200]">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">{t('dashboard.aiServices.freeServices') || 'خدمات مجانية'}</p>
                <p className="text-xl font-bold text-[#FFB200]">{freeServices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-pink-400 transition-all duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center text-pink-500">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">{t('dashboard.aiServices.favorites') || 'المفضلة'}</p>
                <p className="text-xl font-bold text-pink-500">{favoriteServices}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-[#114C5A]/10 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400`} />
            <input
              type="text"
              placeholder={t('dashboard.aiServices.searchPlaceholder') || 'ابحث عن خدمة...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 border border-[#114C5A]/10 rounded-lg bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#114C5A]/20 focus:border-[#114C5A] transition-all text-sm`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition`}
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10`} />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className={`appearance-none ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 rounded-lg border border-[#114C5A]/10 bg-gray-50 text-gray-900 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-[#114C5A]/20 focus:border-[#114C5A] transition-all cursor-pointer text-sm`}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {categoryOptions.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Free Filter */}
          <div className="relative">
            <select
              value={isFreeFilter === null ? 'all' : isFreeFilter ? 'free' : 'paid'}
              onChange={(e) => {
                const value = e.target.value;
                setIsFreeFilter(value === 'all' ? null : value === 'free');
                setCurrentPage(1);
              }}
              className={`appearance-none ${isRTL ? 'pr-4 pl-4' : 'pl-4 pr-4'} py-2.5 rounded-lg border border-[#114C5A]/10 bg-gray-50 text-gray-900 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-[#114C5A]/20 focus:border-[#114C5A] transition-all cursor-pointer text-sm`}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="all">{t('dashboard.aiServices.allServices') || 'جميع الخدمات'}</option>
              <option value="free">{t('dashboard.aiServices.freeOnly') || 'مجانية فقط'}</option>
              <option value="paid">{t('dashboard.aiServices.paidOnly') || 'مدفوعة فقط'}</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-1.5 p-1 rounded-lg border border-[#114C5A]/10 bg-gray-50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#114C5A] text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              title={t('dashboard.aiServices.gridView') || 'عرض الشبكة'}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-all ${
                viewMode === 'list'
                  ? 'bg-[#114C5A] text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              title={t('dashboard.aiServices.listView') || 'عرض القائمة'}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#114C5A]/10">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-3.5 h-3.5 text-[#114C5A]" />
              <span className="text-xs font-semibold text-gray-700">{t('dashboard.aiServices.popularTags') || 'العلامات الشائعة'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {popularTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => {
                    setSelectedTag(selectedTag === tag.slug ? '' : tag.slug);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    selectedTag === tag.slug
                      ? 'bg-[#114C5A] text-white border border-[#114C5A]'
                      : 'bg-[#114C5A]/10 text-[#114C5A] border border-[#114C5A]/20 hover:bg-[#114C5A]/20'
                  }`}
                >
                  {tag.image && (
                    <img src={tag.image} alt={tag.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                  )}
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(searchTerm || selectedCategory !== 'all' || selectedTag || isFreeFilter !== null) && (
          <div className="mt-3 pt-3 border-t border-[#114C5A]/10 flex flex-wrap gap-1.5">
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition bg-[#114C5A]/10 text-[#114C5A] border border-[#114C5A]/20 hover:bg-[#114C5A]/20"
              >
                {t('dashboard.aiServices.search') || 'بحث'}: {searchTerm}
                <X className="w-3 h-3" />
              </button>
            )}
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition bg-[#114C5A]/10 text-[#114C5A] border border-[#114C5A]/20 hover:bg-[#114C5A]/20"
              >
                {t('dashboard.aiServices.category') || 'الفئة'}: {categoryOptions.find(c => c.value === selectedCategory)?.label}
                <X className="w-3 h-3" />
              </button>
            )}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag('')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition bg-[#114C5A]/10 text-[#114C5A] border border-[#114C5A]/20 hover:bg-[#114C5A]/20"
              >
                {t('dashboard.aiServices.tag') || 'العلامة'}: {popularTags.find(t => t.slug === selectedTag)?.name}
                <X className="w-3 h-3" />
              </button>
            )}
            {isFreeFilter !== null && (
              <button
                onClick={() => setIsFreeFilter(null)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition bg-[#114C5A]/10 text-[#114C5A] border border-[#114C5A]/20 hover:bg-[#114C5A]/20"
              >
                {isFreeFilter ? (t('dashboard.aiServices.freeOnly') || 'مجانية فقط') : (t('dashboard.aiServices.paidOnly') || 'مدفوعة فقط')}
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
          {/* Services Grid/List */}
          {services.length > 0 ? (
            <>
              {/* Results Count */}
              <div className="mb-4 flex items-center justify-between text-gray-700">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#114C5A]" />
                  <span className="text-sm font-semibold">
                    {pagination 
                      ? `${pagination.from}-${pagination.to} ${t('dashboard.aiServices.of') || 'من'} ${pagination.total} ${t('dashboard.aiServices.services') || 'خدمة'}`
                      : `${services.length} ${t('dashboard.aiServices.services') || 'خدمة'}`
                    }
                  </span>
                </div>
              </div>

              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
                  : 'space-y-3'
              }>
                {services.map(service => (
                  <div
                    key={service.id}
                    className={`bg-white border border-[#114C5A]/10 rounded-lg shadow-sm hover:shadow-md hover:border-[#114C5A]/20 transition-all duration-200 overflow-hidden ${
                      viewMode === 'list' ? 'flex gap-3 p-3' : ''
                    }`}
                  >
                    {/* Image */}
                    <div className={`relative ${viewMode === 'list' ? 'w-20 h-20 flex-shrink-0' : 'w-full aspect-[4/2]'}`}>
                      {service.main_image ? (
                        <img
                          src={`${STORAGE_BASE_URL}${service.main_image}`}
                          alt={getServiceName(service)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#114C5A]/10 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-[#114C5A]/40" />
                        </div>
                      )}
                      {service.is_free && (
                        <div className="absolute top-1 right-1 bg-[#FFB200] text-white text-[9px] font-bold px-1 py-0.5 rounded">
                          {t('dashboard.aiServices.free') || 'مجاني'}
                        </div>
                      )}
                      {service.is_favorite && (
                        <div className="absolute top-1 left-1 bg-pink-500 text-white p-0.5 rounded-full">
                          <Heart className="w-2.5 h-2.5 fill-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`${viewMode === 'list' ? 'flex-1' : 'p-3'}`}>
                      <div className="flex items-start justify-between mb-1.5">
                        <h3 className="font-bold text-sm text-gray-900 line-clamp-2 flex-1">
                          {getServiceName(service)}
                        </h3>
                        {service.rating > 0 && (
                          <div className="flex items-center gap-0.5 text-[#FFB200] flex-shrink-0 ml-1">
                            <Star className="w-3.5 h-3.5 fill-[#FFB200]" />
                            <span className="text-xs font-semibold">{service.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      {service.category && (
                        <div className="mb-1.5">
                          <span className="text-[10px] px-1.5 py-0.5 bg-[#114C5A]/10 text-[#114C5A] rounded font-semibold">
                            {getCategoryName(service.category)}
                          </span>
                        </div>
                      )}

                      {getServiceDescription(service) && (
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {getServiceDescription(service)}
                        </p>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/ai-services/${service.id}`)}
                          className="flex-1 px-3 py-1.5 bg-[#114C5A] text-white rounded-lg font-semibold hover:bg-[#114C5A]/90 transition-colors text-xs flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {t('dashboard.aiServices.viewDetails') || 'عرض التفاصيل'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.last_page > 1 && (
                <div className="mt-6">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-lg border transition-all duration-300 flex items-center gap-1.5 text-sm ${
                        currentPage === 1
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'border-[#114C5A]/20 bg-white text-[#114C5A] hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                      }`}
                    >
                      <ChevronRight size={16} />
                      <span className="font-semibold">{t('dashboard.pagination.previous') || 'السابق'}</span>
                    </button>
                    
                    <div className="flex items-center gap-1.5">
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
                            className={`w-9 h-9 rounded-lg font-semibold transition-all duration-300 text-sm ${
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
                      className={`px-3 py-2 rounded-lg border transition-all duration-300 flex items-center gap-1.5 text-sm ${
                        currentPage === pagination.last_page
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'border-[#114C5A]/20 bg-white text-[#114C5A] hover:bg-[#114C5A]/5 hover:border-[#114C5A]/40'
                      }`}
                    >
                      <span className="font-semibold">{t('dashboard.pagination.next') || 'التالي'}</span>
                      <ChevronLeft size={16} />
                    </button>
                  </div>

                  {/* Pagination Info */}
                  <div className="text-center text-xs text-gray-600 mt-3">
                    {t('dashboard.aiServices.showing') || 'عرض'} {pagination.from}-{pagination.to} {t('dashboard.aiServices.of') || 'من'} {pagination.total} {t('dashboard.aiServices.results') || 'نتيجة'}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg border border-[#114C5A]/10 shadow-sm p-6">
              <EmptyState
                message={t('dashboard.aiServices.noServicesMessage') || 'لم يتم العثور على خدمات تطابق معايير البحث'}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AIServices;

