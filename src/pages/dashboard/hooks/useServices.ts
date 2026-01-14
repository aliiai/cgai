/**
 * useServices Hook
 * 
 * Hook لإدارة حالة الخدمات والأقسام
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories, getCategory, getServices } from '../../../storeApi/storeApi';
import type { 
  ServiceCategory, 
  CategoryWithSubCategories, 
  Service 
} from '../../../types/types';

type ViewMode = 'categories' | 'subcategories' | 'services';

export const useServices = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<CategoryWithSubCategories | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);

  // تحميل الأقسام عند تحميل الصفحة
  useEffect(() => {
    loadCategories();
    
    // التحقق من query params
    const categoryId = searchParams.get('category_id');
    const subCategoryId = searchParams.get('sub_category_id');
    
    if (subCategoryId) {
      setSelectedSubCategoryId(Number(subCategoryId));
      setSelectedCategoryId(categoryId ? Number(categoryId) : null);
      loadServices(Number(subCategoryId));
      setViewMode('services');
    } else if (categoryId) {
      setSelectedCategoryId(Number(categoryId));
      loadCategory(Number(categoryId));
      setViewMode('subcategories');
    }
  }, []);

  const loadCategories = async () => {
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
  };

  const loadCategory = async (categoryId: number) => {
    setIsLoading(true);
    try {
      const result = await getCategory(categoryId);
      if (result.success && result.data) {
        setCurrentCategory(result.data);
        setSelectedCategoryId(categoryId);
        setViewMode('subcategories');
        setSearchParams({ category_id: categoryId.toString() });
      }
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadServices = async (subCategoryId: number, specializationId?: number) => {
    setIsLoading(true);
    try {
      const result = await getServices({
        sub_category_id: subCategoryId,
        ...(specializationId && { specialization_id: specializationId }),
      });
      if (result.success && result.data) {
        setServices(result.data);
        setSelectedSubCategoryId(subCategoryId);
        setViewMode('services');
        const params: Record<string, string> = { sub_category_id: subCategoryId.toString() };
        if (selectedCategoryId) {
          params.category_id = selectedCategoryId.toString();
        }
        setSearchParams(params);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (viewMode === 'services') {
      // العودة للأقسام الفرعية
      setViewMode('subcategories');
      setServices([]);
      setSelectedSubCategoryId(null);
      setSearchParams(selectedCategoryId ? { category_id: selectedCategoryId.toString() } : {});
    } else if (viewMode === 'subcategories') {
      // العودة للأقسام الرئيسية
      setViewMode('categories');
      setCurrentCategory(null);
      setSelectedCategoryId(null);
      setSearchParams({});
    }
  };

  return {
    // State
    viewMode,
    categories,
    currentCategory,
    services,
    isLoading,
    selectedCategoryId,
    selectedSubCategoryId,
    
    // Actions
    loadCategory,
    loadServices,
    handleBack,
  };
};

