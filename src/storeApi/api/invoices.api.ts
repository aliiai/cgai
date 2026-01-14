/**
 * Invoices API
 * 
 * APIs المتعلقة بالفواتير والمدفوعات:
 * - الحصول على الفواتير
 */

import axios from 'axios';
import { API_BASE, addLocaleToUrl } from '../config/constants';
import { getAuthToken } from '../utils/auth.utils';
import type {
  InvoicesResponse,
  GetInvoicesParams,
} from '../../types/types';

/**
 * الحصول على الفواتير
 */
export const getInvoices = async (params?: GetInvoicesParams): Promise<InvoicesResponse> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        data: {
          invoices: [],
          pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 0,
          },
        },
      };
    }

    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const url = addLocaleToUrl(`${API_BASE}/customer/invoices?${queryParams.toString()}`);
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token.trim()}`
      },
      validateStatus: (status) => status < 500, // Accept 404 as a valid status
      timeout: 30000,
    });

    if (response.status === 404) {
      return {
        success: true,
        data: {
          invoices: [],
          pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 0,
          },
        },
      };
    }

    return {
      success: true,
      data: response.data.data || {
        invoices: [],
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: 15,
          total: 0,
        },
      },
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      return {
        success: true,
        data: {
          invoices: [],
          pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 0,
          },
        },
      };
    }
    console.error('Get invoices error:', error);
    return {
      success: false,
      data: {
        invoices: [],
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: 15,
          total: 0,
        },
      },
    };
  }
};

