/**
 * Ready Apps API
 * 
 * APIs المتعلقة بالتطبيقات الجاهزة:
 * - الحصول على قائمة التطبيقات
 * - الحصول على تفاصيل تطبيق معين
 */

import axios from 'axios';
import { API_BASE, addLocaleToUrl } from '../config/constants';
import { getAuthToken } from '../utils/auth.utils';

export interface ReadyApp {
  id: number;
  name?: string;
  name_en?: string;
  description?: string;
  description_en?: string;
  short_description?: string;
  short_description_en?: string;
  full_description?: string;
  full_description_en?: string;
  price: number | string;
  original_price?: number | string | null;
  currency?: string;
  category_id?: number;
  category?: {
    id: number;
    name?: string;
    name_en?: string;
    slug: string;
    description?: string;
    description_en?: string;
    icon?: string | null;
    is_active?: boolean;
    sort_order?: number;
  };
  main_image?: string | null;
  images?: Array<{
    id?: number;
    url: string;
    type?: 'main' | 'gallery';
    order?: number;
  }> | string[];
  video_url?: string | null;
  video_thumbnail?: string | null;
  screenshots?: Array<{
    id?: number;
    url: string;
    title?: string;
    title_en?: string;
    order?: number;
  }> | string[];
  features?: Array<{
    id?: number;
    title: string;
    title_en?: string;
    icon?: string;
    order?: number;
  }>;
  rating?: number | {
    average: number;
    total_reviews: number;
    breakdown?: {
      [key: string]: number;
    };
  };
  reviews_count?: number;
  views_count?: number;
  purchases_count?: number;
  favorites_count?: number;
  is_popular?: boolean;
  is_new?: boolean;
  is_featured?: boolean;
  is_active?: boolean;
  is_favorite?: boolean;
  tags?: string[] | null;
  specifications?: any;
  discount_percentage?: number | null;
  related_apps?: Array<{
    id: number;
    name: string;
    main_image?: string | null;
    price: number | string;
  }>;
  statistics?: {
    views: number;
    purchases: number;
    favorites: number;
  };
  reviews?: Array<{
    id: number;
    user: {
      id: number;
      name: string;
      avatar?: string;
    };
    rating: number;
    comment: string;
    comment_en?: string;
    created_at: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface GetReadyAppsParams {
  page?: number;
  per_page?: number;
  category?: string;
  search?: string;
  locale?: 'ar' | 'en';
}

export interface GetReadyAppsResponse {
  success: boolean;
  data: {
    apps: ReadyApp[];
    pagination?: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
      from: number;
      to: number;
    };
    categories?: Array<{
      id: number;
      name: string;
      name_en?: string;
      slug: string;
      apps_count?: number;
    }>;
  };
  message?: string;
}

export interface GetReadyAppDetailsResponse {
  success: boolean;
  data: ReadyApp;
  message?: string;
}

export interface PurchaseReadyAppParams {
  notes?: string;
  contact_preference: 'phone' | 'email';
}

export interface PurchaseReadyAppResponse {
  success: boolean;
  data: {
    order_id: number;
    app_id: number;
    app_name: string;
    price: number;
    status: string;
    created_at: string;
  };
  message?: string;
}

export interface ReadyAppOrder {
  id: number;
  app: {
    id: number;
    name?: string;
    name_en?: string;
    main_image?: string | null;
    category?: {
      id: number;
      name?: string;
      name_en?: string;
      slug: string;
    };
  };
  price: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  notes?: string | null;
  contact_preference: 'phone' | 'email';
  created_at: string;
  updated_at: string;
  processed_at?: string | null;
}

export interface GetReadyAppOrdersResponse {
  success: boolean;
  data: {
    orders: ReadyAppOrder[];
    pagination?: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
      from: number;
      to: number;
    };
  };
  message?: string;
}

/**
 * الحصول على قائمة التطبيقات الجاهزة
 */
