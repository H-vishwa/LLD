/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#090d16',
          secondary: '#0f172a',
          card: 'rgba(18, 24, 38, 0.75)',
          'card-hover': 'rgba(26, 34, 52, 0.85)',
          elevated: '#1e293b',
          border: 'rgba(255, 255, 255, 0.08)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-indigo': '0 0 25px rgba(99, 102, 241, 0.25)',
        'glow-sm': '0 0 15px rgba(99, 102, 241, 0.2)',
        'card-subtle': '0 8px 30px rgba(0, 0, 0, 0.35), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
