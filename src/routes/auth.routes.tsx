/**
 * Authentication Routes Configuration
 * 
 * Routes الخاصة بالمصادقة والتسجيل
 */

import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import type { PublicRoute as PublicRouteType } from '../types/types';
import PublicRoute from './global.routes';

// Component mapping - Lazy loading
const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  Login: lazy(() => import('../pages/auth/Login')),
  Register: lazy(() => import('../pages/auth/Register')),
  VerifyOTP: lazy(() => import('../pages/auth/VerifyOTP')),
  CompleteRegistration: lazy(() => import('../pages/auth/CompleteRegistration')),
};

// Auth Routes Data
export const authRoutes: PublicRouteType[] = [
  {
    id: 'login',
    name: 'تسجيل الدخول',
    path: '/login',
    component: 'Login',
  },
  {
    id: 'register',
    name: 'إنشاء حساب',
    path: '/register',
    component: 'Register',
  },
  {
    id: 'verify-otp',
    name: 'التحقق من الكود',
    path: '/verify-otp',
    component: 'VerifyOTP',
  },
  {
    id: 'complete-registration',
    name: 'إكمال التسجيل',
    path: '/complete-registration',
    component: 'CompleteRegistration',
  },
];

// Helper Functions
export const getAuthRouteById = (id: string): PublicRouteType | undefined => {
  return authRoutes.find((route) => route.id === id);
};

export const getAuthRouteByPath = (path: string): PublicRouteType | undefined => {
  return authRoutes.find((route) => route.path === path);
};

// Route Objects for React Router
const createRoute = (config: { path: string; component?: string }): RouteObject | null => {
  if (!config.component) return null;

  const Component = componentMap[config.component];
  if (!Component) {
    console.warn(`Component ${config.component} not found in componentMap`);
    return null;
  }

  return {
    path: config.path,
    element: (
      <PublicRoute>
        <Component />
      </PublicRoute>
    ),
  };
};

export const authRoutesConfig: RouteObject[] = authRoutes
  .map(createRoute)
  .filter((route): route is RouteObject => route !== null);





