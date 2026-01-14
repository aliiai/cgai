/**
 * Services API
 * 
 * APIs المتعلقة بالخدمات:
 * - الحصول على الأقسام
 * - الحصول على الخدمات
 * - الحصول على الأوقات المتاحة
 */

import axios from 'axios';
import { axiosInstance } from '../config/axios';
import { API_BASE, addLocaleToUrl } from '../config/constants';
import { getAuthToken } from '../utils/auth.utils';
import type {
  GetCategoriesResponse,
  GetCategoryResponse,
  GetServicesResponse,
  GetServicesParams,
  GetAvailableDatesResponse,
  GetConsultationsResponse,
  GetConsultationAvailableDatesResponse,
} from '../../types/types';

/**
 * الحصول على جميع الأقسام (Categories)
 */
export const getCategories = async (): Promise<GetCategoriesResponse> => {
  try {
    const response = await axiosInstance.get('/services/categories');
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error: any) {
    console.error('Get categories error:', error);
    return {
      success: false,
      data: [],
    };
  }
};

/**
 * الحصول على قسم معين مع الأقسام الفرعية
 */
export const getCategory = async (categoryId: number): Promise<GetCategoryResponse> => {
  try {
    const response = await axiosInstance.get(`/services/categories/${categoryId}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Get category error:', error);
    return {
      success: false,
      data: {} as any,
    };
  }
};

/**
 * الحصول على الخدمات
 */
export const getServices = async (params: GetServicesParams): Promise<GetServicesResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.sub_category_id) {
      queryParams.append('sub_category_id', params.sub_category_id.toString());
    }
    if (params.specialization_id) {
      queryParams.append('specialization_id', params.specialization_id.toString());
    }

    const response = await axiosInstance.get(`/services/services?${queryParams.toString()}`);
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error: any) {
    console.error('Get services error:', error);
    return {
      success: false,
      data: [],
    };
  }
};

/**
 * الحصول على الأيام والأوقات المتاحة للحجز
 */
export const getAvailableDates = async (serviceId: number): Promise<GetAvailableDatesResponse> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
      headers.Authorization = `Bearer ${token.trim()}`;
    }

    // استخدام axios مباشرة لأن الـ API على عنوان مختلف
    const url = addLocaleToUrl(`${API_BASE}/customer/bookings/available-dates?service_id=${serviceId}`);
    const response = await axios.get(url, {
      headers,
      timeout: 30000,
    });
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error: any) {
    console.error('Get available dates error:', error);
    return {
      success: false,
      data: [],
    };
  }
};

/**
 * الحصول على الأيام المتاحة (API بديل)
 */
export const getAvailableDatesAPI = async (serviceId: number) => {
  try {
    const url = addLocaleToUrl(`${API_BASE}/customer/services/${serviceId}/available-dates`);
    const res = await axios.get(url);
    return { success: true, data: res.data.data };
  } catch (error) {
    return { success: false };
  }
};

/**
 * الحصول على جميع الخدمات الاستشارية
 */
export const getConsultations = async (): Promise<GetConsultationsResponse> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
      headers.Authorization = `Bearer ${token.trim()}`;
    }

    // استخدام API_BASE مباشرة مثل باقي الـ APIs
    const url = addLocaleToUrl(`${API_BASE}/consultations`);
    const response = await axios.get(url, {
      headers,
      validateStatus: (status) => status < 500, // قبول 404 كحالة صالحة
      timeout: 30000,
    });
    
    // إذا كان 404، نعيد مصفوفة فارغة
    if (response.status === 404) {
      return {
        success: true,
        data: [],
      };
    }
    
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error: any) {
    // إذا كان الخطأ 404، لا نطبع خطأ في console
    if (error.response?.status === 404) {
      return {
        success: true,
        data: [],
      };
    }
    console.error('Get consultations error:', error);
    return {
      success: false,
      data: [],
    };
  }
};

/**
 * الحصول على الأيام والأوقات المتاحة للخدمات الاستشارية
 */
export const getConsultationAvailableDates = async (consultationId: number): Promise<GetConsultationAvailableDatesResponse> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
      headers.Authorization = `Bearer ${token.trim()}`;
    }

    const url = addLocaleToUrl(`${API_BASE}/customer/bookings/consultation/available-dates?consultation_id=${consultationId}`);
    const response = await axios.get(url, {
      headers,
      timeout: 30000,
    });
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error: any) {
    console.error('Get consultation available dates error:', error);
    return {
      success: false,
      data: [],
    };
  }
};

