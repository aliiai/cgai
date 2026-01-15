/**
 * Dashboard Routes Configuration
 * 
 * Routes الخاصة بلوحة التحكم (محمية)
 */

import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import type { AdminRoute } from '../types/types';
import ProtectedRoute from './protected.routes';
import DashboardLayout from '../layouts/DashboardLayout';

// Component mapping - Lazy loading
const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  Dashboard: lazy(() => import('../pages/dashboard/Dashboard')),
  Sections: lazy(() => import('../pages/dashboard/Sections')),
  Bookings: lazy(() => import('../pages/dashboard/Bookings')),
  BookingDetails: lazy(() => import('../pages/dashboard/BookingDetails')),
  CompletedWorks: lazy(() => import('../pages/dashboard/CompletedWorks')),
  PreviousWorks: lazy(() => import('../pages/dashboard/PreviousWorks')),
  Payments: lazy(() => import('../pages/dashboard/Payments')),
  Reports: lazy(() => import('../pages/dashboard/Reports')),
  Reviews: lazy(() => import('../pages/dashboard/Reviews')),
  ActivityLog: lazy(() => import('../pages/dashboard/ActivityLog')),
  Help: lazy(() => import('../pages/dashboard/Help')),
  Settings: lazy(() => import('../pages/dashboard/Settings')),
  Notifications: lazy(() => import('../pages/dashboard/Notifications')),
  Support: lazy(() => import('../pages/dashboard/Support')),
  TicketDetails: lazy(() => import('../pages/dashboard/TicketDetails')),
  Subscriptions: lazy(() => import('../pages/dashboard/Subscriptions')),
  Wallet: lazy(() => import('../pages/dashboard/Wallet')),
  ReadyApps: lazy(() => import('../pages/dashboard/ReadyApps')),
  ReadyAppDetails: lazy(() => import('../pages/dashboard/ReadyAppDetails')),
  MyPurchases: lazy(() => import('../pages/dashboard/MyPurchases')),
  AIServices: lazy(() => import('../pages/dashboard/AIServices')),
  AIServiceDetails: lazy(() => import('../pages/dashboard/AIServiceDetails')),
};

