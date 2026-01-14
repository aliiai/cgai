/**
 * Localization Index
 * 
 * ملف تصدير مركزي لجميع أدوات التوطين
 * 
 * @example
 * ```ts
 * import { localizeField, getLocalizedName, useLocalized } from './localization.index';
 * ```
 */

// Export all utilities
export * from './localization';

// Export all hooks (will be re-exported from hooks directory)
export {
  useLocalizedField,
  useLocalized,
  useLocalizedName,
  useLocalizedDescription,
  useLocalizedArray,
  useLanguage,
} from '../hooks/useLocalized';

// Export types
export type {
  Localizable,
  LocalizableField,
  LocalizationOptions,
  LocalizedResult,
} from '../types/localization';

