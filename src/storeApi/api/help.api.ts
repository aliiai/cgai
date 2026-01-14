/**
 * Help & Guide API
 * 
 * APIs المتعلقة بالمساعدة والدليل:
 * - الحصول على بيانات المساعدة والدليل
 */

import axios from 'axios';
import { API_BASE, addLocaleToUrl } from '../config/constants';
import { getAuthToken } from '../utils/auth.utils';

export interface HelpGuideItem {
  id: number;
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  icon: string;
  sort_order: number;
}

export interface HelpGuideResponse {
  success: boolean;
  data: HelpGuideItem[];
  role?: string;
}

/**
 * الحصول على بيانات المساعدة والدليل
 */
export const getHelpGuide = async (): Promise<HelpGuideResponse> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        data: [],
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const url = addLocaleToUrl(`${API_BASE}/customer/help-guide`);
    const response = await axios.get(
      url,
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
      data: response.data.data || [],
      role: response.data.role
    };
  } catch (error: any) {
    console.error('Get help guide error:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'فشل في جلب بيانات المساعدة والدليل'
    };
  }
};

