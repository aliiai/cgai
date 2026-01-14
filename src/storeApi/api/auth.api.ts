/**
 * Authentication API
 * 
 * APIs المتعلقة بالمصادقة:
 * - إرسال كود التحقق
 * - التحقق من كود التسجيل/الدخول
 * - إكمال التسجيل
 * - تسجيل الخروج
 */

import { axiosInstance } from '../config/axios';
import type {
  SendVerificationCodeRequest,
  SendVerificationCodeResponse,
  VerifyRegistrationCodeRequest,
  VerifyRegistrationCodeResponse,
  VerifyLoginCodeRequest,
  VerifyLoginCodeResponse,
  CompleteRegistrationRequest,
  CompleteRegistrationResponse,
} from '../../types/types';

/**
 * إرسال كود التحقق
 */
export const sendVerificationCode = async (
  data: SendVerificationCodeRequest
): Promise<SendVerificationCodeResponse> => {
  try {
    const response = await axiosInstance.post<SendVerificationCodeResponse>(
      '/send-verification-code',
      {
        phone: data.phone,
        ...(data.type && { type: data.type }),
      }
    );

    return {
      success: true,
      message: response.data.message || 'تم إرسال كود التحقق بنجاح',
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Send verification code error:', error);
    return {
      success: false,
      message: error.response?.data?.message ||
        error.response?.data?.error ||
        'حدث خطأ أثناء إرسال كود التحقق',
      data: error.response?.data,
    };
  }
};

/**
 * التحقق من كود التسجيل (OTP)
 */
export const verifyRegistrationCode = async (
  data: VerifyRegistrationCodeRequest
): Promise<VerifyRegistrationCodeResponse> => {
  try {
    const response = await axiosInstance.post<any>(
      '/verify-registration-code',
      {
        phone: data.phone,
        code: data.code,
      }
    );

    // استخراج temp_token من response.data مباشرة (موجود في الجذر حسب شكل البيانات المقدم)
    // الشكل: { success: true, message: "...", temp_token: "...", next_step: "..." }
    const tempToken = response.data?.temp_token;

    console.log('API Response:', response.data);
    console.log('Extracted temp_token:', tempToken);

    return {
      success: true,
      message: response.data.message || 'تم التحقق من الكود بنجاح',
      data: {
        temp_token: tempToken,
        ...(response.data.data || {}),
      },
    };
  } catch (error: any) {
    console.error('Verify registration code error:', error);
    return {
      success: false,
      message: error.response?.data?.message ||
        error.response?.data?.error ||
        'حدث خطأ أثناء التحقق من الكود',
      data: error.response?.data,
    };
  }
};

/**
 * التحقق من كود تسجيل الدخول (OTP)
 */
export const verifyLoginCode = async (
  data: VerifyLoginCodeRequest
): Promise<VerifyLoginCodeResponse> => {
  try {
    const response = await axiosInstance.post<any>(
      '/login',
      {
        phone: data.phone,
        code: data.code,
      }
    );

    console.log('Login API Response:', response.data);

    // استخراج token من response.data مباشرة أو من response.data.data
    const token = response.data?.token || response.data?.data?.token;
    const user = response.data?.user || response.data?.data?.user;

    console.log('Extracted token:', token);
    console.log('Extracted user:', user);

    return {
      success: true,
      message: response.data.message || 'تم تسجيل الدخول بنجاح',
      data: {
        token: token,
        user: user,
        ...(response.data.data || {}),
      },
    };
  } catch (error: any) {
    console.error('Verify login code error:', error);
    return {
      success: false,
      message: error.response?.data?.message ||
        error.response?.data?.error ||
        'حدث خطأ أثناء تسجيل الدخول',
      data: error.response?.data,
    };
  }
};

/**
 * تسجيل الخروج
 */
export const logout = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await axiosInstance.post('/logout');
    return {
      success: true,
      message: response.data.message || 'تم تسجيل الخروج بنجاح',
    };
  } catch (error: any) {
    console.error('Logout error:', error);
    // حتى لو فشل الطلب، نعيد success: true لأننا سنمسح البيانات المحلية على أي حال
    return {
      success: true,
      message: error.response?.data?.message || 'تم تسجيل الخروج',
    };
  }
};

/**
 * إكمال بيانات التسجيل
 */
export const completeRegistration = async (
  data: CompleteRegistrationRequest
): Promise<CompleteRegistrationResponse> => {
  try {
    const response = await axiosInstance.post<any>(
      '/complete-registration',
      {
        phone: data.phone,
        temp_token: data.temp_token,
        name: data.name,
        ...(data.email && { email: data.email }),
        ...(data.birth_date && { birth_date: data.birth_date }),
        ...(data.gender && { gender: data.gender }),
      }
    );

    console.log('Complete Registration API Response:', response.data);

    // استخراج token و user من response.data مباشرة أو من response.data.data
    const token = response.data?.token || response.data?.data?.token;
    const user = response.data?.user || response.data?.data?.user;

    console.log('Extracted token from complete registration:', token);
    console.log('Extracted user from complete registration:', user);

    return {
      success: true,
      message: response.data.message || 'تم إكمال التسجيل بنجاح',
      data: {
        token: token,
        user: user,
        ...(response.data.data || {}),
      },
    };
  } catch (error: any) {
    console.error('Complete registration error:', error);
    return {
      success: false,
      message: error.response?.data?.message ||
        error.response?.data?.error ||
        'حدث خطأ أثناء إكمال التسجيل',
      data: error.response?.data,
    };
  }
};

