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

/**
 * الحصول على محتوى التقنيات (أحدث وأفضل التقنيات)
 */
export const getTechnologiesContent = async (locale: string = 'ar'): Promise<TechnologiesContentResponse> => {
  try {
    const response = await axiosInstance.get('/technologies-content', { params: { locale } });
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

