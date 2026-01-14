/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS variables
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: '#4F46E5',
        },
        secondary: '#EC4899',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        background: 'var(--color-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          light: 'var(--color-surface-secondary)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
        },
        border: 'var(--color-border)',
      },
    },
  },
  plugins: [],
}
