import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  MessageSquare,
  Sparkles,
  ArrowLeft
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

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getCategories();
      if (result.success && result.data) {
        setCategories(result.data);
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
      if (result.success && result.data) {
        setCurrentCategory(result.data);
        setSelectedCategoryId(categoryId);
        setViewMode('subcategories');
        const currentCategoryId = searchParams.get('category_id');
        if (currentCategoryId !== categoryId.toString()) {
          setSearchParams({ category_id: categoryId.toString() });
        }
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
      if (result.success && result.data) {
        setServices(result.data);
        setViewMode('services');
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

  useEffect(() => {
    const currentParams = searchParams.toString();
    
    if (lastSearchParams.current === currentParams && !isInitialLoad.current) {
      return;
    }
    
    lastSearchParams.current = currentParams;
    isInitialLoad.current = false;

    const categoryId = searchParams.get('category_id');
    const subCategoryId = searchParams.get('sub_category_id');
    const view = searchParams.get('view');

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

  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
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
    <div className="pb-8 w-full bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#114C5A] to-[#114C5A]/95 rounded-xl mx-4 sm:mx-6 lg:mx-8 mt-6 mb-8 p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
                {(viewMode === 'subcategories' || viewMode === 'services') && (
                  <button
                    onClick={handleBack}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                  <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {viewMode === 'categories' ? t('dashboard.sections.mainCategories') :
                    viewMode === 'subcategories' ? currentCategory?.name || t('dashboard.sections.subCategories') :
                    viewMode === 'consultations' ? t('dashboard.sections.consultationServices') : 
                    t('dashboard.sections.availableServices')}
                </h1>
              </div>
            <p className="text-sm text-white/80">
                {viewMode === 'categories' ? t('dashboard.sections.servicesDescription') :
                  currentCategory?.description || t('dashboard.sections.chooseSubCategory')}
              </p>
            </div>

              {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder={t('dashboard.sections.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg py-2.5 pr-10 pl-4 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <div className="bg-white border border-[#114C5A]/20 rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#114C5A] mb-2">
                {t('dashboard.sections.lookingForCustom')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('dashboard.sections.customServiceDescription')}
              </p>
            </div>
            <button className="px-6 py-3 bg-[#114C5A] hover:bg-[#114C5A]/90 text-white rounded-lg font-medium text-sm transition-colors shadow-sm hover:shadow-md">
              {t('dashboard.sections.contactUsNow')}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Consultation Button */}
      <button
        onClick={loadConsultations}
        className="fixed bottom-6 left-6 z-50 group flex items-center gap-3 px-5 py-4 bg-[#114C5A] hover:bg-[#114C5A]/90 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        aria-label={t('dashboard.sections.bookConsultation')}
      >
        <div className="relative z-10 flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
        <span className="relative z-10 hidden sm:inline-block">
          {t('dashboard.sections.bookConsultation')}
        </span>
        <MessageSquare className="w-5 h-5 relative z-10 sm:hidden" />
      </button>
    </div>
  );
};

export default Sections;
