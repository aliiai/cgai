/**
 * Notifications API
 * 
 * APIs المتعلقة بالإشعارات:
 * - الحصول على الإشعارات
 * - تحديث حالة الإشعار كمقروء
 * - تحديد جميع الإشعارات كمقروءة
 */

import axios from 'axios';
import { API_BASE, addLocaleToUrl } from '../config/constants';
import { getAuthToken } from '../utils/auth.utils';
import type {
  NotificationsResponse,
  GetNotificationsParams,
} from '../../types/types';

/**
 * الحصول على الإشعارات
 */
export const getNotifications = async (params?: GetNotificationsParams): Promise<NotificationsResponse> => {
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
        unread_count: 0,
      };
    }

    const queryParams = new URLSearchParams();
    if (params?.read !== undefined) queryParams.append('read', params.read.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const url = addLocaleToUrl(`${API_BASE}/notifications?${queryParams.toString()}`);
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
      unread_count: response.data.unread_count || 0,
    };
  } catch (error: any) {
    console.error('Get notifications error:', error);
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
      unread_count: 0,
    };
  }
};

/**
 * تحديث حالة الإشعار كمقروء
 */
export const markNotificationAsRead = async (notificationId: number): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const url = addLocaleToUrl(`${API_BASE}/notifications/${notificationId}/read`);
    const response = await axios.post(url, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.trim()}`
      },
      timeout: 30000,
    });

    return {
      success: true,
      message: response.data?.message || 'تم تحديث حالة الإشعار',
    };
  } catch (error: any) {
    console.error('Mark notification as read error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في تحديث حالة الإشعار',
    };
  }
};

/**
 * تحديد جميع الإشعارات كمقروءة
 */
export const markAllNotificationsAsRead = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const url = addLocaleToUrl(`${API_BASE}/notifications/mark-all-read`);
    const response = await axios.post(url, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.trim()}`
      },
      timeout: 30000,
    });

    return {
      success: true,
      message: response.data?.message || 'تم تحديث جميع الإشعارات',
    };
  } catch (error: any) {
    console.error('Mark all notifications as read error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في تحديث الإشعارات',
    };
  }
};

