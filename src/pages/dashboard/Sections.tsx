import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useThemeStore } from '../../storeApi/store/theme.store';
import {
  ArrowRight,
  Search,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { getCategories, getCategory, getServices, getConsultations } from '../../storeApi/storeApi';
import type {
  ServiceCategory,
  CategoryWithSubCategories,
  ServiceSubCategory,
  Service,
  Consultation
} from '../../types/types';
import LoadingState from '../../components/dashboard/LoadingState';
import EmptyState from '../../components/dashboard/EmptyState';
import CategoriesView from '../../components/dashboard/CategoriesView';
import SubCategoriesView from '../../components/dashboard/SubCategoriesView';
import ServicesView from '../../components/dashboard/ServicesView';
import ConsultationCard from '../../components/dashboard/ConsultationCard';

type ViewMode = 'categories' | 'subcategories' | 'services' | 'consultations';

const Sections = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<CategoryWithSubCategories | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isInitialLoad = useRef(true);
  const lastSearchParams = useRef<string>('');

  // -- Data Fetching Functions --

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getCategories();
      console.log('Sections.tsx - getCategories result:', result);
      if (result.success && result.data) {
        console.log('Sections.tsx - Setting categories:', result.data);
        setCategories(result.data);
      } else {
        console.log('Sections.tsx - No categories data or result not successful');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadCategory = useCallback(async (categoryId: number) => {
    setIsLoading(true);
    try {
      const result = await getCategory(categoryId);
      console.log('Sections.tsx - getCategory result:', result);
      if (result.success && result.data) {
        console.log('Sections.tsx - Setting currentCategory:', result.data);
        console.log('Sections.tsx - Sub categories:', result.data.sub_categories);
        setCurrentCategory(result.data);
        setSelectedCategoryId(categoryId);
        setViewMode('subcategories');
        // تحديث searchParams فقط إذا تغيرت القيمة
        const currentCategoryId = searchParams.get('category_id');
        if (currentCategoryId !== categoryId.toString()) {
          setSearchParams({ category_id: categoryId.toString() });
        }
      } else {
        console.log('Sections.tsx - No category data or result not successful');
      }
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setSearchParams, searchParams]);

  const loadServices = useCallback(async (subCategoryId: number, specializationId?: number) => {
    setIsLoading(true);
    try {
      const result = await getServices({
        sub_category_id: subCategoryId,
        ...(specializationId && { specialization_id: specializationId }),
      });
      console.log('Sections.tsx - getServices result:', result);
      if (result.success && result.data) {
        console.log('Sections.tsx - Setting services:', result.data);
        setServices(result.data);
        setViewMode('services');
        // تحديث searchParams فقط إذا تغيرت القيم
        const params: Record<string, string> = { sub_category_id: subCategoryId.toString() };
        if (selectedCategoryId) {
          params.category_id = selectedCategoryId.toString();
        }
        const currentSubCategoryId = searchParams.get('sub_category_id');
        const currentCategoryId = searchParams.get('category_id');
        if (currentSubCategoryId !== subCategoryId.toString() || 
            (selectedCategoryId && currentCategoryId !== selectedCategoryId.toString())) {
          setSearchParams(params);
        }
      } else {
        console.log('Sections.tsx - No services data or result not successful');
      }
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategoryId, setSearchParams, searchParams]);

  const loadConsultations = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getConsultations();
      if (result.success && result.data) {
        setConsultations(result.data);
        setViewMode('consultations');
        // تحديث searchParams فقط إذا تغيرت القيمة
        const currentView = searchParams.get('view');
        if (currentView !== 'consultations') {
          setSearchParams({ view: 'consultations' });
        }
      }
    } catch (error) {
      console.error('Error loading consultations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setSearchParams, searchParams]);

  // -- Initialization --

  useEffect(() => {
    const currentParams = searchParams.toString();
    
    // منع التحميل المتكرر إذا لم تتغير searchParams
    if (lastSearchParams.current === currentParams && !isInitialLoad.current) {
      return;
    }
    
    lastSearchParams.current = currentParams;
    isInitialLoad.current = false;

    const categoryId = searchParams.get('category_id');
    const subCategoryId = searchParams.get('sub_category_id');
    const view = searchParams.get('view');

    // جلب الأقسام فقط عند التحميل الأول أو عند عدم وجود parameters
    if (!categoryId && !subCategoryId && !view) {
      setViewMode('categories');
      loadCategories();
      return;
    }

    if (subCategoryId) {
      const catId = categoryId ? Number(categoryId) : null;
      if (selectedCategoryId !== catId) {
        setSelectedCategoryId(catId);
      }
      loadServices(Number(subCategoryId));
      if (viewMode !== 'services') {
        setViewMode('services');
      }
    } else if (categoryId) {
      if (selectedCategoryId !== Number(categoryId)) {
        setSelectedCategoryId(Number(categoryId));
      }
      loadCategory(Number(categoryId));
      if (viewMode !== 'subcategories') {
        setViewMode('subcategories');
      }
    } else if (view === 'consultations') {
      setViewMode('consultations');
      loadConsultations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // إعادة جلب البيانات عند تغيير اللغة
  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      console.log('Language changed to:', lng, '- Refetching data...');
      // إعادة جلب البيانات حسب viewMode الحالي
      if (viewMode === 'categories') {
        await loadCategories();
      } else if (viewMode === 'subcategories' && currentCategory) {
        await loadCategory(currentCategory.id);
      } else if (viewMode === 'services') {
        const subCategoryId = searchParams.get('sub_category_id');
        if (subCategoryId) {
          await loadServices(Number(subCategoryId));
        }
      } else if (viewMode === 'consultations') {
        await loadConsultations();
      }
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, viewMode, currentCategory, searchParams, loadCategories, loadCategory, loadServices, loadConsultations]);

  // -- Debug useEffect --
  useEffect(() => {
    console.log('Sections.tsx - viewMode:', viewMode);
    console.log('Sections.tsx - categories state:', categories);
    console.log('Sections.tsx - categories length:', categories.length);
    console.log('Sections.tsx - currentCategory:', currentCategory);
    console.log('Sections.tsx - services state:', services);
    console.log('Sections.tsx - services length:', services.length);
  }, [viewMode, categories, currentCategory, services]);

  // -- Handlers --

  const handleBack = () => {
    if (viewMode === 'services') {
      setViewMode('subcategories');
      setServices([]);
      setSearchParams(selectedCategoryId ? { category_id: selectedCategoryId.toString() } : {});
    } else if (viewMode === 'subcategories') {
      setViewMode('categories');
      setCurrentCategory(null);
      setSelectedCategoryId(null);
      setSearchParams({});
    }
  };

  const handleCategoryClick = (category: ServiceCategory) => {
    loadCategory(category.id);
  };

  const handleSubCategoryClick = (subCategory: ServiceSubCategory) => {
    loadServices(subCategory.id);
  };

  return (
    <div className={`pb-8 w-full ${
      isDarkMode 
        ? 'bg-slate-900' 
        : 'bg-gray-50'
    }`}>
      {/* Compact Header Section */}
      <div className={`sticky top-0 z-10 border-b ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-700' 
          : 'bg-white border-gray-200'
      } shadow-sm`}>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Title and Breadcrumb */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                {(viewMode === 'subcategories' || viewMode === 'services') && (
                  <button
                    onClick={handleBack}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-slate-800 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
                <h1 className={`text-xl sm:text-2xl font-bold truncate ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {viewMode === 'categories' ? t('dashboard.sections.mainCategories') :
                    viewMode === 'subcategories' ? currentCategory?.name || t('dashboard.sections.subCategories') :
                    viewMode === 'consultations' ? t('dashboard.sections.consultationServices') : 
                    t('dashboard.sections.availableServices')}
                </h1>
              </div>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {viewMode === 'categories' ? t('dashboard.sections.servicesDescription') :
                  currentCategory?.description || t('dashboard.sections.chooseSubCategory')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder={t('dashboard.sections.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full border rounded-lg py-2 pr-10 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="py-20">
            <LoadingState />
          </div>
        ) : (
          <div>
            {viewMode === 'categories' && (
              <>
                {categories.length === 0 ? (
                  <EmptyState message={t('dashboard.sections.noCategories')} />
                ) : (
                  <>
                    {(() => {
                      const filteredCategories = categories.filter(c => {
                        if (!searchTerm) return true;
                        if (!c.name) return false;
                        return c.name.toLowerCase().includes(searchTerm.toLowerCase());
                      });
                      
                      if (filteredCategories.length === 0) {
                        return <EmptyState message={searchTerm ? t('dashboard.sections.noCategoriesFound') : t('dashboard.sections.noCategories')} />;
                      }
                      
                      return (
                        <CategoriesView
                          categories={filteredCategories}
                          onCategoryClick={handleCategoryClick}
                        />
                      );
                    })()}
                  </>
                )}
              </>
            )}

            {viewMode === 'subcategories' && currentCategory && (
              <>
                {(() => {
                  const allSubCategories = currentCategory.sub_categories || [];
                  const filteredSubCategories = allSubCategories.filter(sc => {
                    if (!searchTerm) return true;
                    if (!sc.name) return false;
                    return sc.name.toLowerCase().includes(searchTerm.toLowerCase());
                  });
                  
                  if (allSubCategories.length === 0) {
                    return <EmptyState message={t('dashboard.sections.noSubCategories')} />;
                  }
                  
                  if (filteredSubCategories.length === 0) {
                    return <EmptyState message={searchTerm ? t('dashboard.sections.noSubCategoriesFound') : t('dashboard.sections.noSubCategories')} />;
                  }
                  
                  return (
                    <SubCategoriesView
                      subCategories={filteredSubCategories}
                      onSubCategoryClick={handleSubCategoryClick}
                    />
                  );
                })()}
              </>
            )}

            {viewMode === 'services' && (
              <>
                {(() => {
                  const filteredServices = services.filter(s => {
                    if (!searchTerm) return true;
                    if (!s.name) return false;
                    return s.name.toLowerCase().includes(searchTerm.toLowerCase());
                  });
                  
                  if (services.length === 0) {
                    return <EmptyState message={t('dashboard.sections.noServices')} />;
                  }
                  
                  if (filteredServices.length === 0) {
                    return <EmptyState message={searchTerm ? t('dashboard.sections.noServicesFound') : t('dashboard.sections.noServices')} />;
                  }
                  
                  return (
                    <ServicesView
                      services={filteredServices}
                      onOpenConsultations={loadConsultations}
                    />
                  );
                })()}
              </>
            )}

            {viewMode === 'consultations' && (
              <>
                {(() => {
                  const filteredConsultations = consultations.filter(c => {
                    if (!searchTerm) return true;
                    if (!c.name) return false;
                    return c.name.toLowerCase().includes(searchTerm.toLowerCase());
                  });
                  
                  if (consultations.length === 0) {
                    return <EmptyState message={t('dashboard.sections.noConsultations')} />;
                  }
                  
                  if (filteredConsultations.length === 0) {
                    return <EmptyState message={searchTerm ? t('dashboard.sections.noConsultationsFound') : t('dashboard.sections.noConsultations')} />;
                  }
                  
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredConsultations.map((consultation) => (
                        <ConsultationCard key={consultation.id} consultation={consultation} />
                      ))}
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
        <div className={`rounded-xl p-6 sm:p-8 ${
          isDarkMode 
            ? 'bg-slate-800 border border-slate-700' 
            : 'bg-white border border-gray-200'
        } shadow-sm`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className={`text-lg sm:text-xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {t('dashboard.sections.lookingForCustom')}
              </h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t('dashboard.sections.customServiceDescription')}
              </p>
            </div>
            <button className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
              isDarkMode
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}>
              {t('dashboard.sections.contactUsNow')}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Consultation Button */}
      <button
        onClick={loadConsultations}
        className={`fixed bottom-6 left-6 z-50 group flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isDarkMode
            ? 'bg-gradient-to-r from-primary via-primary to-primary-dark text-white shadow-primary/50'
            : 'bg-gradient-to-r from-primary via-primary to-primary-dark text-white shadow-primary/50'
        } animate-pulse hover:animate-none`}
        aria-label={t('dashboard.sections.bookConsultation')}
      >
        {/* Pulsing Ring Effect */}
        <div className="absolute inset-0 rounded-2xl bg-primary/30 animate-ping opacity-75"></div>
        
        {/* Sparkles Icon with Animation */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-md animate-pulse"></div>
          <Sparkles className="w-6 h-6 relative z-10 animate-bounce" />
        </div>
        
        {/* Text */}
        <span className="relative z-10 hidden sm:inline-block">
          {t('dashboard.sections.bookConsultation')}
        </span>
        
        {/* Message Square Icon for mobile */}
        <MessageSquare className="w-5 h-5 relative z-10 sm:hidden" />
        
        {/* Shine Effect on Hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </button>
    </div>
  );
};

export default Sections;
