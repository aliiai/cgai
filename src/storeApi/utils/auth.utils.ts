/**
 * Authentication Utilities
 * 
 * Helper functions للمصادقة
 */

/**
 * الحصول على الـ token من localStorage
 */
export const getAuthToken = (): string | null => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const authData = JSON.parse(authStorage);
      return authData?.state?.token || null;
    }
  } catch (error) {
    console.error('Error parsing auth storage:', error);
  }
  return null;
};

