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
  updateUser: (updates: Partial<User>) => void;
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
          user,
          isAuthenticated: !!user,
        })),

      updateUser: (updates) =>
        set((state) => {
          if (!state.user) return state;
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

        // تحديث الحالة أولاً
        set(() => ({
          user,
          token,
          isAuthenticated: true,
        }));

        // حفظ البيانات في localStorage بشكل صريح بعد تحديث الحالة
        setTimeout(() => {
          try {
            const authData = {
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              timestamp: new Date().toISOString(),
            };

            // حفظ في localStorage بنفس البنية التي يستخدمها Zustand persist
            localStorage.setItem('auth-storage', JSON.stringify({
              state: authData,
              version: 0,
            }));

            // حفظ إضافي في مفاتيح منفصلة للتأكد
            localStorage.setItem('user-data', JSON.stringify(user));
            localStorage.setItem('auth-token', token);
            localStorage.setItem('is-authenticated', 'true');
            localStorage.setItem('login-timestamp', new Date().toISOString());

            console.log('Data saved to localStorage:', { user, token });

            // التحقق من الحفظ
            const savedToken = localStorage.getItem('auth-token');
            if (!savedToken || savedToken === 'null') {
              console.error('Token was not saved correctly! Saved value:', savedToken);
            } else {
              console.log('Token verified in localStorage:', savedToken);
            }
          } catch (error) {
            console.error('Error saving to localStorage:', error);
          }
        }, 100);
      },

      logout: () => {
        // تنظيف localStorage بشكل كامل
        try {
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('user-data');
          localStorage.removeItem('auth-token');
          localStorage.removeItem('is-authenticated');
          localStorage.removeItem('login-timestamp');
        } catch (error) {
          console.error('Error clearing localStorage:', error);
        }
        
        set(() => ({
          user: null,
          token: null,
          isAuthenticated: false,
        }));
      },

      clearAuth: () => {
        // تنظيف localStorage بشكل كامل
        try {
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('user-data');
          localStorage.removeItem('auth-token');
          localStorage.removeItem('is-authenticated');
          localStorage.removeItem('login-timestamp');
        } catch (error) {
          console.error('Error clearing localStorage:', error);
        }
        
        set(() => ({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }));
      },
    }),
    {
      name: 'auth-storage',
      // التأكد من أن persist يحفظ التغييرات فوراً
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
      }),
    }
  )
);

