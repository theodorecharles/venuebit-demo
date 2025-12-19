/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
        },
        secondary: '#EC4899',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#0F172A',
        surface: {
          DEFAULT: '#1E293B',
          light: '#334155',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
        },
      },
    },
  },
  plugins: [],
}
