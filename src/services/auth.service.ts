/**
 * Authentication Service
 * 
 * خدمات المصادقة والتحقق
 */

import { API_BASE } from '../storeApi/config/constants';

export interface SendVerificationCodeRequest {
  phone: string;
  type?: string;
}

export interface SendVerificationCodeResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface VerifyRegistrationCodeRequest {
  phone: string;
  code: string;
}

export interface VerifyRegistrationCodeResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface RegisterRequest {
  phone: string;
  code: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface CompleteRegistrationRequest {
  phone: string;
  tempToken: string;
  name: string;
  email?: string;
  birthDate?: string;
  gender?: string;
}

export interface CompleteRegistrationResponse {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * إرسال كود التحقق
 */
export const sendVerificationCode = async (data: SendVerificationCodeRequest): Promise<SendVerificationCodeResponse> => {
  try {
    const response = await fetch(`${API_BASE}/send-verification-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        phone: data.phone,
        ...(data.type && { type: data.type }),
      }),
    });

    // التحقق من نوع المحتوى
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      return {
        success: false,
        message: 'استجابة غير صحيحة من الخادم',
      };
    }

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || result.error || 'حدث خطأ أثناء التسجيل',
        data: result,
      };
    }

    return {
      success: true,
      message: result.message || 'تم إرسال كود التحقق بنجاح',
      data: result,
    };
  } catch (error) {
    console.error('Send verification code error:', error);
    
    // معالجة أخطاء JSON parsing
    if (error instanceof SyntaxError) {
      return {
        success: false,
        message: 'استجابة غير صحيحة من الخادم. يرجى التحقق من الـ endpoint',
      };
    }
    
    return {
      success: false,
      message: 'حدث خطأ في الاتصال بالخادم',
    };
  }
};

/**
 * التحقق من كود التسجيل (OTP)
 */
export const verifyRegistrationCode = async (data: VerifyRegistrationCodeRequest): Promise<VerifyRegistrationCodeResponse> => {
  try {
    const response = await fetch(`${API_BASE}/verify-registration-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        phone: data.phone,
        code: data.code,
      }),
    });

    // التحقق من نوع المحتوى
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      return {
        success: false,
        message: 'استجابة غير صحيحة من الخادم',
      };
    }

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || result.error || 'حدث خطأ أثناء التحقق من الكود',
        data: result,
      };
    }

    return {
      success: true,
      message: result.message || 'تم التحقق من الكود بنجاح',
      data: result,
    };
  } catch (error) {
    console.error('Verify registration code error:', error);
    
    // معالجة أخطاء JSON parsing
    if (error instanceof SyntaxError) {
      return {
        success: false,
        message: 'استجابة غير صحيحة من الخادم. يرجى التحقق من الـ endpoint',
      };
    }
    
    return {
      success: false,
      message: 'حدث خطأ في الاتصال بالخادم',
    };
  }
};

/**
 * تسجيل مستخدم جديد (إرسال رقم الهاتف و OTP)
 */
export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        phone: data.phone,
        code: data.code,
      }),
    });

    // التحقق من نوع المحتوى
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      return {
        success: false,
        message: 'استجابة غير صحيحة من الخادم',
      };
    }

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || result.error || 'حدث خطأ أثناء التسجيل',
        data: result,
      };
    }

    return {
      success: true,
      message: result.message || 'تم التسجيل بنجاح',
      data: result,
    };
  } catch (error) {
    console.error('Register error:', error);
    
    // معالجة أخطاء JSON parsing
    if (error instanceof SyntaxError) {
      return {
        success: false,
        message: 'استجابة غير صحيحة من الخادم. يرجى التحقق من الـ endpoint',
      };
    }
    
    return {
      success: false,
      message: 'حدث خطأ في الاتصال بالخادم',
    };
  }
};

/**
 * إكمال بيانات التسجيل (إرسال البيانات الشخصية)
 */
export const completeRegistration = async (data: CompleteRegistrationRequest): Promise<CompleteRegistrationResponse> => {
  try {
    const response = await fetch(`${API_BASE}/complete-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        phone: data.phone,
        temp_token: data.tempToken,
        name: data.name,
        ...(data.email && { email: data.email }),
        ...(data.birthDate && { birth_date: data.birthDate }),
        ...(data.gender && { gender: data.gender }),
      }),
    });

    // التحقق من نوع المحتوى
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      return {
        success: false,
        message: 'استجابة غير صحيحة من الخادم',
      };
    }

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || result.error || 'حدث خطأ أثناء إكمال التسجيل',
        data: result,
      };
    }

    return {
      success: true,
      message: result.message || 'تم إكمال التسجيل بنجاح',
      data: result,
    };
  } catch (error) {
    console.error('Complete registration error:', error);
    
    // معالجة أخطاء JSON parsing
    if (error instanceof SyntaxError) {
      return {
        success: false,
        message: 'استجابة غير صحيحة من الخادم. يرجى التحقق من الـ endpoint',
      };
    }
    
    return {
      success: false,
      message: 'حدث خطأ في الاتصال بالخادم',
    };
  }
};
