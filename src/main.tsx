import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './config/i18n' // Initialize i18n
import App from './App.tsx'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// التأكد من إزالة class "dark" من documentElement (سنستخدم conditional classes)
if (document.documentElement.classList.contains('dark')) {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
