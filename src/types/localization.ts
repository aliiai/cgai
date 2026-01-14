/**
 * Localization Types
 * 
 * Types المتعلقة بتوطين البيانات الديناميكية
 */

/**
 * واجهة للكائنات التي تحتوي على حقول قابلة للترجمة
 */
export interface Localizable {
  [key: string]: any;
  name?: string | null;
  name_en?: string | null;
  description?: string | null;
  description_en?: string | null;
}

/**
 * نوع الحقل القابل للترجمة
 */
export type LocalizableField = 'name' | 'description' | string;

/**
 * خيارات التوطين
 */
export interface LocalizationOptions {
  /**
   * اللغة المفضلة (إذا لم يتم تحديدها، سيتم استخدام اللغة الحالية من i18n)
   */
  preferredLanguage?: 'ar' | 'en';
  
  /**
   * اللغة الافتراضية في حالة عدم وجود ترجمة
   */
  fallbackLanguage?: 'ar' | 'en';
  
  /**
   * القيمة الافتراضية في حالة عدم وجود أي ترجمة
   */
  defaultValue?: string;
}

/**
 * نتيجة التوطين
 */
export interface LocalizedResult {
  /**
   * القيمة المترجمة
   */
  value: string;
  
  /**
   * اللغة المستخدمة
   */
  language: 'ar' | 'en';
  
  /**
   * هل تم استخدام اللغة الافتراضية (fallback)
   */
  isFallback: boolean;
}

