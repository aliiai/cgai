/**
 * Protected Route Component & Logic
 * 
 * يحتوي على مكون ProtectedRoute الذي يحمي المسارات
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../storeApi/storeApi';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, token } = useAuthStore();
  const location = useLocation();

  // التحقق من المصادقة من Zustand store و localStorage
  // التحقق من token في localStorage أيضاً كطبقة حماية إضافية
  const checkAuth = () => {
    // التحقق من Zustand store
    if (!isAuthenticated || !token) {
      return false;
    }

    // التحقق من localStorage كطبقة حماية إضافية
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const authData = JSON.parse(authStorage);
        const storedToken = authData?.state?.token;
        if (!storedToken || storedToken === 'null' || storedToken === 'undefined') {
          return false;
        }
      } else {
        // إذا لم يكن هناك auth-storage، تحقق من auth-token مباشرة
        const directToken = localStorage.getItem('auth-token');
        if (!directToken || directToken === 'null' || directToken === 'undefined') {
          return false;
        }
      }
    } catch (error) {
      console.error('Error checking auth in localStorage:', error);
      return false;
    }

    return true;
  };

  // إذا لم يكن مسجل دخول، توجيه إلى صفحة تسجيل الدخول مع حفظ المسار الحالي
  if (!checkAuth()) {
    // حفظ المسار الحالي للعودة إليه بعد تسجيل الدخول
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
