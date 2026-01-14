import type { NavLink, NavRoute } from '../types/types';

// Re-export for backward compatibility
export type { NavLink, NavRoute };

// روابط التنقل الرئيسية
export const navigationLinks: NavLink[] = [
  {
    id: 'home',
    label: 'الرئيسية',
    path: '/',
    sectionId: 'hero',
    hasDropdown: false,
  },
  {
    id: 'services',
    label: 'خدماتنا',
    path: '/#services',
    sectionId: 'services',
    hasDropdown: true,
  },
  {
    id: 'how-it-works',
    label: 'كيف يعمل',
    path: '/#how-it-works',
    sectionId: 'how-it-works',
    hasDropdown: false,
  },
  {
    id: 'why-choose-us',
    label: 'لماذا نحن',
    path: '/#why-choose-us',
    sectionId: 'why-choose-us',
    hasDropdown: false,
  },
  {
    id: 'testimonials',
    label: 'شهادات العملاء',
    path: '/#testimonials',
    sectionId: 'testimonials',
    hasDropdown: false,
  },
  {
    id: 'pricing',
    label: 'الأسعار',
    path: '/#pricing',
    sectionId: 'pricing',
    hasDropdown: false,
  },
  {
    id: 'faq',
    label: 'الأسئلة الشائعة',
    path: '/#faq',
    sectionId: 'faq',
    hasDropdown: false,
  },
];

// Routes للأقسام
export const sectionRoutes: NavRoute[] = [
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
    id: 'how-it-works',
    name: 'كيف يعمل',
    path: '/#how-it-works',
    sectionId: 'how-it-works',
  },
  {
    id: 'why-choose-us',
    name: 'لماذا نحن',
    path: '/#why-choose-us',
    sectionId: 'why-choose-us',
  },
  {
    id: 'testimonials',
    name: 'شهادات العملاء',
    path: '/#testimonials',
    sectionId: 'testimonials',
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
];

// دالة للانتقال إلى section محدد
export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// دالة للحصول على route من section ID
export const getRouteBySectionId = (sectionId: string): NavRoute | undefined => {
  return sectionRoutes.find((route) => route.sectionId === sectionId);
};

// دالة للحصول على section ID من path
export const getSectionIdFromPath = (path: string): string | null => {
  const hash = path.split('#')[1];
  return hash || null;
};