// Dashboard Routes Data - مرتبة حسب الأولوية
export const dashboardRoutes: AdminRoute[] = [
  // 1. الصفحة الرئيسية
  {
    id: 'admin-dashboard',
    name: 'لوحة التحكم',
    path: '/admin/dashboard',
    component: 'Dashboard',
    icon: 'Home',
    requiresAuth: true,
  },
  
  // 2. الخدمات والحجوزات
  {
    id: 'admin-sections',
    name: 'الخدمات',
    path: '/admin/sections',
    component: 'Sections',
    icon: 'Briefcase',
    requiresAuth: true,
  },
  {
    id: 'admin-bookings',
    name: 'حجوزاتي',
    path: '/admin/bookings',
    component: 'Bookings',
    icon: 'Calendar',
    requiresAuth: true,
  },
  {
    id: 'admin-booking-details',
    name: 'تفاصيل الحجز',
    path: '/admin/bookings/:id',
    component: 'BookingDetails',
    requiresAuth: true,
  },
  
  // 3. إدارة الأعمال
  {
    id: 'admin-completed-works',
    name: 'الأعمال المكتملة',
    path: '/admin/completed-works',
    component: 'CompletedWorks',
    icon: 'CheckCircle',
    requiresAuth: true,
  },
//   {
//     id: 'admin-previous-works',
//     name: 'أعمالي السابقة',
//     path: '/admin/previous-works',
//     component: 'PreviousWorks',
//     icon: 'History',
//     requiresAuth: true,
//   },
  
  // 4. التطبيقات الجاهزة والمشتريات
  {
    id: 'admin-ready-apps',
    name: 'التطبيقات الجاهزة',
    path: '/admin/ready-apps',
    component: 'ReadyApps',
    icon: 'Package',
    requiresAuth: true,
  },
  {
    id: 'admin-ai-services',
    name: 'أدوات الذكاء الاصطناعي',
    path: '/admin/ai-services',
    component: 'AIServices',
    icon: 'Sparkles',
    requiresAuth: true,
  },
  {
    id: 'admin-ai-service-details',
    name: 'تفاصيل خدمة الذكاء الاصطناعي',
    path: '/admin/ai-services/:id',
    component: 'AIServiceDetails',
    requiresAuth: true,
  },
  {
    id: 'admin-ready-app-details',
    name: 'تفاصيل التطبيق',
    path: '/admin/ready-apps/:id',
    component: 'ReadyAppDetails',
    requiresAuth: true,
  },
  {
    id: 'admin-my-purchases',
    name: 'مشترياتي',
    path: '/admin/my-purchases',
    component: 'MyPurchases',
    icon: 'ShoppingBag',
    requiresAuth: true,
  },
  
  // 5. الاشتراكات والمدفوعات
  {
    id: 'admin-subscriptions',
    name: 'الاشتراكات',
    path: '/admin/subscriptions',
    component: 'Subscriptions',
    icon: 'BarChart3',
    requiresAuth: true,
  },
  {
    id: 'admin-payments',
    name: 'الفواتير والمدفوعات',
    path: '/admin/payments',
    component: 'Payments',
    icon: 'CreditCard',
    requiresAuth: true,
  },
  {
    id: 'admin-wallet',
    name: 'المحفظة',
    path: '/admin/wallet',
    component: 'Wallet',
    icon: 'Coins',
    requiresAuth: true,
  },
  
  // 6. المراجعات والتقارير
  {
    id: 'admin-reviews',
    name: 'المراجعات والتقييمات',
    path: '/admin/reviews',
    component: 'Reviews',
    icon: 'Star',
    requiresAuth: true,
  },
  {
    id: 'admin-reports',
    name: 'التقارير والإحصائيات',
    path: '/admin/reports',
    component: 'Reports',
    icon: 'BarChart',
    requiresAuth: true,
  },
  
  // 7. الدعم والمساعدة
  {
    id: 'admin-support',
    name: 'التذاكر والدعم',
    path: '/admin/support',
    component: 'Support',
    icon: 'Headphones',
    requiresAuth: true,
  },
  {
    id: 'admin-ticket-details',
    name: 'تفاصيل التذكرة',
    path: '/admin/support/:id',
    component: 'TicketDetails',
    requiresAuth: true,
  },
  {
    id: 'admin-help',
    name: 'المساعدة والدليل',
    path: '/admin/help',
    component: 'Help',
    icon: 'HelpCircle',
    requiresAuth: true,
  },
  
  // 8. الإشعارات والإعدادات
  {
    id: 'admin-notifications',
    name: 'التنبيهات',
    path: '/admin/notifications',
    component: 'Notifications',
    icon: 'Bell',
    requiresAuth: true,
  },
  {
    id: 'admin-activity',
    name: 'سجل النشاطات',
    path: '/admin/activity',
    component: 'ActivityLog',
    icon: 'History',
    requiresAuth: true,
  },
  {
    id: 'admin-settings',
    name: 'إعدادات الحساب',
    path: '/admin/settings',
    component: 'Settings',
    icon: 'Settings',
    requiresAuth: true,
  },
];

// Helper Functions
export const getDashboardRouteById = (id: string): AdminRoute | undefined => {
  return dashboardRoutes.find((route) => route.id === id);
};

export const getDashboardRouteByPath = (path: string): AdminRoute | undefined => {
  return dashboardRoutes.find((route) => route.path === path);
};

// Check if user has access to a route
export const hasAccess = (route: AdminRoute, userRoles?: string[]): boolean => {
  if (!route.requiresAuth) return true;
  if (!route.roles || route.roles.length === 0) return true;
  if (!userRoles || userRoles.length === 0) return false;
  return route.roles.some(role => userRoles.includes(role));
};

// Get accessible routes for user
export const getAccessibleRoutes = (userRoles?: string[]): AdminRoute[] => {
  return dashboardRoutes.filter(route => hasAccess(route, userRoles));
};

// Backward compatibility aliases
export const adminRoutes = dashboardRoutes;
export const getAdminRouteById = getDashboardRouteById;
export const getAdminRouteByPath = getDashboardRouteByPath;

// Route Objects for React Router
const createRoute = (config: { path: string; component?: string }): RouteObject | null => {
  if (!config.component) return null;

  const Component = componentMap[config.component];
  if (!Component) {
    console.warn(`Component ${config.component} not found in componentMap`);
    return null;
  }

  // Remove /admin prefix for child routes and ensure it's a relative path (no leading slash)
  let childPath = config.path.replace('/admin', '');
  // Remove leading slash to make it relative
  if (childPath.startsWith('/')) {
    childPath = childPath.substring(1);
  }
  // If empty after removal, use 'dashboard' as default
  if (!childPath) {
    childPath = 'dashboard';
  }

  return {
    path: childPath,
    element: <Component />,
  };
};

// Create routes config with DashboardLayout wrapper
export const dashboardRoutesConfig: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: dashboardRoutes
      .map(createRoute)
      .filter((route): route is RouteObject => route !== null),
  },
];

// Backward compatibility
export const adminRoutesConfig = dashboardRoutesConfig;

