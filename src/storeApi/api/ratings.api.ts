/**
 * Ratings API
 * 
 * APIs المتعلقة بالتقييمات:
 * - الحصول على التقييمات
 * - إضافة تقييم جديد
 */

import axios from 'axios';
import { API_BASE } from '../config/constants';
import { getAuthToken } from '../utils/auth.utils';
import type { RatingsResponse, GetRatingsParams, CreateRatingRequest, CreateRatingResponse } from '../../types/types';

/**
 * الحصول على التقييمات
 */
export const getRatings = async (params?: GetRatingsParams): Promise<RatingsResponse> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        data: {
          current_page: 1,
          data: [],
          first_page_url: '',
          from: 0,
          last_page: 1,
          last_page_url: '',
          links: [],
          next_page_url: null,
          path: '',
          per_page: 20,
          prev_page_url: null,
          to: 0,
          total: 0,
        },
      };
    }

    const queryParams = new URLSearchParams();
    if (params?.rating) queryParams.append('rating', params.rating.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.search) queryParams.append('search', params.search);

    const response = await axios.get(
      `${API_BASE}/ratings?${queryParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token.trim()}`
        },
        timeout: 30000,
        validateStatus: (status) => status < 500, // لا نعتبر 404 كخطأ
      }
    );

    // إذا كان 404، نرجع empty data بدون طباعة خطأ
    if (response.status === 404) {
      return {
        success: false,
        data: {
          current_page: 1,
          data: [],
          first_page_url: '',
          from: 0,
          last_page: 1,
          last_page_url: '',
          links: [],
          next_page_url: null,
          path: '',
          per_page: 20,
          prev_page_url: null,
          to: 0,
          total: 0,
        },
        message: 'لا توجد تقييمات متاحة',
      };
    }

    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error: any) {
    // لا نطبع خطأ في console إذا كان 404 (endpoint غير موجود)
    if (error.response?.status !== 404) {
      console.error('Get ratings error:', error);
    }
    
    let errorMessage = 'فشل في جلب التقييمات. حاول مرة أخرى.';
    
    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = 'لا توجد تقييمات متاحة';
      } else if (error.response.status === 401) {
        errorMessage = 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.';
      } else if (error.response.status === 403) {
        errorMessage = 'ليس لديك صلاحية للوصول إلى التقييمات.';
      } else {
        errorMessage = error.response.data?.message || errorMessage;
      }
    } else if (error.request) {
      errorMessage = 'لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت.';
    }

    return {
      success: false,
      data: {
        current_page: 1,
        data: [],
        first_page_url: '',
        from: 0,
        last_page: 1,
        last_page_url: '',
        links: [],
        next_page_url: null,
        path: '',
        per_page: 20,
        prev_page_url: null,
        to: 0,
        total: 0,
      },
      message: errorMessage,
    };
  }
};

/**
 * إضافة تقييم جديد
 */
export const createRating = async (ratingData: CreateRatingRequest): Promise<CreateRatingResponse> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً',
      };
    }

    const response = await axios.post(
      `${API_BASE}/customer/ratings`,
      {
        booking_id: ratingData.booking_id,
        rating: ratingData.rating,
        comment: ratingData.comment || '',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token.trim()}`
        },
        timeout: 30000,
      }
    );

    return {
      success: true,
      message: response.data?.message || 'تم إضافة التقييم بنجاح',
      data: response.data?.data,
    };
  } catch (error: any) {
    console.error('Create rating error:', error);
    
    let errorMessage = 'فشل في إضافة التقييم. حاول مرة أخرى.';
    
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.';
      } else if (error.response.status === 400) {
        errorMessage = error.response.data?.message || 'بيانات التقييم غير صحيحة.';
      } else if (error.response.status === 403) {
        errorMessage = 'ليس لديك صلاحية لإضافة تقييم لهذا الحجز.';
      } else if (error.response.status === 409) {
        errorMessage = 'تم تقييم هذا الحجز مسبقاً.';
      } else {
        errorMessage = error.response.data?.message || errorMessage;
      }
    } else if (error.request) {
      errorMessage = 'لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت.';
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

