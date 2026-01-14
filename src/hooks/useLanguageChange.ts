/**
 * Hook لإعادة جلب البيانات عند تغيير اللغة
 * 
 * يستمع لتغيير اللغة ويعيد جلب البيانات تلقائياً
 */

import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook لإعادة جلب البيانات عند تغيير اللغة
 * 
 * @param refetchFunction - دالة لإعادة جلب البيانات
 * @param dependencies - dependencies إضافية للـ useEffect
 * 
 * @example
 * ```tsx
 * const { data, refetch } = useQuery(...);
 * useLanguageChange(() => refetch());
 * ```
 */
export const useLanguageChange = (
  refetchFunction: () => void | Promise<void>,
  dependencies: any[] = []
) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // إعادة جلب البيانات عند تغيير اللغة
    const handleLanguageChanged = async (lng: string) => {
      console.log('Language changed to:', lng);
      try {
        await refetchFunction();
      } catch (error) {
        console.error('Error refetching data after language change:', error);
      }
    };

    // الاستماع لتغيير اللغة
    i18n.on('languageChanged', handleLanguageChanged);

    // Cleanup
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, refetchFunction, ...dependencies]);
};

/**
 * Hook لإعادة جلب عدة دوال عند تغيير اللغة
 * 
 * @param refetchFunctions - مصفوفة من دوال إعادة الجلب
 * 
 * @example
 * ```tsx
 * useLanguageChangeMultiple([
 *   () => loadCategories(),
 *   () => loadServices(),
 * ]);
 * ```
 */
export const useLanguageChangeMultiple = (
  refetchFunctions: Array<() => void | Promise<void>>
) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      console.log('Language changed to:', lng);
      try {
        await Promise.all(refetchFunctions.map(fn => fn()));
      } catch (error) {
        console.error('Error refetching data after language change:', error);
      }
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, refetchFunctions]);
};

