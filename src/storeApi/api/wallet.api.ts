/**
 * Wallet & Points API
 * 
 * APIs المتعلقة بالمحفظة والنقاط:
 * - الحصول على بيانات المحفظة والنقاط
 */

import axios from 'axios';
import { API_BASE, addLocaleToUrl } from '../config/constants';
import { getAuthToken } from '../utils/auth.utils';

export interface WalletData {
  balance: number;
  user_id: number;
}

export interface PointsSettings {
  points_per_riyal: number;
  is_active: boolean;
}

export interface WalletResponse {
  success: boolean;
  data: {
    wallet: WalletData;
    settings: PointsSettings;
  };
  message?: string;
}

/**
 * الحصول على بيانات المحفظة والنقاط
 */
export const getWallet = async (): Promise<WalletResponse> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        data: {
          wallet: {
            balance: 0,
            user_id: 0,
          },
          settings: {
            points_per_riyal: 10,
            is_active: false,
          },
        },
        message: 'يجب تسجيل الدخول أولاً',
      };
    }

    const url = addLocaleToUrl(`${API_BASE}/customer/points/wallet`);
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.trim()}`,
      },
      timeout: 30000,
    });

    return {
      success: true,
      data: response.data.data || {
        wallet: {
          balance: 0,
          user_id: 0,
        },
        settings: {
          points_per_riyal: 10,
          is_active: false,
        },
      },
    };
  } catch (error: any) {
    console.error('Get wallet error:', error);
    return {
      success: false,
      data: {
        wallet: {
          balance: 0,
          user_id: 0,
        },
        settings: {
          points_per_riyal: 10,
          is_active: false,
        },
      },
      message: error.response?.data?.message || 'حدث خطأ أثناء جلب بيانات المحفظة',
    };
  }
};

export interface PurchasePointsRequest {
  amount: number;
}

export interface PurchasePointsResponse {
  success: boolean;
  payment_url?: string;
  order_id?: string;
  message?: string;
}

/**
 * شراء نقاط
 */
export const purchasePoints = async (amount: number): Promise<PurchasePointsResponse> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً',
      };
    }

    const url = addLocaleToUrl(`${API_BASE}/customer/points/purchase`);
    const response = await axios.post(
      url,
      { amount },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token.trim()}`,
        },
        timeout: 30000,
      }
    );

    return {
      success: true,
      payment_url: response.data.payment_url || response.data.data?.payment_url,
      order_id: response.data.order_id || response.data.data?.order_id,
      message: response.data.message || 'تم إنشاء رابط الدفع بنجاح',
    };
  } catch (error: any) {
    console.error('Purchase points error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في شراء النقاط',
    };
  }
};

