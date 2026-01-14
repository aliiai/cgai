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

