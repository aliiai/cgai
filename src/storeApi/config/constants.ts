/**
 * API Constants
 * 
 * هذه القيم تستخدم environment variables من Vite
 * يمكن تعريفها في ملف .env أو .env.local
 * 
 * القيم الافتراضية تتطابق مع إعدادات vite.config.ts
 * BASE_URL: عنوان الخادم الأساسي (من vite.config.ts proxy target)
 */

// الحصول على BASE_URL من environment variables أو استخدام القيمة الافتراضية
// القيمة الافتراضية تتطابق مع vite.config.ts proxy target
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://dsai.sa/backend";

// API Base URL - للطلبات المباشرة (مع المسار الكامل)
export const API_BASE = `${BASE_URL}/api`;

// API Base URL - للاستخدام مع Vite proxy (مسار نسبي)
export const API_BASE_URL = '/api';

// Storage Base URL - لروابط الملفات والصور
export const STORAGE_BASE_URL = BASE_URL;

/**
 * الحصول على اللغة الحالية من i18n أو localStorage
 */
export const getCurrentLocale = (): 'ar' | 'en' => {
  try {
    // محاولة الحصول من localStorage أولاً (أسرع)
    const i18nLang = localStorage.getItem('i18nextLng') || 'ar';
    return i18nLang.startsWith('en') ? 'en' : 'ar';
  } catch {
    return 'ar';
  }
};

/**
 * إضافة locale parameter إلى URL
 * @param url - الـ URL الأصلي
 * @param locale - اللغة (اختياري، سيتم الحصول عليها تلقائياً)
 * @returns URL مع locale parameter
 */
export const addLocaleToUrl = (url: string, locale?: 'ar' | 'en'): string => {
  const currentLocale = locale || getCurrentLocale();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}locale=${currentLocale}`;
};

