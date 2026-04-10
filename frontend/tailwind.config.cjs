/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#8bb4f2',
          DEFAULT: '#3b82f6',
          dark: '#1e40af',
        },
        secondary: {
          light: '#e0bffa',
          DEFAULT: '#a855f7',
          dark: '#6b21a8',
        },
        success: {
          light: '#bbf7d0',
          DEFAULT: '#22c55e',
          dark: '#15803d',
        },
        warning: {
          light: '#fde68a',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        },
        danger: {
          light: '#fecaca',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
        info: {
          light: '#bae6fd',
          DEFAULT: '#0ea5e9',
          dark: '#075985',
        },
      },
    },
  },
  plugins: [],
};
