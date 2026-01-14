/**
 * Theme Store
 * 
 * Zustand store لإدارة حالة الوضع الداكن (Dark Mode)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false, // الوضع الافتراضي: light

      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = !state.isDarkMode;
          // لا نضيف class "dark" على documentElement - سنستخدم conditional classes
          return { isDarkMode: newDarkMode };
        });
      },

      setDarkMode: (isDark: boolean) => {
        set(() => {
          // لا نضيف class "dark" على documentElement - سنستخدم conditional classes
          return { isDarkMode: isDark };
        });
      },
    }),
    {
      name: 'theme-storage',
      // لا نضيف class "dark" عند تحميل الحالة - سنستخدم conditional classes
    }
  )
);

