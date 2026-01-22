/**
 * Global and Public Routes Configuration
 * 
 * Contains PublicRoute component and Global/Public route definitions.
 */

import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import type { PublicRoute as PublicRouteType } from '../types/types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../storeApi/storeApi';
import PublicLayout from '../layouts/PublicLayout';

// ----------------------------------------------------------------------
// PublicRoute Component
// ----------------------------------------------------------------------

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, token } = useAuthStore();
  const location = useLocation();

  const checkAuth = () => {
    if (!isAuthenticated || !token) {
      return false;
    }

    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const authData = JSON.parse(authStorage);
        const storedToken = authData?.state?.token;
        if (!storedToken || storedToken === 'null' || storedToken === 'undefined') {
          return false;
        }
      } else {
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

  if (checkAuth()) {
    const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

// Export PublicRoute component
export { PublicRoute };
export default PublicRoute;

// ----------------------------------------------------------------------
// Routes Configuration
// ----------------------------------------------------------------------

// Component mapping - Lazy loading
const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  HomePage: lazy(() => import('../pages/HomePage')),
  Technologies: lazy(() => import('../pages/Technologies')),
  News: lazy(() => import('../pages/News')),
  RequestService: lazy(() => import('../pages/RequestService')),
  Contact: lazy(() => import('../pages/Contact')),
  DiscoverServices: lazy(() => import('../pages/DiscoverServices')),
};

// Global Routes Data
export const globalRoutes: PublicRouteType[] = [
  {
    id: 'home',
    name: 'الصفحة الرئيسية',
    path: '/',
    component: 'HomePage',
    sectionId: 'hero',
  },
  {
    id: 'technologies',
    name: 'التقنيات',
    path: '/technologies',
    component: 'Technologies',
  },
  {
    id: 'news',
    name: 'أخبار',
    path: '/news',
    component: 'News',
  },
  {
    id: 'request-service',
    name: 'طلب الخدمة',
    path: '/request-service',
    component: 'RequestService',
  },
  {
    id: 'contact',
    name: 'تواصل معنا',
    path: '/contact',
    component: 'Contact',
  },
  {
    id: 'discover-services',
    name: 'اكتشف الخدمات',
    path: '/discover-services',
    component: 'DiscoverServices',
  },
];

// Home Section Routes (for navigation)
export const homeSectionRoutes: PublicRouteType[] = [
  {
    id: 'hero',
    name: 'الصفحة الرئيسية',
    path: '/#hero',
    sectionId: 'hero',
  },
  {
    id: 'services',
    name: 'خدماتنا',
    path: '/#services',
    sectionId: 'services',
  },
  {
    id: 'pricing',
    name: 'الأسعار والخطط',
    path: '/#pricing',
    sectionId: 'pricing',
  },
  {
    id: 'faq',
    name: 'الأسئلة الشائعة',
    path: '/#faq',
    sectionId: 'faq',
  },
  {
    id: 'how-it-works',
    name: 'كيف يعمل',
    path: '/#how-it-works',
    sectionId: 'how-it-works',
  },
  {
    id: 'testimonials',
    name: 'شهادات العملاء',
    path: '/#testimonials',
    sectionId: 'testimonials',
  },
  {
    id: 'why-choose-us',
    name: 'لماذا نحن',
    path: '/#why-choose-us',
    sectionId: 'why-choose-us',
  },
];

// Helper Functions
export const getGlobalRouteById = (id: string): PublicRouteType | undefined => {
  return [...globalRoutes, ...homeSectionRoutes].find((route) => route.id === id);
};

export const getGlobalRouteByPath = (path: string): PublicRouteType | undefined => {
  return [...globalRoutes, ...homeSectionRoutes].find((route) => route.path === path);
};

export const getGlobalRouteBySectionId = (sectionId: string): PublicRouteType | undefined => {
  return homeSectionRoutes.find((route) => route.sectionId === sectionId);
};

// Route Objects for React Router
const createRoute = (config: { path: string; component?: string }): RouteObject | null => {
  if (!config.component) return null;

  const Component = componentMap[config.component];
  if (!Component) {
    console.warn(`Component ${config.component} not found in componentMap`);
    return null;
  }

  // Convert absolute paths to relative paths for nested routes
  const relativePath = config.path === '/' ? undefined : config.path.replace(/^\//, '');

  return {
    path: relativePath,
    index: config.path === '/',
    element: <Component />,
  };
};

// Create routes with PublicLayout wrapper
export const globalRoutesConfig: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    children: globalRoutes
      .map(createRoute)
      .filter((route): route is RouteObject => route !== null),
  },
];
