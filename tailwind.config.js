/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['El Messiri', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#FDB103',
          dark: '#d89402',
          light: '#ffc433',
        },
        secondary: {
          DEFAULT: '#00adb5',
          light: '#66d4db',
        },
        accent: '#FDB103',
      },
      spacing: {
        '15': '3.75rem',
      },
      animation: {
        'slideDown': 'slideDown 0.3s ease',
        'fadeInUp': 'fadeInUp 0.8s ease-out',
        'fadeInRight': 'fadeInRight 0.8s ease-out',
        'fadeInLeft': 'fadeInLeft 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'scaleIn': 'scaleIn 0.5s ease-out',
        'scroll-left': 'scroll-left 30s linear infinite',
      },
      keyframes: {
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '25%': { transform: 'translateY(-15px) scale(1.02)' },
          '50%': { transform: 'translateY(-25px) scale(1.03)' },
          '75%': { transform: 'translateY(-15px) scale(1.02)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}

