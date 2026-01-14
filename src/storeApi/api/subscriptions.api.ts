/**
 * Subscriptions API
 * 
 * APIs المتعلقة بالاشتراكات:
 * - عرض الباقات المتاحة (Public)
 * - طلب الاشتراك
 * - عرض الاشتراك النشط
 * - عرض طلبات الاشتراك
 */

import axios from 'axios';
import { API_BASE, addLocaleToUrl } from '../config/constants';
import { getAuthToken } from '../utils/auth.utils';
import type {
  SubscriptionsResponse,
  Subscription,
  SubscriptionRequest,
  SubscriptionRequestResponse,
  ActiveSubscription,
  ActiveSubscriptionResponse,
  SubscriptionRequestsResponse,
  CreateSubscriptionRequestRequest,
} from '../../types/types';

/**
 * الحصول على جميع الباقات المتاحة (Public - بدون مصادقة)
 */
export const getPublicSubscriptions = async (): Promise<SubscriptionsResponse> => {
  try {
    const url = addLocaleToUrl(`${API_BASE}/public/subscriptions`);
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error: any) {
    console.error('Get public subscriptions error:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'فشل في جلب الباقات',
    };
  }
};

/**
 * الحصول على تفاصيل باقة معينة (Public - بدون مصادقة)
 */
export const getPublicSubscription = async (subscriptionId: number): Promise<{ success: boolean; data?: Subscription; message?: string }> => {
  try {
    const url = addLocaleToUrl(`${API_BASE}/public/subscriptions/${subscriptionId}`);
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Get public subscription error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب تفاصيل الباقة',
    };
  }
};

/**
 * الحصول على الباقات مع معلومات المستخدم (يتطلب مصادقة)
 */
export const getSubscriptions = async (): Promise<{
  success: boolean;
  data?: {
    subscriptions: Subscription[];
    active_subscription: ActiveSubscription | null;
    pending_request: SubscriptionRequest | null;
  };
  message?: string;
}> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const url = addLocaleToUrl(`${API_BASE}/subscriptions`);
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.trim()}`
      },
      timeout: 30000,
    });

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Get subscriptions error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب الباقات',
    };
  }
};

/**
 * الحصول على الاشتراك النشط (يتطلب مصادقة)
 */
export const getActiveSubscription = async (): Promise<ActiveSubscriptionResponse> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const url = addLocaleToUrl(`${API_BASE}/subscriptions/active`);
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.trim()}`
      },
      timeout: 30000,
    });

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    // 404 هو متوقع عندما لا يوجد اشتراك نشط، لا نطبع خطأ في console
    if (error.response?.status === 404) {
      return {
        success: false,
        message: 'لا يوجد اشتراك نشط',
      };
    }
    // فقط نطبع الأخطاء الأخرى (غير 404)
    console.error('Get active subscription error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب الاشتراك النشط',
    };
  }
};

/**
 * الحصول على طلبات الاشتراك (يتطلب مصادقة)
 */
export const getSubscriptionRequests = async (): Promise<SubscriptionRequestsResponse> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        data: [],
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const url = addLocaleToUrl(`${API_BASE}/subscriptions/requests`);
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.trim()}`
      },
      timeout: 30000,
    });

    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error: any) {
    console.error('Get subscription requests error:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'فشل في جلب طلبات الاشتراك',
    };
  }
};

/**
 * إنشاء طلب اشتراك جديد (يتطلب مصادقة)
 */
export const createSubscriptionRequest = async (
  requestData: CreateSubscriptionRequestRequest
): Promise<SubscriptionRequestResponse> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const formData = new FormData();
    formData.append('subscription_id', requestData.subscription_id.toString());
    formData.append('payment_proof', requestData.payment_proof);

    const url = addLocaleToUrl(`${API_BASE}/subscriptions`);
    const response = await axios.post(url, formData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.trim()}`
        // لا تضيف Content-Type - سيتم تعيينه تلقائياً لـ FormData
      },
      timeout: 60000, // زيادة timeout للملفات
    });

    return {
      success: true,
      message: response.data?.message || 'تم إرسال طلب الاشتراك بنجاح',
      data: response.data?.data,
    };
  } catch (error: any) {
    console.error('Create subscription request error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في إرسال طلب الاشتراك',
    };
  }
};

/**
 * الحصول على تفاصيل باقة معينة (يتطلب مصادقة)
 */
export const getSubscription = async (subscriptionId: number): Promise<{ success: boolean; data?: Subscription; message?: string }> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const url = addLocaleToUrl(`${API_BASE}/subscriptions/${subscriptionId}`);
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.trim()}`
      },
      timeout: 30000,
    });

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Get subscription error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب تفاصيل الباقة',
    };
  }
};

