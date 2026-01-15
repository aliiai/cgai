/**
 * Auth Store
 * 
 * Zustand store لإدارة حالة المصادقة
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../../types/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User> | User) => void;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) =>
        set(() => ({
          // إنشاء object جديد لضمان أن Zustand يكتشف التغيير
          user: user ? { ...user } : null,
          isAuthenticated: !!user,
        })),

      updateUser: (updates) =>
        set((state) => {
          if (!state.user) {
            // إذا لم يكن هناك user، نستخدم updates كـ user جديد
            return {
              user: updates as User,
              isAuthenticated: !!updates,
            };
          }
          // دمج التحديثات مع البيانات الحالية
          const updatedUser = { ...state.user, ...updates };
          return {
            user: updatedUser,
            isAuthenticated: !!updatedUser,
          };
        }),

      setToken: (token) =>
        set(() => ({
          token,
        })),

      setLoading: (isLoading) =>
        set(() => ({
          isLoading,
        })),

      login: (user, token) => {
        // التحقق من أن token ليس null أو undefined أو فارغ
        if (!token || token === 'null' || token === 'undefined') {
          console.error('Invalid token provided to login:', token);
          console.error('User data:', user);
          return;
        }

        console.log('Login called with token:', token, 'User:', user);

        // تحديث الحالة - Zustand persist سيتولى الحفظ تلقائياً
        set(() => ({
          user,
          token,
          isAuthenticated: true,
        }));
      },

      logout: () => {
        set(() => ({
          user: null,
          token: null,
          isAuthenticated: false,
        }));
        // Zustand persist سيتولى تنظيف localStorage تلقائياً
      },

      clearAuth: () => {
        set(() => ({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }));
        // Zustand persist سيتولى تنظيف localStorage تلقائياً
      },
    }),
    {
      name: 'auth-storage',
      // Zustand persist سيتولى الحفظ تلقائياً عند أي تغيير في الحالة
    }
  )
);
