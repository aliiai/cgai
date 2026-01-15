/**
 * AI Services API
 * 
 * APIs المتعلقة بخدمات الذكاء الاصطناعي
 */

import axios from 'axios';
import { API_BASE, addLocaleToUrl } from '../config/constants';
import { getAuthToken } from '../utils/auth.utils';

export interface AIService {
  id: number;
  name: string;
  name_en?: string;
  short_description?: string;
  short_description_en?: string;
  main_image?: string | null;
  category?: {
    id: number;
    name: string;
    name_en?: string;
    slug: string;
  };
  is_free: boolean;
  is_favorite: boolean;
  rating: number;
}

export interface AIServiceImage {
  id: number;
  ai_service_id: number;
  url: string;
  type: 'main' | 'gallery';
  order: number;
  created_at: string;
  updated_at: string;
}

export interface AIServiceScreenshot {
  id: number;
  ai_service_id: number;
  url: string;
  title?: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface AIServiceFeature {
  id: number;
  title: string;
  title_en?: string;
  icon?: string;
  order: number;
}

export interface AIServiceRating {
  average: number;
  total_reviews: number;
  breakdown: {
    [key: string]: number;
  };
}

export interface AIServiceDetails {
  id: number;
  category_id: number;
  name: string;
  name_en?: string;
  slug: string;
  short_description?: string;
  short_description_en?: string;
  description?: string;
  description_en?: string;
  full_description?: string;
  full_description_en?: string;
  price: string | number;
  is_free: boolean;
  original_price?: string | number | null;
  currency?: string;
  video_url?: string | null;
  rating: AIServiceRating | number;
  reviews_count: number;
  views_count: number;
  purchases_count: number;
  favorites_count: number;
  is_popular: boolean;
  is_new: boolean;
  is_featured: boolean;
  is_latest: boolean;
  is_best_of_month: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    name_en?: string;
    slug: string;
    description?: string;
    description_en?: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
  };
  images: AIServiceImage[];
  features: AIServiceFeature[];
  screenshots: AIServiceScreenshot[];
  main_image?: string | null;
  discount_percentage?: number | null;
  type: 'free' | 'paid';
  is_favorite: boolean;
  related_services?: Array<{
    id: number;
    name: string;
    main_image?: string | null;
    price: number | string;
    is_free: boolean;
    type: 'free' | 'paid';
  }>;
  statistics?: {
    views: number;
    purchases: number;
    favorites: number;
  };
}

export interface AIServiceCategory {
  id: number;
  name: string;
  name_en?: string;
  slug: string;
  description?: string;
  description_en?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  active_services_count: number;
}

export interface AIServiceTag {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
}

export interface AIServicesResponse {
  services: AIService[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  categories: AIServiceCategory[];
  popular_tags: AIServiceTag[];
}

export interface GetAIServicesParams {
  page?: number;
  per_page?: number;
  is_free?: boolean;
  category?: string;
  search?: string;
  tag?: string;
  locale?: string;
}

/**
 * الحصول على قائمة خدمات الذكاء الاصطناعي
 */
export const getAIServices = async (
  params: GetAIServicesParams = {}
): Promise<{ success: boolean; message?: string; data?: AIServicesResponse }> => {
  try {
    const token = getAuthToken();
    if (!token || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const locale = params.locale || 'ar';
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.is_free !== undefined) queryParams.append('is_free', params.is_free.toString());
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    if (params.tag) queryParams.append('tag', params.tag);
    queryParams.append('locale', locale);

    const url = addLocaleToUrl(`${API_BASE}/customer/ai-services?${queryParams.toString()}`, locale);

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.trim()}`
      },
      timeout: 30000,
    });

    if (response.data.success && response.data.data) {
      return {
        success: true,
        message: response.data.message || 'تم تحميل خدمات الذكاء الاصطناعي بنجاح',
        data: response.data.data,
      };
    }

    return {
      success: false,
      message: response.data.message || 'فشل في تحميل خدمات الذكاء الاصطناعي',
    };
  } catch (error: any) {
    console.error('Get AI services error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'حدث خطأ أثناء تحميل خدمات الذكاء الاصطناعي',
    };
  }
};

/**
 * الحصول على تفاصيل خدمة ذكاء اصطناعي معينة
 */
export const getAIServiceDetails = async (
  serviceId: number,
  locale?: string
): Promise<{ success: boolean; message?: string; data?: AIServiceDetails }> => {
  try {
    const token = getAuthToken();
    if (!token || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const currentLocale = locale || 'ar';
    const url = addLocaleToUrl(`${API_BASE}/customer/ai-services/${serviceId}`, currentLocale);

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.trim()}`
      },
      timeout: 30000,
    });

    if (response.data.success && response.data.data) {
      return {
        success: true,
        message: response.data.message || 'تم تحميل تفاصيل الخدمة بنجاح',
        data: response.data.data,
      };
    }

    return {
      success: false,
      message: response.data.message || 'فشل في تحميل تفاصيل الخدمة',
    };
  } catch (error: any) {
    console.error('Get AI service details error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'حدث خطأ أثناء تحميل تفاصيل الخدمة',
    };
  }
};

export interface PurchaseAIServiceParams {
  notes?: string;
  contact_preference: 'phone' | 'email';
}

export interface PurchaseAIServiceResponse {
  order_id: number;
  service_id: number;
  service_name: string;
  price: number;
  status: string;
  created_at: string;
}

/**
 * طلب شراء خدمة ذكاء اصطناعي
 */
export const purchaseAIService = async (
  serviceId: number,
  params: PurchaseAIServiceParams
): Promise<{ success: boolean; message?: string; data?: PurchaseAIServiceResponse }> => {
  try {
    const token = getAuthToken();
    if (!token || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const locale = localStorage.getItem('i18nextLng')?.startsWith('en') ? 'en' : 'ar';
    const url = addLocaleToUrl(`${API_BASE}/customer/ai-services/${serviceId}/purchase`, locale as 'ar' | 'en');

    const response = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.trim()}`
      },
      timeout: 30000,
    });

    if (response.data.success && response.data.data) {
      return {
        success: true,
        message: response.data.message || 'تم إنشاء طلب الخدمة بنجاح',
        data: response.data.data,
      };
    }

    return {
      success: false,
      message: response.data.message || 'فشل إنشاء طلب الخدمة',
    };
  } catch (error: any) {
    console.error('Purchase AI service error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'حدث خطأ أثناء إنشاء طلب الخدمة',
    };
  }
};

