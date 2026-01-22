/**
 * Home API
 * 
 * APIs المتعلقة بصفحة الـ Home:
 * - الحصول على بيانات Hero Section
 */

import { axiosInstance } from '../config/axios';

export interface HeroButton {
  title: string;
  link: string;
  target: '_self' | '_blank';
  style: 'primary' | 'secondary';
}

export interface HeroData {
  id: number;
  heading: string;
  subheading: string;
  description: string;
  background_image: string;
  buttons: HeroButton[];
}

export interface HeroResponse {
  success: boolean;
  data?: HeroData;
  message?: string;
}

export const getHero = async (): Promise<HeroResponse> => {
  try {
    const response = await axiosInstance.get('/hero');
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Get Hero error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب بيانات Hero Section',
      data: undefined,
    };
  }
};

export interface CompanyLogo {
  image: string;
  link: string;
  name: string;
}

export interface CompanyLogosData {
  id: number;
  heading: string;
  logos: CompanyLogo[];
}

export interface CompanyLogosResponse {
  success: boolean;
  data?: CompanyLogosData;
  message?: string;
}

/**
 * الحصول على بيانات شعارات الشركاء
 */
export const getCompanyLogos = async (): Promise<CompanyLogosResponse> => {
  try {
    const response = await axiosInstance.get('/company-logo');
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Get Company Logos error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب بيانات شعارات الشركاء',
      data: undefined,
    };
  }
};

export interface ConsultationBookingButton {
  title: string;
  link: string;
  target: '_self' | '_blank';
  style: 'primary' | 'secondary';
}

export interface ConsultationBookingData {
  id: number;
  heading: string;
  description: string;
  background_image: string;
  buttons: ConsultationBookingButton[];
}

export interface ConsultationBookingResponse {
  success: boolean;
  data?: ConsultationBookingData;
  message?: string;
}

/**
 * الحصول على بيانات Consultation Booking Section
 */
export const getConsultationBooking = async (): Promise<ConsultationBookingResponse> => {
  try {
    const response = await axiosInstance.get('/consultation-booking-section');
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Get Consultation Booking error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب بيانات Consultation Booking Section',
      data: undefined,
    };
  }
};

export interface TechnologiesSectionButton {
  title: string;
  link: string;
  target: '_self' | '_blank';
  style: 'primary' | 'secondary';
}

export interface TechnologiesSectionData {
  id: number;
  heading: string;
  description: string;
  background_image: string;
  buttons: TechnologiesSectionButton[];
}

export interface TechnologiesSectionResponse {
  success: boolean;
  data?: TechnologiesSectionData;
  message?: string;
}

/**
 * الحصول على بيانات Technologies Section
 */
export const getTechnologiesSection = async (): Promise<TechnologiesSectionResponse> => {
  try {
    const response = await axiosInstance.get('/technologies-section');
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Get Technologies Section error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب بيانات Technologies Section',
      data: undefined,
    };
  }
};

export interface AIServicesCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
  active_services_count?: number;
}

