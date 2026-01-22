import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutGrid, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../storeApi/storeApi';
import { getAllServices, type ServiceItem } from '../storeApi/api/home.api';
import { getCategory } from '../storeApi/api/services.api';
import { STORAGE_BASE_URL } from '../storeApi/config/constants';
import { localizeField } from '../utils/localization';
import type { CategoryWithSubCategories } from '../types/types';

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  subCategory: string;
  price: number;
}

const DiscoverServices = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDarkMode } = useThemeStore();
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryWithSubCategories | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get category_id from URL
  const categoryId = useMemo(() => {
    const id = searchParams.get('category_id');
    return id ? parseInt(id) : null;
  }, [searchParams]);

  // Get sub-categories from category data for filters - only those with services
  const subCategories = useMemo(() => {
    if (!categoryData?.sub_categories) return [];
    
    const currentLang = i18n.language === 'ar' ? 'ar' : 'en';
    
    // Get unique sub_category_ids from services
    const subCategoryIdsWithServices = new Set<number>();
    services.forEach(service => {
      if (service.sub_category?.id) {
        subCategoryIdsWithServices.add(service.sub_category.id);
      }
    });
    
    // Filter sub-categories that have services
    return categoryData.sub_categories
      .filter(subCat => subCat.is_active && subCategoryIdsWithServices.has(subCat.id))
      .map(subCat => {
        const name = localizeField(
          (subCat as any).name,
          (subCat as any).name_en,
          { preferredLanguage: currentLang }
        ) || subCat.slug;
        
        return {
          id: subCat.id,
          name,
        };
      });
  }, [categoryData, services, i18n.language]);

  // Fetch category data to get sub-categories
  const fetchCategory = useCallback(async (catId: number) => {
    try {
      const response = await getCategory(catId);
      if (response.success && response.data) {
        setCategoryData(response.data);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const locale = i18n.language === 'ar' ? 'ar' : 'en';
      const response = await getAllServices(locale);
      
      if (response.success && response.data) {
        // Filter only active services
        let activeServices = response.data.filter(service => service.is_active);
        
        // Filter by category_id if provided
        if (categoryId) {
          // Only show services that belong to sub-categories of this category
          activeServices = activeServices.filter(service => 
            service.sub_category?.category_id === categoryId
          );
        }
        
        setServices(activeServices);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  }, [i18n.language, categoryId]);

  useEffect(() => {
    if (categoryId) {
      fetchCategory(categoryId);
    }
  }, [categoryId, fetchCategory]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Refetch when language changes
  useEffect(() => {
    const handleLanguageChanged = async () => {
      await fetchServices();
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchServices]);

  // Convert API data to Service format
  const convertToService = useCallback((item: ServiceItem): Service => {
    const currentLang = i18n.language === 'ar' ? 'ar' : 'en';
    
    // Use service image, or category image, or placeholder
    let imageUrl = 'https://via.placeholder.com/800x400?text=No+Image';
    
    if (item.image) {
      // If image is already a full URL, use it directly, otherwise prepend STORAGE_BASE_URL
      imageUrl = item.image.startsWith('http') 
        ? item.image 
        : `${STORAGE_BASE_URL}${item.image}`;
    } else if (item.sub_category?.category?.image) {
      imageUrl = item.sub_category.category.image.startsWith('http')
        ? item.sub_category.category.image
        : `${STORAGE_BASE_URL}${item.sub_category.category.image}`;
    }
    
    const title = localizeField(
      (item as any).name,
      item.name_en,
      { preferredLanguage: currentLang }
    ) || item.slug;
    
    const description = localizeField(
      (item as any).description,
      item.description_en,
      { preferredLanguage: currentLang }
    );
    
    const categoryName = item.sub_category?.category
      ? localizeField(
          (item.sub_category.category as any).name,
          item.sub_category.category.name_en,
          { preferredLanguage: currentLang }
        )
      : t('discoverServices.notSpecified');
    
    return {
      id: item.id,
      title,
      description,
      image: imageUrl,
      category: categoryName,
      subCategory: item.sub_category
        ? localizeField(
            (item.sub_category as any).name,
            item.sub_category.name_en,
            { preferredLanguage: currentLang }
          ) || item.sub_category.slug
        : 'غير محدد',
      price: item.price || 0,
    };
  }, [i18n.language]);

  // Get filtered items
  const getFilteredItems = useMemo((): Service[] => {
    const convertedServices = services.map(convertToService);
    
    if (activeFilter === 'all') {
      return convertedServices;
    } else {
      const filterId = parseInt(activeFilter);
      return convertedServices.filter(service => {
        const serviceItem = services.find(s => s.id === service.id);
        return serviceItem?.sub_category?.id === filterId;
      });
    }
  }, [services, activeFilter, convertToService]);

  const filteredServices = getFilteredItems;

  // Build filters array
  const filters = useMemo(() => {
    const filterArray = [
      { id: 'all', label: t('discoverServices.all'), icon: LayoutGrid },
    ];
    
    subCategories.forEach(subCat => {
      filterArray.push({
        id: subCat.id.toString(),
        label: subCat.name,
        icon: LayoutGrid,
      });
    });
    
    return filterArray;
  }, [subCategories, t]);

  return (
    <div className={`news-page min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        {/* Main Title */}
        <h1 className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 text-center transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('discoverServices.title')}
        </h1>

        {/* Subtitle */}
        <p className={`text-base md:text-lg lg:text-xl mb-8 text-center transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t('discoverServices.subtitle')}
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

        {/* Filters Section */}
        {subCategories.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12" dir={isRTL ? 'rtl' : 'ltr'}>
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300 border-2 font-bold text-lg
                    ${isActive
                      ? 'bg-[#FFB200] text-white border-[#FFB200] shadow-lg shadow-orange-200/50 scale-105'
                      : isDarkMode
                        ? 'bg-slate-800 text-[#FFB200] border-[#FFB200] hover:bg-[#FFB200] hover:text-white hover:shadow-lg hover:shadow-orange-200/50'
                        : 'bg-white text-[#FFB200] border-[#FFB200] hover:bg-[#FFB200] hover:text-white hover:shadow-lg hover:shadow-orange-200/50'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        ) : categoryId && (
          <div className="text-center py-8">
            <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t('discoverServices.loadingSubCategories')}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className={`w-12 h-12 animate-spin ${isDarkMode ? 'text-[#FFB200]' : 'text-[#FFB200]'}`} />
          </div>
        ) : filteredServices.length > 0 ? (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredServices.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
              >
                {/* Image Section */}
                <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                </div>

                {/* Content Section */}
                <div className={`p-6 flex-1 flex flex-col justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                  <h3 className={`text-xl md:text-2xl font-bold mb-3 text-center transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm md:text-base leading-relaxed text-center mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.description || t('discoverServices.noDescription')}
                  </p>
                  {item.price > 0 && (
                    <div className={`text-center mb-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      <span className="text-lg font-semibold">{item.price}</span>
                      <span className={`text-sm mr-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t('discoverServices.perHour')}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => navigate('/register')}
                    className="mt-auto w-full py-2.5 px-4 bg-[#FFB200] hover:bg-[#FDB103] text-black font-semibold rounded-lg transition-colors duration-300"
                  >
                    {t('discoverServices.bookService')}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className={`text-lg transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('discoverServices.noServices')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverServices;

