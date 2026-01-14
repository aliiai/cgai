/**
 * useLocalized Hook
 * 
 * React Hook لتوطين البيانات الديناميكية
 * يعيد التصيير تلقائياً عند تغيير اللغة
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  localizeField,
  localizeObject,
  getLocalizedName,
  getLocalizedDescription,
  localizeArray,
  type LocalizationOptions,
} from '../utils/localization';
import type { Localizable } from '../types/localization';

/**
 * Hook لتوطين حقل واحد
 * 
 * @param arValue - القيمة العربية
 * @param enValue - القيمة الإنجليزية
 * @param options - خيارات التوطين
 * @returns القيمة المترجمة
 * 
 * @example
 * ```tsx
 * const name = useLocalizedField(item.name, item.name_en);
 * ```
 */
export const useLocalizedField = (
  arValue: string | null | undefined,
  enValue: string | null | undefined,
  options?: LocalizationOptions
): string => {
  const { i18n } = useTranslation();
  
  return useMemo(() => {
    return localizeField(arValue, enValue, {
      ...options,
      preferredLanguage: i18n.language?.startsWith('en') ? 'en' : 'ar',
    });
  }, [arValue, enValue, i18n.language, options]);
};

/**
 * Hook لتوطين كائن كامل
 * 
 * @param item - الكائن المراد توطينه
 * @param fields - قائمة الحقول المراد توطينها (افتراضي: ['name', 'description'])
 * @param options - خيارات التوطين
 * @returns كائن جديد مع الحقول المترجمة
 * 
 * @example
 * ```tsx
 * const localizedService = useLocalized(service, ['name', 'description']);
 * ```
 */
export const useLocalized = <T extends Localizable>(
  item: T | null | undefined,
  fields: string[] = ['name', 'description'],
  options?: LocalizationOptions
): T => {
  const { i18n } = useTranslation();
  
  return useMemo(() => {
    if (!item) return item as T;
    
    return localizeObject(item, fields, {
      ...options,
      preferredLanguage: i18n.language?.startsWith('en') ? 'en' : 'ar',
    });
  }, [item, fields, i18n.language, options]);
};

/**
 * Hook للحصول على اسم محلي
 * 
 * @param item - الكائن المراد الحصول على اسمه
 * @param options - خيارات التوطين
 * @returns الاسم المترجم
 * 
 * @example
 * ```tsx
 * const name = useLocalizedName(service);
 * ```
 */
export const useLocalizedName = <T extends { name?: string | null; name_en?: string | null }>(
  item: T | null | undefined,
  options?: LocalizationOptions
): string => {
  const { i18n } = useTranslation();
  
  return useMemo(() => {
    return getLocalizedName(item, {
      ...options,
      preferredLanguage: i18n.language?.startsWith('en') ? 'en' : 'ar',
    });
  }, [item, i18n.language, options]);
};

/**
 * Hook للحصول على وصف محلي
 * 
 * @param item - الكائن المراد الحصول على وصفه
 * @param options - خيارات التوطين
 * @returns الوصف المترجم
 * 
 * @example
 * ```tsx
 * const description = useLocalizedDescription(service);
 * ```
 */
export const useLocalizedDescription = <T extends { description?: string | null; description_en?: string | null }>(
  item: T | null | undefined,
  options?: LocalizationOptions
): string => {
  const { i18n } = useTranslation();
  
  return useMemo(() => {
    return getLocalizedDescription(item, {
      ...options,
      preferredLanguage: i18n.language?.startsWith('en') ? 'en' : 'ar',
    });
  }, [item, i18n.language, options]);
};

/**
 * Hook لتوطين مصفوفة من الكائنات
 * 
 * @param items - المصفوفة المراد توطينها
 * @param fields - قائمة الحقول المراد توطينها (افتراضي: ['name', 'description'])
 * @param options - خيارات التوطين
 * @returns مصفوفة جديدة مع الكائنات المترجمة
 * 
 * @example
 * ```tsx
 * const localizedServices = useLocalizedArray(services, ['name', 'description']);
 * ```
 */
export const useLocalizedArray = <T extends Localizable>(
  items: T[] | null | undefined,
  fields: string[] = ['name', 'description'],
  options?: LocalizationOptions
): T[] => {
  const { i18n } = useTranslation();
  
  return useMemo(() => {
    if (!items || !Array.isArray(items)) return [];
    
    return localizeArray(items, fields, {
      ...options,
      preferredLanguage: i18n.language?.startsWith('en') ? 'en' : 'ar',
    });
  }, [items, fields, i18n.language, options]);
};

/**
 * Hook للحصول على اللغة الحالية
 * 
 * @returns اللغة الحالية ('ar' | 'en')
 */
export const useLanguage = (): 'ar' | 'en' => {
  const { i18n } = useTranslation();
  
  return useMemo(() => {
    return i18n.language?.startsWith('en') ? 'en' : 'ar';
  }, [i18n.language]);
};

