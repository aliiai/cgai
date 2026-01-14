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
      updatedUser = {
        ...currentUser,
        ...profileData,
        birth_date: profileData.date_of_birth || currentUser?.birth_date,
      } as User;
    }

    // تحديث بيانات المستخدم في الـ store
    if (updatedUser) {
      console.log('Updating user in store:', updatedUser);
      
      // دمج البيانات المحدثة مع البيانات الحالية
      const currentUser = useAuthStore.getState().user;
      const mergedUser = {
        ...currentUser,
        ...updatedUser,
        // التأكد من أن birth_date محدث
        birth_date: updatedUser.birth_date || updatedUser.date_of_birth || currentUser?.birth_date,
      };

      // تحديث الـ store باستخدام updateUser action
      const store = useAuthStore.getState();
      if (store.updateUser) {
        // حساب التحديثات فقط (الحقول التي تغيرت)
        const updates: Partial<User> = {};
        if (mergedUser.name !== currentUser?.name) updates.name = mergedUser.name;
        if (mergedUser.phone !== currentUser?.phone) updates.phone = mergedUser.phone;
        if (mergedUser.email !== currentUser?.email) updates.email = mergedUser.email;
        if (mergedUser.gender !== currentUser?.gender) updates.gender = mergedUser.gender;
        if (mergedUser.birth_date !== currentUser?.birth_date) updates.birth_date = mergedUser.birth_date;
        
        // تحديث جميع الحقول
        store.updateUser(mergedUser);
      } else {
        // Fallback: استخدام setState مباشرة
        useAuthStore.setState({
          user: mergedUser,
          isAuthenticated: true,
        });
      }
      
      // انتظار حتى يقوم Zustand بحفظ البيانات في localStorage
      await new Promise(resolve => setTimeout(resolve, 200));

      // تحديث localStorage يدوياً للتأكد من الحفظ
      try {
        // قراءة الحالة الحالية من الـ store (بعد التحديث)
        const currentState = useAuthStore.getState();
        const finalUser = currentState.user || mergedUser;
        
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const authData = JSON.parse(authStorage);
          if (authData.state) {
            authData.state.user = finalUser;
            authData.state.isAuthenticated = true;
            localStorage.setItem('auth-storage', JSON.stringify(authData));
            console.log('Updated auth-storage:', finalUser);
          }
        } else {
          // إنشاء auth-storage جديد
          const token = currentState.token || getAuthToken();
          localStorage.setItem('auth-storage', JSON.stringify({
            state: {
              user: finalUser,
              token: token,
              isAuthenticated: true,
              isLoading: false,
            },
            version: 0,
          }));
        }
        
        // تحديث user-data كنسخة احتياطية
        localStorage.setItem('user-data', JSON.stringify(finalUser));
        console.log('Updated user-data:', finalUser);
        
        // إرجاع المستخدم النهائي
        updatedUser = finalUser;
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }

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

