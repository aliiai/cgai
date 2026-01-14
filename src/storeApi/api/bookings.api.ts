/**
 * Bookings API
 * 
 * APIs المتعلقة بالحجوزات:
 * - إنشاء حجز جديد
 * - الدفع الإلكتروني
 * - الحصول على حجوزات العميل
 */

import axios from 'axios';
import { API_BASE, addLocaleToUrl } from '../config/constants';
import { getAuthToken } from '../utils/auth.utils';

/**
 * إرسال طلب حجز جديد
 */
export const createBooking = async (bookingData: {
  service_id?: number;
  consultation_id?: number;
  booking_date: string;
  time_slot_ids: number[];
  notes: string;
  use_points?: boolean;
}) => {
  try {
    // استخدام دالة getAuthToken الموجودة
    const token = getAuthToken();

    // إذا لم يكن هناك token، قد نحتاج إلى تسجيل الدخول أولاً
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    // تنظيف التوكن من أي مسافات
    const cleanToken = token.trim();

    // تحديد payment_method بناءً على use_points
    const requestData = {
      ...bookingData,
      payment_method: bookingData.use_points ? 'points' : 'online',
    };

    const url = addLocaleToUrl(`${API_BASE}/customer/bookings`);
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${cleanToken}`
      },
      timeout: 30000,
    });

    // استخراج البيانات من response
    const bookingId = response.data?.data?.id || response.data?.id;
    const tempBookingId = response.data?.data?.temp_booking_id || response.data?.temp_booking_id;
    const totalPrice = response.data?.data?.total_price || response.data?.total_price;
    const paymentUrl = response.data?.data?.payment_url || response.data?.payment_url;

    return {
      success: true,
      data: {
        ...response.data,
        bookingId,
        tempBookingId,
        totalPrice,
        payment_url: paymentUrl,
      },
      message: response.data?.message || 'تم الحجز بنجاح'
    };
  } catch (error: any) {
    console.error('Booking error:', error);

    // تحسين رسالة الخطأ
    let errorMessage = 'فشل الحجز. حاول مرة أخرى.';

    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.';
      } else if (error.response.status === 400) {
        errorMessage = error.response.data?.message || 'بيانات الحجز غير صحيحة.';
      } else if (error.response.status === 403) {
        errorMessage = 'ليس لديك صلاحية للقيام بهذا الحجز.';
      } else if (error.response.status === 404) {
        errorMessage = 'الخدمة غير موجودة أو غير متاحة.';
      } else if (error.response.status === 409) {
        errorMessage = 'هذا الوقت محجوز مسبقاً. يرجى اختيار وقت آخر.';
      } else {
        errorMessage = error.response.data?.message || 'حدث خطأ في الخادم.';
      }
    } else if (error.request) {
      errorMessage = 'لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت.';
    } else {
      errorMessage = error.message || 'حدث خطأ غير متوقع.';
    }

    return {
      success: false,
      message: errorMessage,
      data: error.response?.data
    };
  }
};

/**
 * إرسال طلب حجز استشارة جديد
 */
export const createConsultationBooking = async (bookingData: {
  consultation_id: number;
  booking_date: string;
  time_slot_id: number;
  payment_method?: string;
  notes?: string;
  use_points?: boolean;
}) => {
  try {
    const token = getAuthToken();

    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const cleanToken = token.trim();

    // تحديد payment_method بناءً على use_points
    const requestData = {
      ...bookingData,
      payment_method: bookingData.use_points ? 'points' : (bookingData.payment_method || 'online'),
    };

    const url = addLocaleToUrl(`${API_BASE}/customer/bookings/consultation`);
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${cleanToken}`
      },
      timeout: 30000,
    });

    // استخراج البيانات من response
    const bookingId = response.data?.data?.id || response.data?.id;
    const tempBookingId = response.data?.data?.temp_booking_id || response.data?.temp_booking_id;
    const totalPrice = response.data?.data?.total_price || response.data?.total_price;
    const paymentUrl = response.data?.data?.payment_url || response.data?.payment_url;

    return {
      success: true,
      data: {
        ...response.data,
        bookingId,
        tempBookingId,
        totalPrice,
        payment_url: paymentUrl,
      },
      message: response.data?.message || 'تم الحجز بنجاح'
    };
  } catch (error: any) {
    console.error('Consultation booking error:', error);

    let errorMessage = 'فشل الحجز. حاول مرة أخرى.';

    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.';
      } else if (error.response.status === 400) {
        errorMessage = error.response.data?.message || 'بيانات الحجز غير صحيحة.';
      } else if (error.response.status === 403) {
        errorMessage = 'ليس لديك صلاحية للقيام بهذا الحجز.';
      } else if (error.response.status === 404) {
        errorMessage = 'الخدمة الاستشارية غير موجودة أو غير متاحة.';
      } else if (error.response.status === 409) {
        errorMessage = 'هذا الوقت محجوز مسبقاً. يرجى اختيار وقت آخر.';
      } else {
        errorMessage = error.response.data?.message || 'حدث خطأ في الخادم.';
      }
    } else if (error.request) {
      errorMessage = 'لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت.';
    } else {
      errorMessage = error.message || 'حدث خطأ غير متوقع.';
    }

    return {
      success: false,
      message: errorMessage,
      data: error.response?.data
    };
  }
};

