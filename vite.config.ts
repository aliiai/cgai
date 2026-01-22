import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // السماح بالوصول من الشبكة المحلية
    port: 5173, // يمكنك تغيير المنفذ إذا أردت
    proxy: {
      '/api': {
        target: 'https://dsai.sa/backend',
        // target: 'http://192.168.1.128:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
