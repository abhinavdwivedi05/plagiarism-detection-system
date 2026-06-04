/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#1E293B',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        background: '#F8FAFC',
      },
    },
  },
  plugins: [],
}
