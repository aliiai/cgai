/**
 * Axios Instance Configuration
 * 
 * يحتوي على:
 * - Axios instance مع الإعدادات الأساسية
 * - Request Interceptor لإضافة التوكن
 * - Response Interceptor لمعالجة الأخطاء
 */

import axios from 'axios';
import { API_BASE_URL } from './constants';
import i18n from '../../config/i18n';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const authData = JSON.parse(authStorage);
        const token = authData?.state?.token;
        
        // التحقق من صحة التوكن قبل إرساله
        if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
          config.headers.Authorization = `Bearer ${token.trim()}`;
        } else {
          // إزالة header المصادقة إذا كان التوكن غير صحيح (سلوك طبيعي عند عدم وجود token)
          delete config.headers.Authorization;
        }
      } catch (error) {
        console.error('Error parsing auth storage:', error);
      }
    }
    
    // محاولة إضافة التوكن من localStorage مباشرة كـ fallback
    if (!config.headers.Authorization) {
      const directToken = localStorage.getItem('auth-token');
      if (directToken && directToken !== 'null' && directToken !== 'undefined' && directToken.trim() !== '') {
        config.headers.Authorization = `Bearer ${directToken.trim()}`;
      }
    }
    
    // إضافة locale parameter إلى جميع الطلبات
    if (config.url) {
      // قراءة اللغة مباشرة من i18n للحصول على القيمة الحالية
      // i18n يحفظ اللغة في localStorage تلقائياً، لكن نقرأ من i18n مباشرة للحصول على القيمة الأحدث
      let locale: 'ar' | 'en' = 'ar';
      try {
        // محاولة الحصول من i18n مباشرة (الأحدث)
        const i18nLang = i18n.language || localStorage.getItem('i18nextLng') || 'ar';
        locale = i18nLang.startsWith('en') ? 'en' : 'ar';
      } catch {
        // Fallback إلى localStorage
        const i18nLang = localStorage.getItem('i18nextLng') || 'ar';
        locale = i18nLang.startsWith('en') ? 'en' : 'ar';
      }
      
      // إزالة locale القديم إذا كان موجوداً
      const urlWithoutLocale = config.url.replace(/[?&]locale=(ar|en)/g, '');
      const separator = urlWithoutLocale.includes('?') ? '&' : '?';
      config.url = `${urlWithoutLocale}${separator}locale=${locale}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // معالجة خطأ 401 (Unauthorized) - التوكن منتهي أو غير صحيح
      if (status === 401) {
        console.error('Unauthorized access - Token expired or invalid');
        
        // التحقق من رسالة الخطأ
        const errorMessage = data?.detail || data?.message || '';
        
        if (errorMessage.includes('Invalid') || errorMessage.includes('expired') || errorMessage.includes('signature')) {
          // مسح بيانات المصادقة
          try {
            localStorage.removeItem('auth-storage');
            localStorage.removeItem('user-data');
            localStorage.removeItem('auth-token');
            localStorage.removeItem('is-authenticated');
            localStorage.removeItem('login-timestamp');
            
            // إعادة توجيه إلى صفحة تسجيل الدخول
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          } catch (e) {
            console.error('Error clearing auth data:', e);
          }
        }
      } else if (status === 403) {
        console.error('Forbidden access');
      } else if (status >= 500) {
        console.error('Server error:', data);
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };

