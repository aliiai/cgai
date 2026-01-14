/**
 * Tickets API
 * 
 * APIs المتعلقة بالتذاكر:
 * - الحصول على التذاكر
 * - إنشاء تذكرة جديدة
 * - إضافة رسالة إلى تذكرة
 */

import axios from 'axios';
import { API_BASE } from '../config/constants';
import { getAuthToken } from '../utils/auth.utils';
import type {
  TicketsResponse,
  GetTicketsParams,
  Ticket,
  CreateTicketRequest,
  CreateTicketResponse,
  CreateTicketMessageRequest,
  CreateTicketMessageResponse,
} from '../../types/types';

/**
 * الحصول على التذاكر
 */
export const getTickets = async (params?: GetTicketsParams): Promise<TicketsResponse> => {
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
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const response = await axios.get(
      `${API_BASE}/tickets?${queryParams.toString()}`,
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
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Get tickets error:', error);
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
};

/**
 * الحصول على تذكرة واحدة
 */
export const getTicket = async (ticketId: number): Promise<{ success: boolean; data?: Ticket; message?: string }> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const response = await axios.get(
      `${API_BASE}/tickets/${ticketId}`,
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
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Get ticket error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب التذكرة',
    };
  }
};

/**
 * إنشاء تذكرة جديدة
 */
export const createTicket = async (ticketData: CreateTicketRequest): Promise<CreateTicketResponse> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const formData = new FormData();
    formData.append('subject', ticketData.subject);
    formData.append('description', ticketData.description);
    formData.append('priority', ticketData.priority);

    if (ticketData.attachments && ticketData.attachments.length > 0) {
      ticketData.attachments.forEach((file) => {
        formData.append('attachments[]', file);
      });
    }

    const response = await axios.post(
      `${API_BASE}/tickets`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token.trim()}`
        },
        timeout: 60000, // زيادة timeout للملفات
      }
    );

    return {
      success: true,
      message: response.data?.message || 'تم إنشاء التذكرة بنجاح',
      data: response.data?.data,
    };
  } catch (error: any) {
    console.error('Create ticket error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في إنشاء التذكرة',
    };
  }
};

/**
 * إضافة رسالة إلى تذكرة
 */
export const createTicketMessage = async (
  ticketId: number,
  messageData: CreateTicketMessageRequest
): Promise<CreateTicketMessageResponse> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const formData = new FormData();
    formData.append('message', messageData.message);

    if (messageData.attachments && messageData.attachments.length > 0) {
      messageData.attachments.forEach((file) => {
        formData.append('attachments[]', file);
      });
    }

    const response = await axios.post(
      `${API_BASE}/tickets/${ticketId}/messages`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token.trim()}`
        },
        timeout: 60000, // زيادة timeout للملفات
      }
    );

    return {
      success: true,
      message: response.data?.message || 'تم إرسال الرسالة بنجاح',
      data: response.data?.data,
    };
  } catch (error: any) {
    console.error('Create ticket message error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في إرسال الرسالة',
    };
  }
};

