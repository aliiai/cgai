/**
 * Localization Utilities
 * 
 * أدوات مركزية للتعامل مع توطين البيانات الديناميكية
 */

import i18n from '../config/i18n';
import type { LocalizationOptions, LocalizedResult } from '../types/localization';

/**
 * الحصول على اللغة الحالية من i18n
 */
export const getCurrentLanguage = (): 'ar' | 'en' => {
  const lang = i18n.language || 'ar';
  return lang.startsWith('en') ? 'en' : 'ar';
};

/**
 * توطين حقل واحد
 * 
 * @param arValue - القيمة العربية
 * @param enValue - القيمة الإنجليزية
 * @param options - خيارات التوطين
 * @returns القيمة المترجمة
 * 
 * @example
 * ```ts
 * const name = localizeField(item.name, item.name_en);
 * ```
 */
export const localizeField = (
  arValue: string | null | undefined,
  enValue: string | null | undefined,
  options: LocalizationOptions = {}
): string => {
  const {
    preferredLanguage = getCurrentLanguage(),
    fallbackLanguage = 'ar',
    defaultValue = '',
  } = options;

  // تحديد اللغة المطلوبة
  const targetLanguage = preferredLanguage;

  // محاولة الحصول على القيمة حسب اللغة المطلوبة
  if (targetLanguage === 'en' && enValue) {
    return enValue.trim();
  }
  
  if (targetLanguage === 'ar' && arValue) {
    return arValue.trim();
  }

  // Fallback إلى اللغة الأخرى
  if (fallbackLanguage === 'en' && enValue) {
    return enValue.trim();
  }
  
  if (fallbackLanguage === 'ar' && arValue) {
    return arValue.trim();
  }

  // Fallback إلى أي قيمة متاحة
  if (enValue) return enValue.trim();
  if (arValue) return arValue.trim();

  // القيمة الافتراضية
  return defaultValue;
};

/**
 * توطين حقل واحد مع معلومات إضافية
 * 
 * @param arValue - القيمة العربية
 * @param enValue - القيمة الإنجليزية
 * @param options - خيارات التوطين
 * @returns نتيجة التوطين مع معلومات إضافية
 */
export const localizeFieldWithInfo = (
  arValue: string | null | undefined,
  enValue: string | null | undefined,
  options: LocalizationOptions = {}
): LocalizedResult => {
  const {
    preferredLanguage = getCurrentLanguage(),
    fallbackLanguage = 'ar',
    defaultValue = '',
  } = options;

  const targetLanguage = preferredLanguage;

  // محاولة الحصول على القيمة حسب اللغة المطلوبة
  if (targetLanguage === 'en' && enValue) {
    return {
      value: enValue.trim(),
      language: 'en',
      isFallback: false,
    };
  }
  
  if (targetLanguage === 'ar' && arValue) {
    return {
      value: arValue.trim(),
      language: 'ar',
      isFallback: false,
    };
  }

  // Fallback إلى اللغة الأخرى
  if (fallbackLanguage === 'en' && enValue) {
    return {
      value: enValue.trim(),
      language: 'en',
      isFallback: true,
    };
  }
  
  if (fallbackLanguage === 'ar' && arValue) {
    return {
      value: arValue.trim(),
      language: 'ar',
      isFallback: true,
    };
  }

  // Fallback إلى أي قيمة متاحة
  if (enValue) {
    return {
      value: enValue.trim(),
      language: 'en',
      isFallback: true,
    };
  }
  
  if (arValue) {
    return {
      value: arValue.trim(),
      language: 'ar',
      isFallback: true,
    };
  }

  // القيمة الافتراضية
  return {
    value: defaultValue,
    language: fallbackLanguage,
    isFallback: true,
  };
};

/**
 * توطين كائن كامل مع حقول متعددة
 * 
 * @param item - الكائن المراد توطينه
 * @param fields - قائمة الحقول المراد توطينها
 * @param options - خيارات التوطين
 * @returns كائن جديد مع الحقول المترجمة
 * 
 * @example
 * ```ts
 * const localized = localizeObject(service, ['name', 'description']);
 * // النتيجة: { name: '...', description: '...', ...rest }
 * ```
 */
export const localizeObject = <T extends Record<string, any>>(
  item: T,
  fields: string[] = ['name', 'description'],
  options: LocalizationOptions = {}
): T => {
  if (!item) return item;

  const localized = { ...item } as Record<string, any>;

  fields.forEach((field) => {
    const arField = field;
    const enField = `${field}_en`;

    if (arField in item || enField in item) {
      const arValue = item[arField];
      const enValue = item[enField];

      // استبدال الحقل الأصلي بالقيمة المترجمة
      localized[arField] = localizeField(arValue, enValue, options);
    }
  });

  return localized as T;
};

/**
 * الحصول على اسم محلي لكائن
 * 
 * @param item - الكائن المراد الحصول على اسمه
 * @param options - خيارات التوطين
 * @returns الاسم المترجم
 * 
 * @example
 * ```ts
 * const name = getLocalizedName(service);
 * ```
 */
export const getLocalizedName = <T extends { name?: string | null; name_en?: string | null }>(
  item: T | null | undefined,
  options: LocalizationOptions = {}
): string => {
  if (!item) return options.defaultValue || '';
  // Support both name/name_en and name_en only (for subscriptions)
  const arValue = 'name' in item ? item.name : null;
  const enValue = 'name_en' in item ? item.name_en : null;
  return localizeField(arValue, enValue, options);
};

/**
 * الحصول على وصف محلي لكائن
 * 
 * @param item - الكائن المراد الحصول على وصفه
 * @param options - خيارات التوطين
 * @returns الوصف المترجم
 * 
 * @example
 * ```ts
 * const description = getLocalizedDescription(service);
 * ```
 */
export const getLocalizedDescription = <T extends { description?: string | null; description_en?: string | null }>(
  item: T | null | undefined,
  options: LocalizationOptions = {}
): string => {
  if (!item) return options.defaultValue || '';
  // Support both description/description_en and description_en only (for subscriptions)
  const arValue = 'description' in item ? item.description : null;
  const enValue = 'description_en' in item ? item.description_en : null;
  return localizeField(arValue, enValue, options);
};

/**
 * توطين مصفوفة من الكائنات
 * 
 * @param items - المصفوفة المراد توطينها
 * @param fields - قائمة الحقول المراد توطينها
 * @param options - خيارات التوطين
 * @returns مصفوفة جديدة مع الكائنات المترجمة
 * 
 * @example
 * ```ts
 * const localizedServices = localizeArray(services, ['name', 'description']);
 * ```
 */
export const localizeArray = <T extends Record<string, any>>(
  items: T[],
  fields: string[] = ['name', 'description'],
  options: LocalizationOptions = {}
): T[] => {
  if (!Array.isArray(items)) return [];
  return items.map((item) => localizeObject(item, fields, options));
};

