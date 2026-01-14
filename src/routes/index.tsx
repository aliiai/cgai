/**
 * Routes Configuration - Main Entry Point
 * 
 * ملف موحد يجمع جميع الـ routes
 * - Public/Global Routes: الصفحة الرئيسية
 * - Auth Routes: صفحات المصادقة
 * - Dashboard Routes: لوحة التحكم (محمية)
 */

import type { RouteObject } from 'react-router-dom';
import { globalRoutesConfig } from './global.routes';
import { authRoutesConfig } from './auth.routes';
import { dashboardRoutesConfig } from './dashboard.routes';

// Re-export specific helpers
export {
  globalRoutes,
  homeSectionRoutes,
  getGlobalRouteById as getPublicRouteById,
  getGlobalRouteByPath as getPublicRouteByPath,
  getGlobalRouteBySectionId as getPublicRouteBySectionId,
} from './global.routes';

export {
  authRoutes,
  getAuthRouteById,
  getAuthRouteByPath
} from './auth.routes';

export {
  dashboardRoutes,
  getDashboardRouteById,
  getDashboardRouteByPath,
  hasAccess,
  getAccessibleRoutes,
  // Backward compatibility alias
  adminRoutes,
  getAdminRouteById,
  getAdminRouteByPath,
  adminRoutesConfig
} from './dashboard.routes';

// Aliases for compatibility with old code
export const publicRoutesConfig = [...globalRoutesConfig, ...authRoutesConfig];
import { globalRoutes } from './global.routes';
import { authRoutes } from './auth.routes';
export const publicRoutes = [...globalRoutes, ...authRoutes];

// All Routes combined for React Router
export const allRoutes: RouteObject[] = [
  ...globalRoutesConfig,
  ...authRoutesConfig,
  ...dashboardRoutesConfig,
];

// Default export
export default allRoutes;