export const getReadyApps = async (params: GetReadyAppsParams = {}): Promise<GetReadyAppsResponse> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
      headers.Authorization = `Bearer ${token.trim()}`;
    }

    // بناء query parameters
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    
    // إضافة locale
    const locale = params.locale || (localStorage.getItem('i18nextLng')?.startsWith('en') ? 'en' : 'ar');
    queryParams.append('locale', locale);

    const url = `${API_BASE}/customer/ready-apps?${queryParams.toString()}`;
    const response = await axios.get(url, {
      headers,
      timeout: 30000,
    });

    return {
      success: true,
      data: response.data.data || {
        apps: [],
        pagination: undefined,
        categories: [],
      },
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('Get ready apps error:', error);
    return {
      success: false,
      data: {
        apps: [],
        pagination: undefined,
        categories: [],
      },
      message: error.response?.data?.message || 'فشل جلب التطبيقات',
    };
  }
};

/**
 * الحصول على تفاصيل تطبيق معين
 */
export const getReadyAppDetails = async (appId: number): Promise<GetReadyAppDetailsResponse> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
      headers.Authorization = `Bearer ${token.trim()}`;
    }

    const locale = localStorage.getItem('i18nextLng')?.startsWith('en') ? 'en' : 'ar';
    const url = addLocaleToUrl(`${API_BASE}/customer/ready-apps/${appId}`, locale as 'ar' | 'en');
    
    const response = await axios.get(url, {
      headers,
      timeout: 30000,
    });

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('Get ready app details error:', error);
    return {
      success: false,
      data: {} as ReadyApp,
      message: error.response?.data?.message || 'فشل جلب تفاصيل التطبيق',
    };
  }
};

/**
 * طلب شراء تطبيق جاهز
 */
export const purchaseReadyApp = async (
  appId: number,
  params: PurchaseReadyAppParams
): Promise<PurchaseReadyAppResponse> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined') {
      return {
        success: false,
        data: {
          order_id: 0,
          app_id: appId,
          app_name: '',
          price: 0,
          status: 'failed',
          created_at: new Date().toISOString(),
        },
        message: 'يجب تسجيل الدخول أولاً',
      };
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token.trim()}`,
    };

    const locale = localStorage.getItem('i18nextLng')?.startsWith('en') ? 'en' : 'ar';
    const url = addLocaleToUrl(`${API_BASE}/customer/ready-apps/${appId}/purchase`, locale as 'ar' | 'en');
    
    const response = await axios.post(url, params, {
      headers,
      timeout: 30000,
    });

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'تم إنشاء طلب الشراء بنجاح',
    };
  } catch (error: any) {
    console.error('Purchase ready app error:', error);
    return {
      success: false,
      data: {
        order_id: 0,
        app_id: appId,
        app_name: '',
        price: 0,
        status: 'failed',
        created_at: new Date().toISOString(),
      },
      message: error.response?.data?.message || error.response?.data?.error || 'فشل إنشاء طلب الشراء',
    };
  }
};

/**
 * الحصول على قائمة طلبات الشراء
 */
export const getReadyAppOrders = async (params: {
  page?: number;
  per_page?: number;
  status?: string;
  locale?: 'ar' | 'en';
} = {}): Promise<GetReadyAppOrdersResponse> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined') {
      return {
        success: false,
        data: {
          orders: [],
          pagination: undefined,
        },
        message: 'يجب تسجيل الدخول أولاً',
      };
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token.trim()}`,
    };

    // بناء query parameters
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.status) queryParams.append('status', params.status);
    
    // إضافة locale
    const locale = params.locale || (localStorage.getItem('i18nextLng')?.startsWith('en') ? 'en' : 'ar');
    queryParams.append('locale', locale);

    const url = `${API_BASE}/customer/ready-apps/orders?${queryParams.toString()}`;
    
    const response = await axios.get(url, {
      headers,
      timeout: 30000,
    });

    return {
      success: true,
      data: response.data.data || {
        orders: [],
        pagination: undefined,
      },
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('Get ready app orders error:', error);
    return {
      success: false,
      data: {
        orders: [],
        pagination: undefined,
      },
      message: error.response?.data?.message || 'فشل جلب طلبات الشراء',
    };
  }
};