export interface AIService {
  id: number;
  name: string;
  short_description: string;
  main_image: string;
  website_url?: string | null;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  is_free: boolean;
  is_favorite: boolean;
  rating: number;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

export interface AIServicesData {
  services: AIService[];
  pagination: Pagination;
  categories: AIServicesCategory[];
  popular_tags: string[];
}

export interface AIServicesResponse {
  success: boolean;
  data?: AIServicesData;
  message?: string;
}

/**
 * الحصول على خدمات الذكاء الاصطناعي
 */
export const getAIServices = async (params?: {
  page?: number;
  per_page?: number;
  is_free?: boolean;
  search?: string;
  category?: string;
  locale?: string;
}): Promise<AIServicesResponse> => {
  try {
    const response = await axiosInstance.get('/customer/ai-services', { params: { ...params, locale: params?.locale || 'ar' } });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('Get AI Services error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب خدمات الذكاء الاصطناعي',
      data: undefined,
    };
  }
};

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface ServicesSectionData {
  id: number;
  heading: string;
  description: string;
  categories: ServiceCategory[];
}

export interface ServicesSectionResponse {
  success: boolean;
  data?: ServicesSectionData;
  message?: string;
}

/**
 * الحصول على بيانات قسم الخدمات
 */
export const getServicesSection = async (locale: string = 'ar'): Promise<ServicesSectionResponse> => {
  try {
    const response = await axiosInstance.get('/services-section', { params: { locale } });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('Get Services Section error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب بيانات قسم الخدمات',
      data: undefined,
    };
  }
};

export interface FooterLink {
  title: string;
  link: string;
}

export interface SocialMedia {
  platform: string;
  url: string;
  icon: string;
}

export interface FooterData {
  id: number;
  logo: string;
  description: string;
  email: string;
  phone: string;
  working_hours: string;
  quick_links: FooterLink[];
  content_links: FooterLink[];
  support_links: FooterLink[];
  social_media: SocialMedia[];
  copyright_text: string;
}

export interface FooterResponse {
  success: boolean;
  data?: FooterData;
  message?: string;
}

/**
 * الحصول على بيانات الـ Footer
 */
export const getFooter = async (locale: string = 'ar'): Promise<FooterResponse> => {
  try {
    const response = await axiosInstance.get('/footer', { params: { locale } });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('Get Footer error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب بيانات الـ Footer',
      data: undefined,
    };
  }
};

export interface ReadyAppCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface ReadyAppsSectionData {
  id: number;
  heading: string;
  description: string;
  categories: ReadyAppCategory[];
}

export interface ReadyAppsSectionResponse {
  success: boolean;
  data?: ReadyAppsSectionData;
  message?: string;
}

/**
 * الحصول على بيانات قسم التطبيقات الجاهزة
 */
export const getReadyAppsSection = async (locale: string = 'ar'): Promise<ReadyAppsSectionResponse> => {
  try {
    const response = await axiosInstance.get('/ready-apps-section', { params: { locale } });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('Get Ready Apps Section error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب بيانات قسم التطبيقات الجاهزة',
      data: undefined,
    };
  }
};

export interface Technology {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

export interface TechnologiesContentData {
  latest_technologies: Technology[];
  best_technologies_of_month: Technology[];
}

export interface TechnologiesContentResponse {
  success: boolean;
  data?: TechnologiesContentData;
  message?: string;
}

// ----------------------------------------------------------------------
// Subscriptions API
// ----------------------------------------------------------------------

export interface Subscription {
  id: number;
  name: string;
  description: string;
  features: string[];
  price: string;
  duration_type: 'month' | 'year';
  max_debtors: number;
  max_messages: number;
  ai_enabled: boolean;
  is_active: boolean;
  is_pro: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionsData {
  subscriptions: Subscription[];
  active_subscription: any | null;
  pending_request: any | null;
}

export interface SubscriptionsResponse {
  success: boolean;
  data?: SubscriptionsData;
  message?: string;
}

/**
 * الحصول على بيانات الاشتراكات المتاحة
 */
export const getSubscriptions = async (locale: string = 'ar'): Promise<SubscriptionsResponse> => {
  try {
    const response = await axiosInstance.get('/subscriptions', { params: { locale } });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('Get Subscriptions error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب بيانات الاشتراكات',
      data: undefined,
    };
  }
};

// ----------------------------------------------------------------------
// Technologies Content API
// ----------------------------------------------------------------------

export interface TechnologyCategory {
  id: number;
  name: string;
}

export interface TechnologyContent {
  id: number;
  name: string;
  description: string;
  short_description: string;
  price: number;
  original_price: number;
  image: string | null;
  images: string[];
  category: TechnologyCategory;
  rating: number;
  reviews_count: number;
  purchases_count: number;
  is_featured: boolean;
  is_latest: boolean;
  is_best_of_month: boolean;
  slug: string;
}

export interface TechnologiesContentData {
  latest_technologies: TechnologyContent[];
  best_technologies_of_month: TechnologyContent[];
}

export interface TechnologiesContentResponse {
  success: boolean;
  data?: TechnologiesContentData;
  message?: string;
}

/**
 * الحصول على محتوى التقنيات (لصفحة الأخبار)
 */
export const getTechnologiesContent = async (locale: string = 'ar'): Promise<TechnologiesContentResponse> => {
  try {
    const response = await axiosInstance.get('/customer/ai-content/technologies', { params: { locale } });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('Get Technologies Content error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب محتوى التقنيات',
      data: undefined,
    };
  }
};

// ----------------------------------------------------------------------
// Services API (for Discover Services page)
// ----------------------------------------------------------------------

export interface ServiceSubCategory {
  id: number;
  category_id: number;
  name_en: string;
  slug: string;
  description_en: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name_en: string;
    slug: string;
    description_en: string;
    image: string;
    icon: string | null;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface ServiceItem {
  id: number;
  sub_category_id: number;
  name_en: string;
  slug: string;
  description_en: string;
  image?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  price: number;
  sub_category: ServiceSubCategory;
  points_pricing: {
    id: number;
    service_id: number;
    consultation_id: number | null;
    subscription_id: number | null;
    item_type: string;
    points_price: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  points_price: number;
}

export interface ServicesResponse {
  success: boolean;
  data?: ServiceItem[];
  message?: string;
}

/**
 * الحصول على جميع الخدمات
 */
export const getAllServices = async (locale: string = 'en'): Promise<ServicesResponse> => {
  try {
    const response = await axiosInstance.get('/services/services', { params: { locale } });
    return {
      success: true,
      data: response.data.data || [],
      message: response.data.message,
    };
  } catch (error: any) {
    console.error('Get All Services error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب الخدمات',
      data: undefined,
    };
  }
};

