import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          DEFAULT: '#080611',
          900: '#080611',
        },
        violet: {
          accent: '#9b6bff',
          hover: '#b18fff',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      animation: {
        'accent-pulse': 'accentPulse 7s ease-in-out infinite',
      },
      keyframes: {
        accentPulse: {
          '0%, 100%': { boxShadow: '0 0 40px -14px rgba(155, 107, 255, 0.45)' },
          '50%': { boxShadow: '0 0 64px -8px rgba(155, 107, 255, 0.72)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
