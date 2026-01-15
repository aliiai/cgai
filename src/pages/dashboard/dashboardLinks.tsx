/**
 * Dashboard Navigation Links
 * 
 * روابط التنقل الخاصة بلوحة تحكم الأدمن
 */

import { dashboardRoutes } from '../../routes';
import {
  Home,
  Users,
  BarChart3,
  Briefcase,
  Calendar,
  Settings,
  Bell,
  Headphones,
  CreditCard,
  CheckCircle,
  BarChart,
  Star,
  History,
  HelpCircle,
  Coins,
  Package,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { DashboardLink } from '../../types/types';

// دالة للحصول على الأيقونة بناءً على الاسم
const getIcon = (iconName?: string): ReactNode => {
  switch (iconName) {
    case 'Home':
      return <Home size={20} />;
    case 'Users':
      return <Users size={20} />;
    case 'BarChart3':
      return <BarChart3 size={20} />;
    case 'Briefcase':
      return <Briefcase size={20} />;
    case 'Calendar':
      return <Calendar size={20} />;
    case 'Settings':
      return <Settings size={20} />;
    case 'Bell':
      return <Bell size={20} />;
    case 'Headphones':
      return <Headphones size={20} />;
    case 'CreditCard':
      return <CreditCard size={20} />;
    case 'CheckCircle':
      return <CheckCircle size={20} />;
    case 'BarChart':
      return <BarChart size={20} />;
    case 'Star':
      return <Star size={20} />;
    case 'History':
      return <History size={20} />;
    case 'HelpCircle':
      return <HelpCircle size={20} />;
    case 'Coins':
      return <Coins size={20} />;
    case 'Package':
      return <Package size={20} />;
    case 'ShoppingBag':
      return <ShoppingBag size={20} />;
    case 'Sparkles':
      return <Sparkles size={20} />;
    default:
      return <Settings size={20} />;
  }
};

// Helper function to get translated name
const getTranslatedName = (routeId: string, t: (key: string) => string): string => {
  const translationMap: Record<string, string> = {
    'admin-dashboard': t('sidebar.dashboard'),
    'admin-sections': t('sidebar.services'),
    'admin-subscriptions': t('sidebar.subscriptions'),
    'admin-bookings': t('sidebar.bookings'),
    'admin-previous-works': t('sidebar.previousWorks'),
    'admin-settings': t('sidebar.settings'),
    'admin-notifications': t('sidebar.notifications'),
    'admin-support': t('sidebar.support'),
    'admin-payments': t('sidebar.payments'),
    'admin-completed-works': t('sidebar.completedWorks'),
    'admin-reports': t('sidebar.reports'),
    'admin-reviews': t('sidebar.reviews'),
    'admin-activity': t('sidebar.activity'),
    'admin-help': t('sidebar.help'),
    'admin-wallet': t('sidebar.wallet'),
    'admin-ready-apps': t('sidebar.readyApps') || 'التطبيقات الجاهزة',
    'admin-my-purchases': t('sidebar.myPurchases') || 'مشترياتي',
    'admin-ai-services': t('sidebar.aiServices') || 'أدوات الذكاء الاصطناعي',
  };

  return translationMap[routeId] || routeId;
};

// الحصول على روابط Dashboard مع أيقوناتها
// يجب استدعاء هذه الدالة من داخل component يستخدم useTranslation
export const getDashboardLinks = (t: (key: string) => string): DashboardLink[] => {
  // صفحات لا يجب أن تظهر في الـ sidebar (صفحات تفاصيل أو صفحات بدون أيقونة)
  const hiddenRoutes = [
    'admin-booking-details',
    'admin-ticket-details',
    'admin-ready-app-details',
  ];

  // تعريف الأقسام
  const sections: Record<string, string> = {
    'admin-dashboard': 'main',
    'admin-sections': 'services',
    'admin-bookings': 'works', // جزء من إدارة الأعمال
    'admin-completed-works': 'works', // جزء من إدارة الأعمال
    'admin-my-purchases': 'works', // جزء من إدارة الأعمال
    'admin-ready-apps': 'ready-apps',
    'admin-ai-services': 'ready-apps',
    'admin-subscriptions': 'subscriptions',
    'admin-payments': 'subscriptions',
    'admin-wallet': 'subscriptions',
    'admin-reviews': 'reports',
    'admin-reports': 'reports',
    'admin-support': 'support',
    'admin-help': 'support',
    'admin-notifications': 'settings',
    'admin-activity': 'settings',
    'admin-settings': 'settings',
  };

  return dashboardRoutes
    .filter(route => !hiddenRoutes.includes(route.id) && route.icon) // تصفية الصفحات المخفية والصفحات بدون أيقونة
    .map((route) => {
      const link: DashboardLink = {
        ...route,
        name: getTranslatedName(route.id, t),
        iconElement: getIcon(route.icon),
        section: sections[route.id] || 'other',
      };

      // لا نضيف children لإدارة الأعمال - الصفحات الفرعية ستظهر كصفحات مستقلة

      // تمييز "التطبيقات الجاهزة" كعنصر مميز
      if (route.id === 'admin-ready-apps') {
        link.isFeatured = true;
      }

      return link;
    });
};
