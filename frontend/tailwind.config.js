/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',  // Main orange - telecom/construction
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        status: {
          expired: {
            bg: '#FEE2E2',
            border: '#EF4444',
            text: '#991B1B',
            badge: '#DC2626',
          },
          warning: {
            bg: '#FEF3C7',
            border: '#F59E0B',
            text: '#92400E',
            badge: '#D97706',
          },
          active: {
            bg: '#D1FAE5',
            border: '#10B981',
            text: '#065F46',
            badge: '#059669',
          },
          renewed: {
            bg: '#F3F4F6',
            border: '#9CA3AF',
            text: '#374151',
            badge: '#6B7280',
          },
        },
      },
      fontFamily: {
        sans: ['Work Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
