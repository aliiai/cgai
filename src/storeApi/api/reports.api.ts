/**
 * Reports API
 * 
 * APIs المتعلقة بالتقارير والإحصائيات:
 * - الحصول على بيانات التقارير والإحصائيات
 */

import axios from 'axios';
import { API_BASE } from '../config/constants';
import { getAuthToken } from '../utils/auth.utils';

export interface ReportsData {
  bookings?: {
    total?: number;
    upcoming?: number;
    pending?: number;
    confirmed?: number;
    in_progress?: number;
    completed?: number;
    cancelled?: number;
    today?: number;
    by_month?: Array<{ month: string; count: number }>;
    by_status?: Array<{ status: string; count: number }>;
  };
  payments?: {
    total_spent?: number;
    paid_bookings?: number;
    unpaid_bookings?: number;
    by_month?: Array<{ month: string; amount: number }>;
    average_per_booking?: number;
  };
  tickets?: {
    total?: number;
    open?: number;
    in_progress?: number;
    resolved?: number;
    by_month?: Array<{ month: string; count: number }>;
    by_priority?: Array<{ priority: string; count: number }>;
  };
  services?: {
    total_booked?: number;
    most_popular?: Array<{ name: string; name_en?: string; count: number }>;
    by_category?: Array<{ category: string; count: number }>;
  };
  ratings?: {
    average?: number;
    total?: number;
    by_rating?: Array<{ rating: number; count: number }>;
  };
  [key: string]: any; // للسماح ببيانات إضافية
}

export interface ReportsResponse {
  success: boolean;
  data?: ReportsData;
  message?: string;
}

/**
 * الحصول على بيانات التقارير والإحصائيات
 */
export const getReports = async (): Promise<ReportsResponse> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const response = await axios.get(
      `${API_BASE}/customer/reports`,
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
      data: response.data.data || response.data,
    };
  } catch (error: any) {
    console.error('Get reports error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب بيانات التقارير',
      data: undefined
    };
  }
};

