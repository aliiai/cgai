/**
 * Activity Log API
 * 
 * APIs المتعلقة بسجل النشاطات:
 * - الحصول على سجل النشاطات
 */

import axios from 'axios';
import { API_BASE, addLocaleToUrl } from '../config/constants';
import { getAuthToken } from '../utils/auth.utils';

export interface ActivityLogItem {
  id: number;
  user_id: number;
  action: string;
  description: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLogResponse {
  success: boolean;
  data: ActivityLogItem[];
  message?: string;
}

export interface GetActivityLogParams {
  per_page?: number;
  page?: number;
  search?: string;
}

/**
 * الحصول على سجل النشاطات
 */
export const getActivityLog = async (params?: GetActivityLogParams): Promise<ActivityLogResponse> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        data: [],
      };
    }

    const queryParams = new URLSearchParams();
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.search) queryParams.append('search', params.search);

    const url = addLocaleToUrl(`${API_BASE}/customer/activity-log?${queryParams.toString()}`);
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
        data: [],
      };
    }

    // Debug: طباعة البيانات المستلمة
    console.log('Activity Log API Response:', response.data);
    console.log('Response structure:', {
      isArray: Array.isArray(response.data),
      hasData: !!response.data?.data,
      dataIsArray: Array.isArray(response.data?.data),
      fullResponse: response.data
    });

    // التأكد من أن البيانات هي array
    let activitiesData = [];
    if (response.data) {
      // الحالة 1: البيانات مباشرة array
      if (Array.isArray(response.data)) {
        activitiesData = response.data;
        console.log('Data is direct array:', activitiesData.length);
      } 
      // الحالة 2: البيانات في response.data.data
      else if (response.data.data) {
        if (Array.isArray(response.data.data)) {
          activitiesData = response.data.data;
          console.log('Data is in response.data.data (array):', activitiesData.length);
        } 
        // الحالة 3: البيانات في response.data.data.data (pagination)
        else if (response.data.data.data && Array.isArray(response.data.data.data)) {
          activitiesData = response.data.data.data;
          console.log('Data is in response.data.data.data (array):', activitiesData.length);
        }
        // الحالة 4: البيانات object واحد وليس array
        else if (typeof response.data.data === 'object' && !Array.isArray(response.data.data)) {
          // إذا كان object واحد، نحوله إلى array
          activitiesData = [response.data.data];
          console.log('Data is single object, converted to array');
        }
      }
      // الحالة 5: البيانات في response.data.activities أو response.data.logs
      else if (Array.isArray(response.data.activities)) {
        activitiesData = response.data.activities;
        console.log('Data is in response.data.activities:', activitiesData.length);
      } else if (Array.isArray(response.data.logs)) {
        activitiesData = response.data.logs;
        console.log('Data is in response.data.logs:', activitiesData.length);
      }
    }

    console.log('Final activitiesData:', activitiesData);

    return {
      success: true,
      data: activitiesData,
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      return {
        success: true,
        data: [],
      };
    }
    console.error('Get activity log error:', error);
    return {
      success: false,
      data: [],
    };
  }
};