/**
 * الدفع الإلكتروني للحجز
 */
export const payBookingOnline = async (bookingId: number): Promise<{
  success: boolean;
  message?: string;
  data?: {
    payment_url: string;
    paymob_order_id: number;
  };
}> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    console.log('Creating payment link for booking:', bookingId);
    console.log('API URL:', `${API_BASE}/customer/bookings/${bookingId}/pay-online`);
    console.log('Token exists:', !!token, 'Token length:', token?.length);

    const url = addLocaleToUrl(`${API_BASE}/customer/bookings/${bookingId}/pay-online`);
    const response = await axios.post(url, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.trim()}`
      },
      timeout: 30000,
    });

    console.log('Payment link response:', response.data);

    // التحقق من وجود payment_url في الـ response
    const paymentUrl = response.data?.data?.payment_url || response.data?.payment_url;
    
    if (!paymentUrl) {
      console.error('No payment_url in response:', response.data);
      return {
        success: false,
        message: 'لم يتم استلام رابط الدفع من الخادم',
      };
    }

    return {
      success: true,
      message: response.data?.message || 'تم إنشاء رابط الدفع بنجاح',
      data: {
        payment_url: paymentUrl,
        paymob_order_id: response.data?.data?.paymob_order_id || response.data?.paymob_order_id,
      }
    };
  } catch (error: any) {
    console.error('Payment error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });
    
    let errorMessage = 'فشل في إنشاء رابط الدفع. حاول مرة أخرى.';

    if (error.response) {
      const status = error.response.status;
      const responseData = error.response.data;
      
      if (status === 401) {
        errorMessage = 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.';
      } else if (status === 400) {
        errorMessage = responseData?.message || 'بيانات الدفع غير صحيحة.';
      } else if (status === 404) {
        errorMessage = `الحجز رقم ${bookingId} غير موجود.`;
      } else if (status === 422) {
        errorMessage = responseData?.message || 'بيانات غير صحيحة.';
      } else if (status >= 500) {
        errorMessage = 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.';
      } else {
        errorMessage = responseData?.message || `حدث خطأ (${status}).`;
      }
      
      // إضافة تفاصيل إضافية للـ debugging
      if (responseData?.errors) {
        console.error('Validation errors:', responseData.errors);
      }
    } else if (error.request) {
      errorMessage = 'لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت.';
      console.error('Network error:', error.request);
    } else {
      errorMessage = error.message || 'حدث خطأ غير متوقع.';
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * الحصول على حجوزات العميل
 */
export const getCustomerBookings = async (params?: { status?: string; payment_status?: string }) => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return { success: false, message: 'يجب تسجيل الدخول أولاً' };
    }

    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.payment_status) queryParams.append('payment_status', params.payment_status);

    const url = addLocaleToUrl(`${API_BASE}/customer/bookings?${queryParams.toString()}`);
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
      pagination: response.data.meta || response.data.pagination
    };
  } catch (error: any) {
    console.error('Get bookings error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب الحجوزات',
      data: []
    };
  }
};

/**
 * الحصول على الحجوزات المكتملة (السابقة)
 */
export const getPastBookings = async (params?: { 
  status?: string; 
  payment_status?: string;
  per_page?: number;
  page?: number;
}) => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return { 
        success: false, 
        message: 'يجب تسجيل الدخول أولاً',
        data: [],
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: 15,
          total: 0,
          from: 0,
          to: 0
        }
      };
    }

    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.payment_status) queryParams.append('payment_status', params.payment_status);
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const url = addLocaleToUrl(`${API_BASE}/customer/bookings/past?${queryParams.toString()}`);
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
      pagination: response.data.pagination || {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0
      }
    };
  } catch (error: any) {
    console.error('Get past bookings error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب الحجوزات المكتملة',
      data: [],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0
      }
    };
  }
};

