/**
 * FAQs API
 * 
 * APIs المتعلقة بالأسئلة الشائعة
 */

import { axiosInstance } from '../config/axios';

export interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
    is_active: number;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface FAQsResponse {
    success: boolean;
    data: {
        [category: string]: FAQ[];
    };
}

/**
 * الحصول على جميع الأسئلة الشائعة مجمعة حسب الفئة
 */
export const getFAQs = async (): Promise<FAQsResponse> => {
    try {
        const response = await axiosInstance.get('/faqs');
        return {
            success: true,
            data: response.data.data || {},
        };
    } catch (error: any) {
        console.error('Get FAQs error:', error);
        return {
            success: false,
            data: {},
        };
    }
};
