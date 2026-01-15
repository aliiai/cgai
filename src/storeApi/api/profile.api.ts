/**
 * Profile API
 * 
 * APIs المتعلقة بالملف الشخصي:
 * - تحديث الملف الشخصي
 */

import axios from 'axios';
import { API_BASE } from '../config/constants';
import { getAuthToken } from '../utils/auth.utils';
import { useAuthStore } from '../store/auth.store';
import type { User } from '../../types/types';

/**
 * تحديث الملف الشخصي للمستخدم
 */
export const updateProfile = async (profileData: {
  name?: string;
  phone?: string;
  email?: string;
  gender?: 'male' | 'female';
  date_of_birth?: string;
}): Promise<{ success: boolean; message?: string; data?: User }> => {
  try {
    const token = getAuthToken();
    if (!token || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const response = await axios.put(
      `${API_BASE}/customer/profile`,
      profileData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token.trim()}`
        },
        timeout: 30000,
      }
    );

    console.log('Update profile response:', response.data);

    // استخراج بيانات المستخدم المحدثة من response
    let updatedUser: User | null = null;
    
    // محاولة استخراج البيانات من عدة بنى محتملة
    if (response.data?.data?.user) {
      updatedUser = response.data.data.user;
    } else if (response.data?.user) {
      updatedUser = response.data.user;
    } else if (response.data?.data) {
      // قد تكون البيانات مباشرة في data
      updatedUser = response.data.data;
    } else if (response.data) {
      // قد تكون البيانات مباشرة في response.data
      updatedUser = response.data;
    }

    // إذا لم نجد user، ندمج البيانات المحدثة مع بيانات المستخدم الحالية
    if (!updatedUser) {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) {
        return {
          success: false,
          message: 'لا يمكن تحديث الملف الشخصي - المستخدم غير موجود'
        };
      }
      updatedUser = {
        ...currentUser,
        ...profileData,
        birth_date: profileData.date_of_birth || currentUser.birth_date,
      } as User;
    }

    // تحديث بيانات المستخدم في الـ store
    // Zustand persist سيتولى الحفظ في localStorage تلقائياً
    if (updatedUser) {
      console.log('Updating user in store:', updatedUser);
      
      // دمج البيانات المحدثة مع البيانات الحالية للتأكد من عدم فقدان أي بيانات
      const currentUser = useAuthStore.getState().user;
      
      // إنشاء object جديد تماماً لضمان أن Zustand يكتشف التغيير
      const mergedUser: User = {
        ...currentUser,
        ...updatedUser,
        // التأكد من أن birth_date محدث
        birth_date: updatedUser.birth_date || updatedUser.date_of_birth || currentUser?.birth_date,
        date_of_birth: updatedUser.date_of_birth || updatedUser.birth_date || currentUser?.date_of_birth,
      };

      // تحديث الـ store - Zustand persist سيتولى الحفظ تلقائياً
      // استخدام setUser مباشرة لضمان تحديث جميع المكونات
      useAuthStore.getState().setUser({ ...mergedUser });
      
      console.log('User updated in store successfully');
      
      // إرجاع المستخدم المدمج
      updatedUser = mergedUser;
    }

    return {
      success: true,
      message: response.data?.message || 'تم تحديث الملف الشخصي بنجاح',
      data: updatedUser || undefined,
    };
  } catch (error: any) {
    console.error('Update profile error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في تحديث الملف الشخصي',
    };
  }
};
